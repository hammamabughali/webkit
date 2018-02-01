/// <reference path="../../async/loop.ts"/>
/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../lib/cluster.ts"/>
/// <reference path="../../net/session.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/rand.ts"/>
/// <reference path="../../util/stringex.ts"/>



module kr3m.net.sessionmanagers
{
	export class MySql extends kr3m.net.SessionManager
	{
		private db:kr3m.db.MySqlDb;
		private tableName:string;



		constructor(
			db:kr3m.db.MySqlDb,
			tableName:string = "sessions")
		{
			super();
			this.db = db;
			this.tableName = tableName;
			if (clusterLib.isMaster)
				this.deleteOldDbEntries();
		}



		private deleteOldDbEntries():void
		{
			var threshold = new Date(Date.now() - this.timeToLive);
			var where = this.db.escape("lastUpdate <= ?", [threshold]);
			this.db.deleteBatch(this.tableName, where);
		}



		protected tick():void
		{
			if (clusterLib.isMaster)
				this.deleteOldDbEntries();
		}



		protected getNewSessionId(
			callback:(sessionId:string) => void):void
		{
			kr3m.async.Loop.loop((loopDone) =>
			{
				kr3m.util.Rand.getSecureString(this.idLength, null, (id) =>
				{
					var sql = "SELECT id FROM `" + this.tableName + "` WHERE `id` = ? LIMIT 0,1";
					sql = this.db.escape(sql, [id]);
					this.db.fetchOne(sql, (oldId) =>
					{
						if (!oldId)
							return callback(id);

						loopDone();
					});
				});
			});
		}



		public create(
			callback:(session:kr3m.net.Session) => void):void
		{
			this.getNewSessionId((id) =>
			{
				var session = new kr3m.net.Session(this, id, new Date(), null);
				callback(session);
			});
		}



		public destroy(
			sessionId:string,
			expired?:boolean,
			callback?:Callback):void
		{
			this.db.delete(this.tableName, {id : sessionId}, callback);
		}



		public get(
			sessionId:string,
			callback:(session:kr3m.net.Session) => void):void
		{
			var sql = "SELECT * FROM `" + this.tableName + "` WHERE `id` = ?";
			sql = this.db.escape(sql, [sessionId]);
			this.db.fetchRow(sql, (row:any) =>
			{
				if (!row)
					return callback(null);

				var session = new kr3m.net.Session(this, sessionId, row.lastUpdate, kr3m.util.Json.decode(row.data));
				var data = session.getData();
				if (!data || !data.__kr3m_net_session_link_)
				{
					callback(session);
				}
				else
				{
					this.get(data.__kr3m_net_session_link_, callback);
				}
			});
		}



		public regenerateId(
			session:kr3m.net.Session,
			callback:Callback):void
		{
			this.getNewSessionId((newId:string) =>
			{
				var oldData = session.getData() || {};
				oldData.__kr3m_net_session_link_ = newId;
				// automatically let tick() remove old session id after 10 seconds
				var lastUpdate = new Date(session.getTouched() - this.timeToLive + 10000);
				var oldSession = new kr3m.net.Session(this, session.getId(), lastUpdate, oldData);

				session.setId(newId);
				this.flush(session, () =>
				{
					oldSession.setDirty();
					this.flush(oldSession, callback);
				});
			});
		}



		public release(
			session:kr3m.net.Session,
			callback:Callback):void
		{
			if (session.isDestroyed())
				return callback();

			session.touch();
			this.flush(session, callback);
		}



		public flush(
			session:kr3m.net.Session,
			callback:Callback):void
		{
			if (!session.isDirty())
				return callback();

			this.db.upsert(this.tableName,
			{
				id : session.getId(),
				data : kr3m.util.Json.encode(session.getData()),
				lastUpdate : new Date(session.getTouched())
			}, callback);
		}
	}
}

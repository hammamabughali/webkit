/// <reference path="../../async/if.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../net2/sessionmanagers/abstract.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/rand.ts"/>



module kr3m.net2.sessionmanagers
{
	export class MySql extends Abstract
	{
		public static TABLE_CREATE_SCRIPT = "//# EMBED(embed/sessiontable.sql, jsonNoQuotes)";

		public sessionCookieName = "kr3mN2Id";
		public idLength = 32;



		constructor(
			protected db:kr3m.db.MySqlDb,
			protected tableName = "sessions")
		{
			super();

			if (!clusterLib.worker)
				this.deleteOldSessions();
		}



		protected deleteOldSessions():void
		{
			var threshold = Date.now() - Session.timeToLive;
			var where = this.db.escape("`lastUpdated` < ?", [threshold]);
			this.db.deleteBatch(this.tableName, where, (deletedCount:number) =>
			{
				if (deletedCount > 0)
					logDebug("deleted", deletedCount, "old sessions");
				setTimeout(() => this.deleteOldSessions(), Session.timeToLive / 2);
			});
		}



		protected getSql(sessionId:string):string
		{
			var sql = "SELECT * FROM `" + this.tableName + "` WHERE `id` = ?";
			sql = this.db.escape(sql, [sessionId]);
			return sql;
		}



		protected getFreeSessionId(
			callback:StringCallback,
			errorCallback?:StringCallback):void
		{
			var id:string;
			kr3m.async.Loop.loop((loopDone) =>
			{
				kr3m.util.Rand.getSecureString(this.idLength, null, (secString) =>
				{
					id = secString;
					var sql = this.getSql(id);
					this.db.fetchOne(sql, (dummy) => loopDone(!!dummy), errorCallback);
				});
			}, () => callback(id));
		}



		protected buildSession(row:any, dirty:boolean):Session
		{
			var values = row.valuesJson ? kr3m.util.Json.decode(row.valuesJson) : {};
			var session = new Session(row.id, row.lastUpdated, values);
			session.setDirty();
			return session;
		}



		public get(
			context:kr3m.net2.Context,
			callback:CB<Session>):void
		{
			var sessionId = context.request.getCookieValue(this.sessionCookieName) || "";
			var sql = this.getSql(sessionId);
			this.db.fetchRow(sql, (row) =>
			{
				if (row && !row.isDestroyed)
					return callback(this.buildSession(row, true));

				this.getFreeSessionId((sessionId) =>
				{
					row = {id : sessionId, lastUpdated : Date.now()};
					this.db.insert(this.tableName, row, () =>
					{
						callback(this.buildSession(row, false));
					}, () => callback(undefined));
				}, () => callback(undefined));
			});
		}



		private handleReleasedChange(session:Session):void
		{
			//# TODO: do have to sync values with already changed database states here?
			var row =
			{
				id : session.id,
				lastUpdated : Date.now(),
				valuesJson : session.getValuesJson()
			};
			this.db.update(this.tableName, row);
		}



		public release(
			context:kr3m.net2.Context,
			session:Session,
			callback:Callback):void
		{
			session.release();
			session.on(Session.EVENT_DIRTY, () => this.handleReleasedChange(session));
			context.response.setCookie(this.sessionCookieName, session.id, session.getExpiry(), true);
			if (!session.isDirty())
				return callback();

			var row =
			{
				id : session.id,
				lastUpdated : Date.now(),
				valuesJson : session.getValuesJson()
			};
			this.db.update(this.tableName, row, callback);
		}



		public regenerate(
			context:kr3m.net2.Context,
			session:Session,
			callback:Callback):void
		{
			this.getFreeSessionId((newId) =>
			{
				session.id = newId;
				session.setDirty();
				callback();
			});
		}



		public destroy(
			context:kr3m.net2.Context,
			session:Session,
			callback:Callback):void
		{
			var sql = "UPDATE `" + this.tableName + "` SET `isDestroyed` = 'true' WHERE `id` = ? LIMIT 1;";
			sql = this.db.escape(sql, [session.id]);
			this.db.query(sql, () => callback());
		}
	}
}

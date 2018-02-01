/// <reference path="../../net/session.ts"/>
/// <reference path="../../util/rand.ts"/>



module kr3m.net.sessionmanagers
{
	export class Memory extends kr3m.net.SessionManager
	{
		private sessions:{[id:string]:Session} = {};



		protected tick():void
		{
			var threshold = Date.now() - this.timeToLive;
			var expiredIds:string[] = [];

			for (var i in this.sessions)
			{
				if (this.sessions[i].getTouched() <= threshold)
					expiredIds.push(i);
			}

			for (var j = 0; j < expiredIds.length; ++j)
				this.destroy(expiredIds[j], true);
		}



		protected getNewSessionId(
			callback:(sessionId:string) => void):void
		{
			kr3m.async.Loop.loop((loop:(again:boolean) => void) =>
			{
				kr3m.util.Rand.getSecureString(this.idLength, null, (id:string) =>
				{
					if (!this.sessions[id])
						return callback(id);

					loop(true);
				});
			});
		}



		public create(
			callback:(session:kr3m.net.Session) => void):void
		{
			this.getNewSessionId((id:string) =>
			{
				var session = new kr3m.net.Session(this, id, new Date(), null);
				this.sessions[id] = session;
				callback(session);
			});
		}



		public destroy(
			sessionId:string, expired?:boolean,
			callback?:() => void):void
		{
			var session:kr3m.net.Session = this.sessions[sessionId];
			delete this.sessions[sessionId];
			callback && callback();
		}



		public get(
			sessionId:string,
			callback:(session:kr3m.net.Session) => void):void
		{
			var session = this.sessions[sessionId];
			if (!session)
				return callback(session);

			session.touch();
			callback(session);
		}



		public regenerateId(
			session:kr3m.net.Session,
			callback:() => void):void
		{
			this.getNewSessionId((newId:string) =>
			{
				var oldId = session.getId();
				this.sessions[newId] = this.sessions[oldId];
				this.sessions[newId].setId(newId);
				delete this.sessions[oldId];
				callback();
			});
		}



		public release(
			session:kr3m.net.Session,
			callback:() => void):void
		{
			session.touch();
			callback();
		}



		public flush(
			session:kr3m.net.Session,
			callback:() => void):void
		{
			callback();
		}
	}
}

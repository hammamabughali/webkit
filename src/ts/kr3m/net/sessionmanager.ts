/// <reference path="../net/session.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.net
{
	export abstract class SessionManager
	{
		protected idLength = 32;
		protected timeToLive = 60 * 60 * 1000;
		protected tickInterval = 10000;
		protected tickTimer:any;



		constructor()
		{
			this.tickTimer = setInterval(() => this.tick(), this.tickInterval);
		}



		/*
			Setzt, wie lange Sessions gültig bleiben, wenn sie nicht
			benötigt werden (in Sekunden).
		*/
		public setTimeToLive(duration:number):void
		{
			this.timeToLive = duration * 1000;
			clearInterval(this.tickTimer);
			this.tickInterval = Math.min(Math.ceil(this.timeToLive / 2), 10000);
			this.tickTimer = setInterval(this.tick.bind(this), this.tickInterval);
		}



		/*
			Gibt die Lebensdauer der Sessions (in Sekunden) zurück.
		*/
		public getTimeToLive():number
		{
			return this.timeToLive / 1000;
		}



		public getFromRequest(
			request:any,
			callback:(session:kr3m.net.Session) => void):void
		{
			var ids:string[] = [];
			if (request.headers.cookie)
			{
				// check up to 5 cookies with the name sesssionId
				var cookies = request.headers.cookie.split("; ");
				for (var i = 0; (i < cookies.length) && (ids.length < 5); ++i)
				{
					var pos = cookies[i].indexOf('=');
					if ((pos > 0) && (cookies[i].substr(0, pos) == "sessionId"))
					{
						ids.push(decodeURIComponent(cookies[i].substr(pos + 1).trim()));
					}
				}
			}
			if (ids.length == 0)
				return this.create(callback);

			kr3m.async.Loop.forEach(ids, (id:string, next:() => void) =>
			{
				this.get(id, (session:kr3m.net.Session) =>
				{
					if (session)
						return callback(session);

					next();
				});
			}, () => this.create(callback));
		}



		protected abstract tick():void;
		protected abstract getNewSessionId(callback:(sessionId:string) => void):void;

		public abstract create(callback:(session:kr3m.net.Session) => void):void;
		public abstract destroy(sessionId:string, expired?:boolean, callback?:() => void):void;
		public abstract get(sessionId:string, callback:(session:kr3m.net.Session) => void):void;
		public abstract regenerateId(session:kr3m.net.Session, callback:() => void):void;
		public abstract release(session:kr3m.net.Session, callback:() => void):void;
		public abstract flush(session:kr3m.net.Session, callback:() => void):void;
	}
}

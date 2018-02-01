/// <reference path="../net/sessionmanager.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.net
{
	export class Session
	{
		private id:string;
		private data:any;

		private touched:number;

		private dirty = false;
		private destroyed = false;

		private manager:kr3m.net.SessionManager;



		constructor(manager:kr3m.net.SessionManager, id:string, touched:Date, data:any)
		{
			this.manager = manager;
			this.id = id;
			this.touched = touched.getTime();
			this.data = data;
		}



		public setId(id:string):void
		{
			if (this.id == id)
				return;

			this.id = id;
			this.setDirty();
		}



		public getId():string
		{
			return this.id;
		}



		public setDirty():void
		{
			this.dirty = true;
		}



		public isDirty():boolean
		{
			return this.dirty;
		}



		public isDestroyed():boolean
		{
			return this.destroyed;
		}



		public getTouched():number
		{
			return this.touched;
		}



		public touch():void
		{
			var now = Date.now();
			var ttl = this.manager.getTimeToLive();
			if (now - this.touched > ttl * 1000 / 10)
				this.dirty = true;
			this.touched = now;
		}



		public getExpiry():Date
		{
			if (!this.dirty)
				return null;

			var ttl = this.manager.getTimeToLive();
			var expires = this.touched + ttl * 1000;
			if (this.destroyed)
				expires -= (ttl * 1000) + (60 * 60 * 1000 * 24);
			return new Date(expires);
		}



		public release(callback:() => void):void
		{
			this.manager.release(this, callback);
		}



		public getData():any
		{
			return kr3m.util.Util.clone(this.data);
		}



		public setData(data:any):void
		{
			if (kr3m.util.Util.equal(this.data, data))
				return;

			this.data = kr3m.util.Util.clone(data);
			this.setDirty();
		}



		/*
			Erstellt eine neue ID für die Session und verwirft
			die alte. Ist eine Sicherheitsmaßnahme gegen
			Cross-Site Request Forgery Attacken. Sollte im Prinzip
			immer dann ausgeführt werden, wenn sich der User
			eingeloggt hat oder registriert hat, damit seine alte
			"uneingeloggte" Session nicht mehr gültig ist.
		*/
		public regenerateId(callback:() => void):void
		{
			this.manager.regenerateId(this, callback);
		}



		public destroy(
			callback?:() => void):void
		{
			this.destroyed = true;
			this.manager.destroy(this.getId(), false, callback);
			this.setId("deleted");
		}



		public flush(
			callback?:() => void):void
		{
			this.manager.flush(this, () => callback && callback());
		}
	}
}

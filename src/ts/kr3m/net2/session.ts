/// <reference path="../model/eventdispatcher.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.net2
{
	export class Session extends kr3m.model.EventDispatcher
	{
		public static readonly EVENT_DELETE = "delete";
		public static readonly EVENT_DESTROY = "destroy";
		public static readonly EVENT_DIRTY = "dirty";
		public static readonly EVENT_SET = "set";
		public static readonly EVENT_RELEASE = "release";

		public static timeToLive = 60 * 60 * 1000;

		private dirty = false;
		private released = false;



		constructor(
			public id:string,
			private lastUpdated:number = 0,
			private values:{[name:string]:any} = {})
		{
			super();
		}



		public setDirty():void
		{
			this.dirty = true;
			this.dispatch(Session.EVENT_DIRTY);
		}


		public isDirty():boolean
		{
			return this.dirty;
		}



		public release():void
		{
			this.released = true;
			this.dispatch(Session.EVENT_RELEASE);
		}



		public isReleased():boolean
		{
			return this.released;
		}



		public getValue(name:string):any
		{
			return this.values[name];
		}



		public getValuesJson():string
		{
			return kr3m.util.Json.encode(this.values);
		}



		public setValue(name:string, value:any):void
		{
			this.values[name] = value;
			this.dispatch(Session.EVENT_SET);
			this.setDirty();
		}



		public deleteValue(name:string):void
		{
			delete this.values[name];
			this.dispatch(Session.EVENT_DELETE);
			this.setDirty();
		}



		public getExpiry():Date
		{
			return new Date(this.lastUpdated + Session.timeToLive);
		}
	}
}

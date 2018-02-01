/// <reference path="../../model/eventdispatcher.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.cache.files
{
	export abstract class Abstract extends kr3m.model.EventDispatcher
	{
		public abstract getFile(path:string, callback:CB<Buffer>):void;
		public abstract getTextFile(path:string, callback:CB<string>):void;
		public abstract getModified(path:string, callback:CB<Date>):void;
		public abstract setDirty(path:string, callback?:Callback):void;
	}
}

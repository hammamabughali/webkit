/// <reference path="../../types.ts"/>



module kr3m.mulproc.sharedmemory
{
	export abstract class Abstract
	{
		public abstract setValue(name:string, value:any, callback?:Callback):void;
		public abstract getValue(name:string, callback:AnyCallback):void;
	}
}

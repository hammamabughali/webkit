/// <reference path="../../lib/cluster.ts"/>
/// <reference path="../../mulproc/sharedmemory/abstract.ts"/>



module kr3m.mulproc.sharedmemory
{
	export class Cluster extends kr3m.mulproc.sharedmemory.Abstract
	{
		constructor(private id:string)
		{
			super();
		}



		public setValue(name:string, value:any, callback?:Callback):void
		{
			//# TODO: NYI setValue
			throw new Error("kr3m.mulproc.sharedmemory.Cluster.setValue() NYI");
		}



		public getValue(name:string, callback:AnyCallback):void
		{
			//# TODO: NYI getValue
			throw new Error("kr3m.mulproc.sharedmemory.Cluster.getValue() NYI");
		}
	}
}

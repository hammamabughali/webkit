/// <reference path="../../net/subserver2.ts"/>



module kr3m.net.subservers
{
	export class Wrapper extends SubServer2
	{
		constructor(private requestListener:HandleFunction)
		{
			super();
		}



		public handleRequest(
			context:RequestContext,
			callback:BooleanCallback):void
		{
			this.requestListener(context, callback);
		}
	}
}

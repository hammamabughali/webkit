/// <reference path="../../net2/context.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.net2.routers
{
	export abstract class Abstract
	{
		public abstract route(
			context:Context,
			callback:Callback):void;

		public abstract reroute(
			context:Context,
			callback:Callback):void;
	}
}

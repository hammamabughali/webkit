/// <reference path="../net/requestcontext.ts"/>
/// <reference path="../types.ts"/>



module kr3m.net
{
	export type HandleFunction = (context:RequestContext, callback:BooleanCallback) => void;



	export abstract class SubServer2
	{
		protected appServer:AppServer;



		public setAppServer(appServer:AppServer):void
		{
			this.appServer = appServer;
		}



		public needsSession(
			context:RequestContext,
			callback:BooleanCallback):void
		{
			// abgeleitete Klassen sollten das hier überschreiben und ggf. auf false setzen wenn sie die Session nicht brauchen
			callback(true);
		}



		public abstract handleRequest(
			context:RequestContext,
			callback:BooleanCallback):void;
	}
}

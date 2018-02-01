/// <reference path="../lib/node.ts"/>
/// <reference path="../net2/configs/http.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.net2
{
	export class HttpServer
	{
		protected rawServer:any;



		constructor(
			protected config:kr3m.net2.configs.Http,
			listener:(request:any, response:any) => void)
		{
			this.rawServer = httpLib.createServer(listener).listen(this.config.port);
			log("HTTP server listening on port " + this.config.port);
		}



		public shutdown(callback:Callback):void
		{
			log("HTTP server shutting down");
			this.rawServer.close(() =>
			{
				log("HTTP server shut down");
				callback();
			});
		}
	}
}

/// <reference path="../lib/node.ts"/>
/// <reference path="../net2/configs/https.ts"/>
/// <reference path="../types.ts"/>



module kr3m.net2
{
	export class HttpsServer
	{
		protected rawServer:any;



		constructor(
			protected config:kr3m.net2.configs.Https,
			listener:(request:any, response:any) => void)
		{
			var options:any =
			{
				secureProtocol : "SSLv23_method",
				secureOptions : constantsLib.SSL_OP_NO_SSLv3,
				key : fsLib.readFileSync(this.config.key, "utf8"),
				cert : fsLib.readFileSync(this.config.certificate, "utf8")
			};

			if (this.config.intermediate != "")
				options.ca = this.loadBundle(this.config.intermediate);

			this.rawServer = httpsLib.createServer(options, listener).listen(this.config.port);
			log("HTTPS server listening on port " + this.config.port);
		}



		private loadBundle(bundlePath:string):string[]
		{
			var content = fsLib.readFileSync(bundlePath, "utf8");
			var lines = content.split("\n");
			var results:string[] = [];
			for (var i = 0; i < lines.length; ++i)
			{
				if (lines[i].indexOf("-----BEGIN CERTIFICATE-----") == 0)
					results.push("");
				results[results.length - 1] += lines[i] + "\n";
			}
			return results;
		}



		public shutdown(callback:Callback):void
		{
			log("HTTPS server shutting down");
			this.rawServer.close(() =>
			{
				log("HTTPS server shut down");
				callback();
			});
		}
	}
}

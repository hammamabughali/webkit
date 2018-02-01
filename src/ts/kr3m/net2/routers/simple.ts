/// <reference path="../../cache/files/localfiles.ts"/>
/// <reference path="../../net2/routers/abstract.ts"/>



module kr3m.net2.routers
{
	export class Simple extends Abstract
	{
		public cache = kr3m.cache.files.LocalFiles.getInstance();



		constructor(
			public indexFileName:string = "index.html")
		{
			super();
		}



		public route(
			context:Context,
			callback:Callback):void
		{
			var uri = context.getCurrentUri();
			uri = uri.replace(/\/\/+/g, "/");
			context.setCurrentUri(uri);
			callback();
		}



		public reroute(
			context:Context,
			callback:Callback):void
		{
			var uri = context.getCurrentUri();
			if (uri.slice(-1) != "/")
			{
				var filename = uri.split("/").pop();
				if (filename.indexOf(".") >= 0)
					return callback();

				this.cache.fileExists(context.documentRoot + uri + ".html", (exists) =>
				{
					if (exists)
						context.setCurrentUri(uri + ".html");
					callback();
				});
				return;
			}

			this.cache.fileExists(context.documentRoot + uri + this.indexFileName, (exists) =>
			{
				if (exists)
				{
					context.setCurrentUri(uri + this.indexFileName);
					return callback();
				}

				context.setCurrentUri(uri.slice(0, -1));
				this.reroute(context, callback);
			});
		}
	}
}

/// <reference path="../../../cache/files/localfiles.ts"/>
/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/subserver2.ts"/>



module kr3m.net.subservers.files
{
	export class FolderServer extends kr3m.net.SubServer2
	{
		protected cache = kr3m.cache.files.LocalFiles.getInstance();



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			fsLib.exists(context.uriResourcePath, (exists:boolean) =>
			{
				if (!exists)
					return callback(false);

				fsLib.stat(context.uriResourcePath, (err:any, stats:any) =>
				{
					if (!stats.isDirectory())
						return callback(false);

					if (context.uri.slice(-1) != "/")
					{
						var newUrl = this.appServer.getBaseUrl() + context.uri.slice(1) + "/";
						context.return301(newUrl);
						return callback(true);
					}

					var indexPath = context.uriResourcePath + "index.html";
					this.cache.getFile(indexPath, (file:Buffer) =>
					{
						if (!file)
							return callback(false);

						var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(indexPath);
						context.sendCookies = false;
						context.setResponseContent(file, contentType, "binary");
						context.flushResponse(200);
						callback(true);
					});
				});
			});
		}
	}
}

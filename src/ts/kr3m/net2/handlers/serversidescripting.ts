/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net/mimetypes.ts"/>
/// <reference path="../../net2/handlers/filesystem.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.net2.handlers
{
	/*
		Die abstrakte Basisklasse für alle Handler, die serverseitiges
		Skripting (Textersetzung) in HTML-Dateien und vergleichbarem anbieten.
	*/
	export abstract class ServerSideScripting extends FileSystem
	{
		protected abstract process(
			context:Context,
			content:string,
			callback:StringCallback):void;



		protected deliverResource(
			context:Context):void
		{
			var realPath = context.documentRoot + context.getCurrentUri();
			var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);
			this.cache.getFile(realPath, [], (file) =>
			{
				if (!file)
					return context.flush(404);

				var content = file.toString("utf8");
				this.process(context, content, (processedContent) =>
				{
					if (content != processedContent)
						context.response.disableBrowserCaching();
					else
						context.response.cacheUntil(new Date(Date.now() + 10 * 60 * 1000));

					context.flush(200, processedContent, contentType);
				});
			});
		}
	}
}

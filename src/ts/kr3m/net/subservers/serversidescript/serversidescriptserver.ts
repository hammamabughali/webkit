/// <reference path="../../../cache/files/localfiles.ts"/>
/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/mimetypes.ts"/>
/// <reference path="../../../net/subserver2.ts"/>



module kr3m.net.subservers.serversidescript
{
	export abstract class ServerSideScriptServer extends kr3m.net.SubServer2
	{
		public needsSession(
			context:kr3m.net.RequestContext,
			callback:(needSession:boolean) => void):void
		{
			callback(false);
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			callback(true);

			kr3m.cache.files.LocalFiles.getInstance().getTextFile(context.uriResourcePath, (fileContent:string) =>
			{
				if (!fileContent)
					return context.return404(context.uri);

				this.process(context, fileContent, (proccessedContent:string) =>
				{
					var contentType = MimeTypes.getMimeTypeByUrl(context.uriResourcePath);
					context.setResponseContent(proccessedContent, contentType);
					context.flushResponse(200);
				});
			});
		}



		protected abstract process(
			context:kr3m.net.RequestContext, content:string,
			callback:(processedContent:string) => void):void;
	}
}

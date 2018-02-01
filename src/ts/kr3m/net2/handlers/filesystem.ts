/// <reference path="../../cache/files/localfiles.ts"/>
/// <reference path="../../net/mimetypes.ts"/>
/// <reference path="../../net2/handlers/abstract.ts"/>



module kr3m.net2.handlers
{
	/*
		Default handler for requests to static files located
		on the server's file system.
	*/
	export class FileSystem extends Abstract
	{
		public cache = kr3m.cache.files.LocalFiles.getInstance();



		constructor(
			uriPattern = /[^\/]$/)
		{
			super(uriPattern);
		}



		public getResourceRealpath(context:Context):string
		{
			return context.documentRoot + context.getCurrentUri();
		}



		protected deliverResource(
			context:Context):void
		{
			var acceptedEncodings = (context.request.getHeader("accept-encoding") || "").split(/\s*,\s*/).filter(e => e);
			var realPath = this.getResourceRealpath(context);
			var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);
			if (!kr3m.net.MimeTypes.isTextType(contentType))
				acceptedEncodings = [];

			this.cache.getFile(realPath, acceptedEncodings, (file, encoding, modified) =>
			{
				if (!file)
					return context.flush(404);

				modified.setMilliseconds(0);
				context.response.setLastModified(modified);
				context.response.cacheFor(365 * 24 * 60 * 60 * 1000);

				var ifModified = context.request.getIfModified();
				if (ifModified)
				{
					ifModified.setMilliseconds(0);
					if (ifModified.getTime() >= modified.getTime())
						return context.flush(304);
				}

				if (encoding)
					context.response.setHeader("Content-Encoding", encoding);

				context.flush(200, file, contentType, "binary");
			});
		}



		public handle(context:Context):void
		{
			var resourcePath = this.getResourceRealpath(context);
			this.cache.fileExists(resourcePath, (exists) =>
			{
				if (!exists)
					return context.flush(404);

				this.deliverResource(context);
			});
		}
	}
}

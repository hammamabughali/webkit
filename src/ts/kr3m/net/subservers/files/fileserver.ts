/// <reference path="../../../cache/files/localfiles.ts"/>
/// <reference path="../../../net/mimetypes.ts"/>
/// <reference path="../../../net/subserver2.ts"/>
/// <reference path="../../../util/stringex.ts"/>



module kr3m.net.subservers.files
{
	export class FileServer extends kr3m.net.SubServer2
	{
		protected cache = kr3m.cache.files.LocalFiles.getInstance();


		constructor(
			protected cacheDuration:number = 60 * 60 * 1000,
			protected etag:string = null)
		{
			super();
		}



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
			var acceptedEncodings = (context.request.headers["accept-encoding"] || "").split(/\s*,\s*/).filter(e => e);
			var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(context.uriResourcePath);
			if (!kr3m.net.MimeTypes.isTextType(contentType))
				acceptedEncodings = [];

			this.cache.getFile(context.uriResourcePath, acceptedEncodings, (file, encoding, modified) =>
			{
				if (!file)
					return callback(false);

				context.cacheFor(this.cacheDuration);
				context.setETag(this.etag);

				if (modified)
				{
					var ifModified = context.getIfModified();
					if (ifModified && ifModified >= modified)
						return context.return304();

					context.setLastModified(modified);
				}

				if (encoding)
					context.setResponseHeader("Content-Encoding", encoding);

				context.sendCookies = false;
				context.setResponseContent(file, contentType, "binary");
				context.flushResponse(200);
				callback(true);
			});
		}
	}
}

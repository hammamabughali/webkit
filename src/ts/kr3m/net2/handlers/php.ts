/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net/mimetypes.ts"/>
/// <reference path="../../net2/handlers/filesystem.ts"/>
/// <reference path="../../php/sandbox.ts"/>



module kr3m.net2.handlers
{
	/*
		Ein Handler, der eine Anfrage ungefiltert in php-cgi
		ausführt und das Ergebnis wieder an den User zurück
		schickt.
	*/
	export class Php extends kr3m.net2.handlers.FileSystem
	{
		constructor(
			uriPattern:RegExp = /\.(?:php|phtml)$/)
		{
			super(uriPattern);
		}



		protected deliverResource(
			context:kr3m.net2.Context):void
		{
			var sandbox = new kr3m.php.Sandbox();
//# RELEASE
			sandbox.showPhpErrors = false;
//# /RELEASE
			var realPath = context.documentRoot + context.getCurrentUri();
			kr3m.php.CgiOptions.fromRequest(context.request, realPath, context.environment, (options) =>
			{
				sandbox.runCGI(options, (status, output, headers) =>
				{
					var mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);

					context.response.setHeaders(headers);

					if (status == kr3m.ERROR_FILE)
						return context.flush(404, output, mimeType);

					if (status != kr3m.SUCCESS)
						return context.flush(500, output, mimeType);

					var httpStatus = 200;
					var statusHeader = headers.get("Status");
					if (statusHeader)
					{
						var match = statusHeader.match(/^(\d+)/);
						if (match)
							httpStatus = parseInt(match[1], 10);
					}
					context.flush(httpStatus, output, mimeType);
				});
			});
		}
	}
}

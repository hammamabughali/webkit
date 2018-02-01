/// <reference path="../net2/headers.ts"/>
/// <reference path="../net2/request.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/url.ts"/>



module kr3m.php
{
	export class CgiOptions
	{
		public content:string|Buffer;

		public environment:any =
		{
			CONTENT_LENGTH : 0,
			CONTENT_TYPE : "text/plain",
			// DOCUMENT_ROOT : "",
			// DOCUMENT_URI : "",
			// FCGI_ROLE : "",
			GATEWAY_INTERFACE : "CGI/1.1",
			// HOME : "",
			// HTTPS : "",
			HTTP_ACCEPT : "text/html,application/xhtml+xml,application/xml,q:0.9,*/*,q:0.8",
			HTTP_ACCEPT_ENCODING : "gzip, deflate",
			HTTP_ACCEPT_LANGUAGE : "en-US,en,q:0.5",
			// HTTP_CONNECTION : "",
			HTTP_COOKIE : "",
			HTTP_HOST : "",
			HTTP_USER_AGENT : "Mozilla/5.0 (X11, Ubuntu, Linux x86_64, rv:20.0) Gecko/20100101 Firefox/20.0",
			PATH_INFO : "",
			// PHP_SELF : "",
			QUERY_STRING : "",
			REDIRECT_STATUS : 200,
			// REMOTE_ADDR : "",
			// REMOTE_PORT : 0,
			REQUEST_METHOD : "GET",
			// REQUEST_TIME : 0,
			REQUEST_URI : "",
			SCRIPT_FILENAME : "",
			SCRIPT_NAME : "",
			// SERVER_ADDR : "",
			SERVER_NAME : "",
			SERVER_PORT : 80,
			SERVER_PROTOCOL : "HTTP/1.1"
			// SERVER_SOFTWARE : "",
			// USER : "",
		}



		public static fromRequest(
			request:kr3m.net2.Request,
			scriptRealPath:string,
			environment:{[name:string]:string},
			callback:CB<CgiOptions>):void
		{
			request.getBinaryContent((content) =>
			{
				var options = new kr3m.php.CgiOptions();
				options.environment.REQUEST_METHOD = request.getMethod();

				options.environment.SCRIPT_FILENAME = scriptRealPath;
				options.environment.SCRIPT_NAME = kr3m.util.File.getFilenameFromPath(scriptRealPath);

				var urlParts = kr3m.util.Url.parse(request.getLocation());
				options.environment.HTTP_HOST = urlParts.domain;
				options.environment.QUERY_STRING = urlParts.query;
				options.environment.REQUEST_URI = urlParts.resource;
				options.environment.SERVER_NAME = urlParts.domain;
				if (urlParts.port)
					options.environment.SERVER_PORT = parseInt(urlParts.port, 10);

				var headers = request.getHeaders();
				headers.forEach((name, value) =>
				{
					name = "HTTP_" + name.toUpperCase().replace(/\-/g, "_");
					if (options.environment[name] !== undefined)
						options.environment[name] = value;
				});
				options.environment.CONTENT_TYPE = headers.get("content-type") || options.environment.CONTENT_TYPE;

				for (var name in environment)
					options.environment[name] = environment[name];

				if (content)
				{
					options.environment.CONTENT_LENGTH = content.length;
					options.content = content;
				}
				callback(options);
			});
		}
	}
}

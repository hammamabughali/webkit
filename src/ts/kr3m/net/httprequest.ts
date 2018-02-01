/// <reference path="../lib/node.ts"/>
/// <reference path="../net/mimetypes.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/url.ts"/>



module kr3m.net
{
	/*
		Convenience class / wrapper for node.js' http' and https'
		request(). This class can be used to easily send http(s)
		requests from a node.js application to desired urls and
		get the results as callbacks.
	*/
	export class HttpRequest
	{
		public static HTTP_POST = "POST";
		public static HTTP_GET = "GET";

		private url:string;
		private method:string;
		private params:{[name:string]:any};

		private headers:{[name:string]:string|string[]} = {};
		private body:Buffer|string;
		private contentType:string;

		private auth:string;
		private rejectSelfSigned = true;
		private followRedirection = true;

		private timeout:number;
		private timeoutCallback:Callback;

		public arrayHandling:kr3m.util.ArrayHandling = kr3m.util.ArrayHandling.ToString;
		public convertTextFiles = true; // if true, convert results with mimetypes indicating text to strings before returning them in to the callback functions



		constructor(url:string, params?:{[name:string]:any}, method:string = HttpRequest.HTTP_POST)
		{
			this.url = url;
			this.params = params;
			this.method = method;
		}



		public getUrl():string
		{
			return this.url;
		}



		public getMethod():string
		{
			return this.method;
		}



		public setBody(body:Buffer|string, contentType?:string):void
		{
			this.body = body;
			this.contentType = contentType;
			if (this.method == "POST")
				this.params = null;
		}



		public setHttpAuth(user:string, password:string):void
		{
			this.auth = user + ":" + password;
		}



		public setHeaders(headers:{[name:string]:string|string[]}):void
		{
			this.headers = headers || {};
		}



		public setHeader(name:string, value:string|string[]):void
		{
			this.headers[name] = value;
		}



		public addHeader(name:string, value:string|string[]):void
		{
			// deprecated function name
			this.setHeader(name, value);
		}



		public setParams(params:{[name:string]:any}):void
		{
			this.params = params;
		}



		public rejectSelfSignedCertificates(value:boolean = true):void
		{
			this.rejectSelfSigned = value;
		}



		public setTimeout(timeout:number, timeoutCallback?:Callback):void
		{
			this.timeout = timeout;
			this.timeoutCallback = timeoutCallback;
		}



		public send(
			callback?:(response:string|Buffer, mimeType:string, headers:{[name:string]:string|string[]}) => void,
			errorCallback?:(errorMessage:string, statusCode:number, headers:{[name:string]:string|string[]}, errorBody:string) => void):void
		{
			var urlObj = kr3m.util.Url.parse(this.url);
			var options:any =
			{
				agent : false,
				hostname : urlObj.domain,
				protocol : urlObj.protocol ? urlObj.protocol + ":" : "http:",
				port : urlObj.port || undefined,
				path : kr3m.util.Url.getPath(urlObj),
				method : this.method,
				rejectUnauthorized : this.rejectSelfSigned,
				headers : {}
			};

			if (this.auth)
				options.auth = this.auth;

			for (var i in this.headers)
				options.headers[i] = this.headers[i];

			if (this.method == "POST" && this.params)
			{
				this.body = querystringLib.stringify(this.params);
				options.headers["Content-Length"] = this.body.length;
				this.contentType = "application/x-www-form-urlencoded";
			}
			else if (this.method == "GET")
			{
				if (this.params)
					options.path = kr3m.util.Url.addParameters(options.path, this.params, this.arrayHandling);
			}

			if (this.body)
				options.headers["Content-Length"] = this.body.length;

			if (this.contentType)
				options.headers["Content-Type"] = this.contentType;

			var lib = options.protocol == "https:" ? httpsLib : httpLib;
			var request = lib.request(options, (response:any) =>
			{
				var contentType = response.headers["content-type"] || "";
				var binContent = new Buffer(0);
				response.on("data", (chunk:Buffer) =>
				{
					binContent = Buffer.concat([binContent, chunk]);
				});

				response.on("end", () =>
				{
					if (response.statusCode >= 200 && response.statusCode < 300)
					{
						if (this.convertTextFiles && MimeTypes.isTextType(contentType))
							return callback && callback(binContent.toString("utf8"), contentType, response.headers);
						else
							return callback && callback(binContent, contentType, response.headers);
					}

					if ((response.statusCode == 301 || response.statusCode == 302)
						&& this.followRedirection && response.headers.location)
					{
						this.url = response.headers.location;
						this.send(callback, errorCallback);
						return;
					}

					if (errorCallback)
						return errorCallback(binContent.toString(), response.statusCode, response.headers, binContent.toString());

					logError("HttpRequest to " + this.url + " returned with code", response.statusCode);
					logError(response.headers);
					logError(binContent.toString());
				});
			});

			if (this.timeout)
			{
				request.setTimeout(this.timeout, () =>
				{
					request.abort();
					this.timeoutCallback && this.timeoutCallback();
				});
			}

			request.on("abort", () =>
			{
				var errorMessage = "HttpRequest to " + this.url + " was aborted";
				if (this.timeout)
					errorMessage = "HttpRequest to " + this.url + " timed out";

				errorMessage += this.url;

				if (errorCallback)
					return errorCallback(errorMessage, -2, {}, "");

				logWarning(errorMessage);
			});

			request.on("error", (err:Error) =>
			{
				if (errorCallback)
					return errorCallback(err.message || err.toString(), -1, {}, "");

				logError("HttpRequest to " + this.url + " returned with error");
				logError(err);
			});

			if (this.body)
				request.write(this.body);

			request.end();
		}



		/*
			Send a get request to the given url and save the result
			as a local file under filePath.
		*/
		public static download(
			url:string,
			filePath:string,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			var request = new HttpRequest(url, null, "GET");
			request.send((response, mimeType) =>
			{
				fsLib.writeFile(filePath, response, (err:Error) =>
				{
					if (err)
						return errorCallback && errorCallback();

					callback && callback();
				});
			}, () => errorCallback && errorCallback());
		}
	}
}

/// <reference path="../lib/node.ts"/>
/// <reference path="../net2/constants.ts"/>
/// <reference path="../net2/cookie.ts"/>
/// <reference path="../net2/headers.ts"/>
/// <reference path="../util/url.ts"/>



module kr3m.net2
{
	export class Response
	{
		private isFlushed = false;

		private headers = new Headers();
		private cookies:{[name:string]:Cookie} = {};
		private data:any;
		private encoding:string;



		constructor(private rawResponse:any)
		{
		}



		public setHeader(name:string, value:string):void
		{
			this.headers.set(name, value);
		}



		public setHeaders(headers:Headers):void
		{
			headers.forEach((name, value) => this.headers.set(name, value));
		}



		public getHeaders():Headers
		{
			var headers = new Headers();
			this.headers.forEach((name, value) => headers.set(name, value));
			return headers;
		}



		public setContent(
			data:any,
			mimeType = "text/plain; charset=utf-8",
			encoding = "utf8"):void
		{
			//# TODO: it would be nice to have the option to compress data using deflate or gzip as requested by the browser
			this.data = data;
			this.encoding = encoding;
			this.headers.set("Content-Type", mimeType);
		}



		public setCookie(
			name:string,
			value:string,
			expires?:Date,
			isHttpOnly = false):void
		{
			this.cookies[name] = new Cookie(name, value, expires, isHttpOnly);
		}



		public getCookie(name:string):Cookie
		{
			return this.cookies[name];
		}



		public getCookieValue(name:string):string
		{
			return this.cookies[name] ? this.cookies[name].value : undefined;
		}



		public disableBrowserCaching():void
		{
			this.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
			this.headers.set("Expires", "0");
			this.headers.set("Pragma", "no-cache");
			this.headers.delete("ETag");
			this.headers.delete("Last-Modified");
		}



		public cacheUntil(date:Date):void
		{
			this.headers.set("Cache-Control", "public");
			this.headers.set("Expires", date.toUTCString());
			this.headers.delete("Pragma");
		}



		public cacheFor(duration:number):void
		{
			var date = new Date(Date.now() + duration);
			this.cacheUntil(date);
			this.headers.set("Cache-Control", "max-age=" + Math.floor(duration / 1000));
		}



		public setLastModified(date:Date):void
		{
			this.headers.set("Last-Modified", date.toUTCString());
		}



		/*
			Marks the response with an ETag header. Future requests
			to this file can than be compared to this header's value
			and if nothing has changed, an appropriately small response
			can be sent to the browser. isWeak denotes whether strong
			or weak comparison is used on the server side. For more
			info see:

				https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests#Weak_validation
		*/
		public tag(tagContent:string, isWeak:boolean = false):void
		{
			this.headers.set("ETag", (isWeak ? "W/" : "") + "\"" + tagContent.replace(/"/g, "\\\"") + "\"");
		}



		public redirect(
			newLocation:string,
			isPermanent = false):void
		{
			this.headers.set("Location", newLocation);
			this.flush(isPermanent ? HTTP_MOVED_PERMANENTLY : HTTP_MOVED_TEMPORARILY);
		}



		/*
			Tells the browser that this response's data may be downloaded
			from requests originating from originUrl (or any url, if originUrl
			is "*"). If this value changes depending on request, isVarying
			should be set to true as this will tell the browser to recheck the
			access control privileges if it reloads that resource from another
			origin. If originUrl is always the same, isVarying should stay at
			false.
		*/
		public addAccessControl(originUrl = "*", isVarying = false):void
		{
			if (originUrl != "*")
			{
				var urlObj = kr3m.util.Url.parse(originUrl);
				originUrl = urlObj.protocol + "://" + urlObj.domain;
			}
			this.headers.set("Access-Control-Allow-Origin", originUrl);

			if (isVarying)
				this.headers.set("Vary", "Origin");
		}



		public flush(httpCode = HTTP_SUCCESS):void
		{
			if (this.isFlushed)
			{
				logError("flushing flushed response");
				kr3m.util.Log.logStackTrace(true);
				return;
			}

			this.isFlushed = true;

			var cookieHeaders:string[] = [];
			for (var cookieName in this.cookies)
				cookieHeaders.push(this.cookies[cookieName].toString());
			if (cookieHeaders.length > 0)
				this.rawResponse.setHeader("Set-Cookie", cookieHeaders);

			this.rawResponse.writeHead(httpCode, this.headers.getRaw());

			if (this.data)
				this.rawResponse.write(this.data, this.encoding);

			this.rawResponse.end();
		}
	}
}

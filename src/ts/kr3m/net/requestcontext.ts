/// <reference path="../async/if.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../net/session.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.net
{
	export class RequestContext
	{
		public uri:string; // die uri der angeforderten Resource
		public uriResourcePath:string; // der lokale Pfad, der zu der gegebenen uri passen würde
		public request:any; // der original Request, der vom HTTP-Server empfangen wurde
		public session:kr3m.net.Session; // die Session des Browsers, der den Request abgeschickt hat

		public sendCookies = true; // sollen bei der Response Cookie-Daten mitgeschickt werden?

		private response:any;
		private requestComplete = false;
		private requestBody = "";

		private cookies:{[name:string]:string} = null;
		private responseHeaders:{[name:string]:string} = {};
		private data:any;
		private encoding:string;
		private etag:string = null;

		private flushed = false;



		constructor(request:any, response:any)
		{
			this.request = request;
			this.response = response;
		}



		/*
			Holt die gewünschten Sprachen (laut Browsereinstellungen
			des Users) aus dem HTTP-Header des Requests und gibt sie
			als Array mit Sprach-IDs zurück. Beispiele für Rückgaben:
			[], ["de"], ["en", "de"] usw.
		*/
		public getUserLanguages():string[]
		{
			var languages = this.request.headers["accept-language"] || "";
			var parts = languages.split(",");
			var result:string[] = [];
			for (var i = 0; i < parts.length; ++i)
			{
				var lang = parts[i].substr(0, 2);
				if (!kr3m.util.Util.contains(result, lang))
					result.push(lang);
			}
			return result;
		}



		public getReferer():string
		{
			if (!this.request.headers.referer)
				return "";

			var parts = urlLib.parse(this.request.headers.referer);
			return parts.hostname;
		}



		public getHost():string
		{
			if (!this.request.headers.host)
				return "";

			return this.request.headers.host.replace(/:\d+/, "");
		}



		public getRequestHeaders():{[name:string]:string}
		{
			return this.request.headers;
		}



		public getRequestHeader(name:string):string
		{
			return this.request.headers[name] || undefined;
		}



		public isIE():boolean
		{
			var agent = this.getRequestHeader("user-agent") || "";
			return (/msie|trident/i).test(agent);
		}



		public getUserIp():string
		{
			if (this.request.headers["x-real-ip"])
				return this.request.headers["x-real-ip"];

			if (this.request.headers["x-forwarded-for"])
				return this.request.headers["x-forwarded-for"].split(/\s*,\s*/)[0];

			if (this.request.connection.remoteAddress)
				return this.request.connection.remoteAddress;

			if (this.request.socket.remoteAddress)
				return this.request.socket.remoteAddress;

			if (this.request.connection.socket && this.request.connection.socket.remoteAddress)
				return this.request.connection.socket.remoteAddress

			logError("could not determine user ip address");
			return undefined;
		}



		public getRequestQuery():{[name:string]:string}
		{
			var parts = urlLib.parse(this.request.url, true);
			return parts.query;
		}



		public getRequestBody(callback:(requestBody:string) => void):void
		{
			if (this.requestComplete)
				return callback(this.requestBody);

			this.requestBody = "";
			this.request.on("data", (data:string) => {this.requestBody += data;});
			this.request.on("end", () =>
			{
				this.requestComplete = true;
				callback(this.requestBody);
			});
		}



		public getPostValues(callback:(postValues:{[name:string]:string}) => void):void
		{
			this.getRequestBody((requestBody:string) =>
			{
				callback(this.getPostValuesSync(requestBody));
			});
		}



		public getPostValuesSync(requestBody:string):{[name:string]:string}
		{
			var values = kr3m.util.StringEx.splitAssoc(requestBody, "&", "=");
			for (var i in values)
				values[i] = decodeURIComponent(values[i]);
			return values;
		}



		public setResponseCookie(
			name:string,
			value:string,
			expires?:Date,
			httpOnly:boolean = false):void
		{
			if (!this.cookies)
				this.cookies = {};
			this.cookies[name] = encodeURIComponent(value) + "; Path=/";
			if (expires)
				this.cookies[name] += "; Expires=" + expires.toUTCString();
			if (httpOnly)
				this.cookies[name] += "; HttpOnly";
		}



		public getResponseCookie(name:string):string
		{
			return this.cookies ? this.cookies[name] : undefined;
		}



		public getRequestCookies():{[name:string]:string}
		{
			var rawCookies = this.getRequestHeader("cookie") || "";
			var cookies = kr3m.util.StringEx.splitAssoc(rawCookies, "; ", "=");
			return cookies;
		}



		public getRequestCookie(name:string):string
		{
			return this.getRequestCookies()[name];
		}



		public setResponseHeader(name:string, value:string):void
		{
			this.responseHeaders[name] = value;
		}



		public deleteResponseHeader(name:string):void
		{
			delete this.responseHeaders[name];
		}



		public setDownloadName(fileName:string):void
		{
			this.setResponseHeader("content-disposition", "attachment; filename=\"" + fileName +"\"");
		}



		/*
			Setzt HTTP-Header in der Response um dem Browser
			mitzuteilen, dass die Antwort nicht gecached und
			statt dessen jedes Mal vom Server abgefragt werden
			soll.
		*/
		public disableBrowserCaching():void
		{
			this.setResponseHeader("Cache-Control", "no-cache, no-store, must-revalidate");
			this.setResponseHeader("Expires", "0");
			this.setResponseHeader("Pragma", "no-cache");
			this.deleteResponseHeader("ETag");
			this.deleteResponseHeader("Last-Modified");
		}



		public cacheUntil(date:Date):void
		{
			this.setResponseHeader("Cache-Control", "public");
			this.setResponseHeader("Expires", date.toUTCString());
			this.deleteResponseHeader("Pragma");
		}



		public cacheFor(duration:number):void
		{
			var date = new Date(Date.now() + duration);
			this.cacheUntil(date);
		}



		public setETag(value:string):void
		{
			if (typeof value === "string")
				this.setResponseHeader('ETag', value);
		}



		public setResponseContent(
			data:any,
			mimeType:string = "text/plain; charset=utf-8",
			encoding:string = "utf8"):void
		{
			this.data = data;
			this.encoding = encoding;
			this.responseHeaders["Content-Type"] = mimeType;
		}



		public getResponseContent():any
		{
			return this.data && this.data["toString"] ? this.data.toString() : null;
		}



		public getIfModified():Date
		{
			var rawText = this.request.headers["if-modified-since"];
			return rawText ? new Date(rawText): undefined;
		}



		public setLastModified(date:Date):void
		{
			this.setResponseHeader("Last-Modified", date.toUTCString());
		}



		/*
			Baut alle bisher eingestellten Optionen für die
			Response zusammen und schickt die daraus erstellte
			HTTP-Antwort an den Browser zurück.
		*/
		public flushResponse(httpCode:number = 200):void
		{
			if (this.flushed)
			{
				logError("flushing flushed response");
				kr3m.util.Log.logStackTrace(true);
				return;
			}

			this.flushed = true;

			kr3m.async.If.then(this.session, (thenDone:() => void) =>
			{
				var expires = this.session.getExpiry();
				if (expires)
					this.setResponseCookie("sessionId", this.session.getId(), expires, true);
				this.session.release(thenDone);
			}, () =>
			{
				if (this.sendCookies && this.cookies)
				{
					var cookies:string[] = [];
					for (var cookieName in this.cookies)
						cookies.push(cookieName + "=" + this.cookies[cookieName]);
					this.response.setHeader("Set-Cookie", cookies);
				}

				this.response.writeHead(httpCode, this.responseHeaders);
				if (this.data)
					this.response.write(this.data, this.encoding);
				this.response.end();
			});
		}



		public getErrorContent(
			errorCode:number,
			callback:(content:string, mimeType?:string) => void):void
		{
			// wird ggf. durch andere Klassen überschrieben
			callback(errorCode + " - error occured");
		}



		private flushError(
			error:number,
			content?:string,
			mimeType?:string):void
		{
			kr3m.async.If.then(!content, (thenDone:() => void) =>
			{
				this.getErrorContent(error, (newContent:string, newMimeType?:string) =>
				{
					content = newContent;
					mimeType = newMimeType;
					thenDone();
				});
			}, () =>
			{
				mimeType = mimeType || "text/plain; charset=utf-8";
				this.setResponseContent(content, mimeType);
				this.flushResponse(error);
			});
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass die angeforderte Resource permanent
			verschoben wurde und schickt die neue URL zurück.
		*/
		public return301(location:string, content?:string, mimeType?:string):void
		{
			this.setResponseHeader("Location", location);
			this.flushError(301, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass die angeforderte Resource temporär
			verschoben wurde und schickt die neue URL zurück.
		*/
		public return302(location:string, content?:string, mimeType?:string):void
		{
			this.setResponseHeader("Location", location);
			this.flushError(302, content, mimeType);
		}



		/*
			Sends a response to the browser and informs it that
			the requested resource hasn't changed since the browser
			last loaded it.
		*/
		public return304(content?:string, mimeType?:string):void
		{
			this.flushError(304, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass er ungültige HTTP-Daten übermittelt
			hat.
		*/
		public return400(realm:string, content?:string, mimeType?:string):void
		{
			this.setResponseHeader("WWW-Authenticate", "Basic realm=\"" + realm + "\"");
			this.flushError(400, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass er die falschen HTTP-Auth-
			Anmeldeinformationen übergeben hat.
		*/
		public return401(realm:string, content?:string, mimeType?:string):void
		{
			this.setResponseHeader("WWW-Authenticate", "Basic realm=\"" + realm + "\"");
			this.flushError(401, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass er auf die angeforderte Resource
			nicht zugreifen darf.
		*/
		public return403(content?:string, mimeType?:string):void
		{
			this.flushError(403, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass die angeforderte Resource nicht
			existiert / gefunden wurde.
		*/
		public return404(content?:string, mimeType?:string):void
		{
			this.flushError(404, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass ein interner Serverfehler beim
			Bearbeiten seiner Anfrage aufgetreten ist.
		*/
		public return500(content?:string, mimeType?:string):void
		{
			this.flushError(500, content, mimeType);
		}



		/*
			Schickt eine Antwort an den Browser und informiert
			ihn darüber, dass der Server im Moment nicht erreichbar
			ist.
		*/
		public return503(content?:string, mimeType?:string):void
		{
			this.flushError(503, content, mimeType);
		}
	}
}

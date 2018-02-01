/// <reference path="../async/flags.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../net2/cookie.ts"/>
/// <reference path="../net2/headers.ts"/>
/// <reference path="../net2/uploadedfile.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/binary.ts"/>
/// <reference path="../util/device.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.net2
{
	export class Request
	{
		private flags = new kr3m.async.Flags();
		private cookies:{[name:string]:Cookie};
		private content:Buffer;
		private device:kr3m.util.Device;
		private formValues:{[name:string]:string};
		private uploadedFiles:UploadedFile[];



		constructor(private rawRequest:any)
		{
			this.flags.onceSet("parseMessageParts", () => this.parseMessageParts());
		}



		public getUserIp():string
		{
			if (this.rawRequest.headers["x-real-ip"])
				return this.rawRequest.headers["x-real-ip"];

			if (this.rawRequest.headers["x-forwarded-for"])
				return this.rawRequest.headers["x-forwarded-for"].split(/\s*,\s*/)[0];

			if (this.rawRequest.connection.remoteAddress)
				return this.rawRequest.connection.remoteAddress;

			if (this.rawRequest.socket.remoteAddress)
				return this.rawRequest.socket.remoteAddress;

			if (this.rawRequest.connection.socket && this.rawRequest.connection.socket.remoteAddress)
				return this.rawRequest.connection.socket.remoteAddress

			logError("could not determine user ip address");
			return undefined;
		}



		public getMethod():string
		{
			return this.rawRequest.method;
		}



		public getRaw():any
		{
			return this.rawRequest;
		}



		public getBinaryContent(
			callback:CB<Buffer>):void
		{
			if (this.content)
				return callback(this.content);

			var content:Buffer;
			this.rawRequest.on("data", (data) => content = content ? Buffer.concat([content, data]) : data);
			this.rawRequest.on("end", () =>
			{
				this.content = content;
				callback(this.content);
			});
		}



		public getContent(
			callback:CB<string>):void
		{
			this.getBinaryContent((content) =>
			{
				callback(content ? content.toString("utf-8") : "");
			});
		}



		private parsePartHeaders(part:Buffer):[Headers, Buffer]
		{
			var lineSeperator = Buffer.from("\r\n");
			var valueSeperator = Buffer.from(":");

			var headers = new Headers();
			var content:Buffer;

			var offset = 0;
			while (true)
			{
				var line = kr3m.util.Binary.getNextSplitPart(part, lineSeperator, offset);
				if (!line)
					break;

				offset += line.length + lineSeperator.length;
				var parts = kr3m.util.Binary.split(line, valueSeperator);
				if (parts && parts.length >= 2)
				{
					var field = parts[0].toString();
					var value = "";
					for (var i = 1; i < parts.length; ++i)
						value += parts[i].toString();
					headers[field] = value.trim();
				}
				else
				{
					content = part.slice(offset);
					break;
				}
			}
			return [headers, content];
		}



		private getContentParts(
			dataCallback:(partHeaders:Headers, partContent:Buffer) => void,
			callback?:Callback):void
		{
			var contentType = this.rawRequest.headers["content-type"] || "";
			if (!contentType)
				return callback && callback();

			this.getBinaryContent((content) =>
			{
				var matches = contentType.match(/multipart\/form\-data; boundary=(\S+)/);
				if (matches)
				{
					var seperator = Buffer.from("--" + matches[1]);
					var parts = kr3m.util.Binary.split(content, seperator);
					for (var i = 0; i < parts.length; ++i)
					{
						if (i < parts.length - 1)
							var part = parts[i].slice(2, parts[i].length - 2);
						else
							var part = parts[i].slice(2);

						var [headers, content] = this.parsePartHeaders(part);
						dataCallback(headers, content);
					}
				}
				else
				{
					dataCallback(new Headers(), content);
				}
				callback && callback();
			});
		}



		private parseMessageParts():void
		{
			this.formValues = {};
			var uploadedFiles:UploadedFile[] = [];
			this.getContentParts((partHeaders, partContent) =>
			{
				var disposition = partHeaders["Content-Disposition"] || "";
				var matchesFile = disposition.match(/form-data; name="(.*?)"; filename="(.*?)"/);
				if (matchesFile)
				{
					var file = new UploadedFile();
					file.fileName = kr3m.util.File.getFilenameFromPath(matchesFile[2]);
					file.inputName = matchesFile[1];
					file.data = partContent;
					file.mimeType = partHeaders["Content-Type"];
					uploadedFiles.push(file);
					return;
				}

				var matchesInput = disposition.match(/form-data; name="(.*?)"/);
				if (matchesInput)
				{
					this.formValues[matchesInput[1]] = partContent.toString("utf8");
					return;
				}

				var contentType = this.rawRequest.headers["content-type"] || "";
				var matchesForm = contentType.match(/application\/x\-www\-form\-urlencoded(?:; charset=(\S+))?/);
				if (matchesForm)
				{
					var encoding = matchesForm[1] || "ascii";
					var values = kr3m.util.StringEx.splitAssoc(partContent.toString(encoding), "&", "=", decodeURIComponent);
					for (var name in values)
						this.formValues[name] = values[name];
					return;
				}

				//# LOCALHOST
				logWarning("unhandled request part content");
				debug("partHeaders", partHeaders);
				debug("partContent", partContent.toString());
				debug("request.headers", this.rawRequest.headers);
				//# /LOCALHOST
			}, () =>
			{
				this.uploadedFiles = uploadedFiles;
				this.flags.set("uploadedFiles", "formValues");
			});
		}



		public getUploadedFiles(
			callback:(uploadedFiles:UploadedFile[]) => void):void
		{
			this.flags.onceSet("uploadedFiles", () => callback(this.uploadedFiles));
			this.flags.set("parseMessageParts");
		}



		public getFormValues(
			callback:(formValues:{[name:string]:string}) => void):void
		{
			this.flags.onceSet("formValues", () => callback(this.formValues));
			this.flags.set("parseMessageParts");
		}



		public isSecure():boolean
		{
			return this.rawRequest.socket.encrypted;
		}



		public getHeader(name:string):string
		{
			return this.rawRequest.headers[name];
		}



		public getHeaders():Headers
		{
			var headers = new Headers();
			headers.setRaw(this.rawRequest.headers);
			return headers;
		}



		public getCookies():{[name:string]:Cookie}
		{
			if (this.cookies)
				return this.cookies;

			this.cookies = {};
			var rawCookies = this.rawRequest.headers["cookie"] || "";
			var rawCookieValues = kr3m.util.StringEx.splitAssoc(rawCookies, "; ", "=");
			for (var name in rawCookieValues)
				this.cookies[name] = new Cookie(name, rawCookieValues[name]);
			return this.cookies;
		}



		public getCookie(name:string):Cookie
		{
			return this.getCookies()[name];
		}



		public getCookieValue(name:string):string
		{
			var cookie = this.getCookie(name);
			return cookie ? cookie.value : undefined;
		}



		/*
			Überprüft ob der Browser die Resource nur haben will,
			falls sie sich in letzter Zeit geändert hat. Falls
			das der Fall ist wird der Zeitpunkt zurückgegeben,
			an dem der Stand des Browsers zuletzt aktualisiert
			wurde. Hat sich die Resource seit dem verändert soll
			sie mit einem 200er HTTP-Result zurückgegeben werden,
			falls nicht sollte ein 304er HTTP-Result ohne Content
			zurückgegeben werden.
		*/
		public getIfModified():Date
		{
			var rawText = this.rawRequest.headers["if-modified-since"];
			return rawText ? new Date(rawText): undefined;
		}



		public getUri():string
		{
			var uri = urlLib.parse(this.rawRequest.url).pathname;
			uri = decodeURIComponent(uri);
			uri = uri.replace(/\/\/+/g, "/").replace(/\.\.+/g, ".");
			uri = kr3m.util.StringEx.getBefore(uri, "#");
			uri = kr3m.util.StringEx.getBefore(uri, "?");
			return uri;
		}



		public getLocation():string
		{
			var isSecure = this.isSecure();
			var url = isSecure ? "https://" : "http://";
			url += this.getHost();
			var port = this.getPortSuffix();
			if (port)
				url += ":" + port;
			url += this.getUri();
			var query = this.getQueryText();
			if (query)
				url += "?" + query;
			return url;
		}



		public getQueryText():string
		{
			var query = kr3m.util.StringEx.getAfter(this.rawRequest.url, "?");
			return (query == this.rawRequest.url) ? "" : query;
		}



		public getQueryValues():{[name:string]:string}
		{
			var text = this.getQueryText();
			var values = kr3m.util.StringEx.splitAssoc(text);
			for (var name in values)
				values[name] = decodeURIComponent(values[name]);
			return values;
		}



		public getQueryValue(name:string):string
		{
			return this.getQueryValues()[name];
		}



		public getReferer():string
		{
			if (!this.rawRequest.headers.referer)
				return "";

			var parts = urlLib.parse(this.rawRequest.headers.referer);
			return parts.hostname;
		}



		public getOrigin():string
		{
			return this.rawRequest.headers.origin || "";
		}



		public getHost():string
		{
			if (!this.rawRequest.headers.host)
				return "";

			return this.rawRequest.headers.host.replace(/:\d+/, "");
		}



		public getPort():number
		{
			return this.rawRequest.socket.localPort;
		}



		public getPortSuffix():string
		{
			if (!this.rawRequest.headers.host)
				return "";

			return this.rawRequest.headers.host.replace(/\D/g, "");
		}



		public getUserAgent():string
		{
			return this.rawRequest.headers["user-agent"] || "";
		}



		public getLocales():string[]
		{
			var languageHeader = this.rawRequest.headers["accept-language"];
			if (!languageHeader)
				return [];

			var locales = kr3m.util.StringEx.captureNamedGlobal(languageHeader, /\b([a-z][a-z])[_-]?([A-Z][A-Z])?\b/g, ["languageId", "countryId"]);
			return locales.map(locale => locale.languageId + (locale.countryId || ""));
		}



		public getLanguages():string[]
		{
			var locales = this.getLocales();
			var languageIds = locales.map(locale => locale.slice(0, 2));
			languageIds = kr3m.util.Util.removeDuplicates(languageIds);
			return languageIds;
		}



		public getDevice():kr3m.util.Device
		{
			if (this.device)
				return this.device;

			var globals =
			{
				document :
				{
					documentElement : {},
					createElement : (tag:string) => null
				},
				localStorage : {},
				navigator :
				{
					userAgent : this.getUserAgent()
				},
				window : {}
			};
			this.device = new kr3m.util.Device(globals);
			return this.device;
		}
	}
}

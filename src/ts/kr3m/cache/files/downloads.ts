/// <reference path="../../cache/files/abstract.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net/httprequest.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.cache.files
{
	/*
		Mit dieser Klasse kann man Dateien von beliebigen
		URLs anfordern. Wurde eine gewünschte Datei in der
		Vergangenheit schon mal angefordert, wird sie aus
		dem Speicher zurückgegeben statt über das Internet
		geladen zu werden.
		Wenn die Datei im speicher aber älter sein sollte
		als ttl Millisekunden, dann wird ein Update der Datei
		vom Zielserver geladen und dieses dann zurückgegeben.
	*/
	export class Downloads extends Abstract
	{
		private static instance:Downloads;

		protected downloads:{[url:string]:{data:Buffer, mimeType:string, downloaded:number, lastModified:number}} = {};
		protected listeners:{[url:string]:Array<(content:Buffer, mimeType?:string) => void>} = {};

		public ttl = 60000;



		public static getInstance():Downloads
		{
			if (!Downloads.instance)
				Downloads.instance = new Downloads();
			return Downloads.instance;
		}



		private callListeners(url:string, content:Buffer, mimeType:string):void
		{
			if (!this.listeners[url])
				return;

			var listeners = this.listeners[url];
			delete this.listeners[url];
			for (var i = 0; i < listeners.length; ++i)
				listeners[i](content, mimeType);
		}



		public getNewerFile(
			url:string,
			ttl:number,
			callback:(content:Buffer, mimeType?:string) => void):void
		{
			var threshold = Date.now() - ttl;
			var download = this.downloads[url];
			if (download && download.downloaded >= threshold)
				return callback(download.data, download.mimeType);

			if (this.listeners[url])
			{
				this.listeners[url].push(callback);
				return;
			}

			this.listeners[url] = [callback];

			var request = new kr3m.net.HttpRequest(url, null, "GET");
			request.convertTextFiles = false;
			logVerbose("downloading", url);

			if (download && download.lastModified)
				request.setHeader("If-Modified-Since", new Date(download.lastModified).toUTCString());

			request.send((content, mimeType, headers) =>
			{
				logVerbose("downloaded", url);
				var lastModified = headers["last-modified"] ? new Date(<string>headers["last-modified"]).getTime() : 0;
				this.downloads[url] =
				{
					data : <Buffer> content,
					mimeType : mimeType,
					downloaded : Date.now(),
					lastModified : lastModified
				};
				this.callListeners(url, <Buffer> content, mimeType);
			}, (errorMessage, statusCode, headers, errorBody) =>
			{
				if (statusCode == 304)
				{
					download.downloaded = Date.now();
					if (headers["last-modified"])
						download.lastModified = new Date(<string>headers["last-modified"]).getTime();
					return this.callListeners(url, download.data, download.mimeType);
				}

				logDebug("download error", url, statusCode, errorMessage);
				this.downloads[url] =
				{
					data : null,
					mimeType : null,
					downloaded : Date.now(),
					lastModified : 0
				};
				this.callListeners(url, null, null);
			});
		}



		public getFile(
			url:string,
			callback:(content:Buffer, mimeType?:string) => void):void
		{
			this.getNewerFile(url, this.ttl, callback);
		}



		public getTextFile(
			url:string,
			callback:CB<string>):void
		{
			this.getFile(url, (raw) =>
			{
				var content = raw ? raw.toString("utf8") : "";
				content = kr3m.util.StringEx.stripBom(content);
				callback(content);
			});
		}



		public getModified(
			url:string,
			callback:CB<Date>):void
		{
			callback(this.downloads[url] ? new Date(this.downloads[url].downloaded) : undefined);
		}



		public setDirty(
			url:string,
			callback?:Callback):void
		{
			if (this.downloads[url])
				this.downloads[url].downloaded = 0;
			callback && callback();
		}
	}
}

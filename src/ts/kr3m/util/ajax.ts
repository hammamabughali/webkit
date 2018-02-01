/// <reference path="../async/timeout.ts"/>
/// <reference path="../util/browser.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/url.ts"/>
/// <reference path="../xml/parser.ts"/>



module kr3m.util
{
	export class Ajax
	{
		private static pendingXhr:{[id:string] :any} = {};

		public static serviceUrl:string;



		/*
			Eine Liste von "Dateiendungen", die verwendet wird
			um automatisch zu bestimmen, was für eine Art von
			Daten von einer gegebenen URL geladen werden sollen.
			Das ist kein Mime-Type!
		*/
		private static typesByExtension:any[] =
		[
			{pattern : /\.bmp$/i, type : "image"},
			{pattern : /\.css$/i, type : "text"},
			{pattern : /\.fnt$/i, type : "xml->json"},
			{pattern : /\.gif$/i, type : "image"},
			{pattern : /\.html$/i, type : "text"},
			{pattern : /\.jpeg$/i, type : "image"},
			{pattern : /\.jpg$/i, type : "image"},
			{pattern : /\.js$/i, type : "text"},
			{pattern : /\.json$/i, type : "json"},
			{pattern : /\.md5anim$/i, type : "text"},
			{pattern : /\.md5mesh$/i, type : "text"},
			{pattern : /\.mp3$/i, type : "binary"},
			{pattern : /\.ogg$/i, type : "binary"},
			{pattern : /\.php$/i, type : "json"},
			{pattern : /\.png$/i, type : "image"},
			{pattern : /\.txt$/i, type : "text"},
			{pattern : /\.xml$/i, type : "xml"}
		];



		public static getTypeFromUrl(url:string):string
		{
			var resource = Url.getResourceFromUrl(url);
			for (var i = 0; i < Ajax.typesByExtension.length; ++i)
			{
				var item = Ajax.typesByExtension[i];
				if (item.pattern.test(resource))
					return item.type;
			}
			return undefined;
		}



		private static getXMLHttpRequestObject():any
		{
//# IE8
			//# TODO: für Cross-Domain-Zugriffe im IE9- muss hier XDomainRequest verwendet werden statt ActiveXObject
//# /IE8
			var ref = null;
			if ((<any> window).XMLHttpRequest)
				ref = new XMLHttpRequest();
			else if ((<any> window).ActiveXObject)
				ref = new ActiveXObject("MSXML2.XMLHTTP.3.0");
			return ref;
		}



		private static responseHandler(
			request:any,
			callback:(response:any, headers:{[key:string]:string}) => void,
			type:string,
			errorCallback?:(errorCode:number) => void):void
		{
			if (request.readyState != 4)
				return;

			var status = request.status;
//# APP
			status = status || 200;
//# /APP
			if (status >= 200 && status < 300)
			{
				if (callback)
				{
					try
					{
						var headers:{[key:string]:string} = {};
						var headerStr:string = request.getAllResponseHeaders();
						if (headerStr && (headerStr.length > 0))
						{
							var headerPairs:string[] = headerStr.split('\u000d\u000a');
							for (var i = 0; i < headerPairs.length; ++i)
							{
								var sep = headerPairs[i].indexOf('\u003a\u0020');
								if (sep > 0)
									headers[headerPairs[i].substr(0, sep)] = headerPairs[i].substr(sep + 2);
							}
						}
						switch (type)
						{
							case "json": callback(Json.decode(request.responseText), headers); break;
							case "xml":
								if (request.responseXML)
									return callback(request.responseXML, headers);

								if (DOMParser)
								{
									var parser = new DOMParser();
									var xml = parser.parseFromString(request.responseText, "text/xml");
									return callback(xml, headers);
								}

								Log.logError("error while loading xml file");
								callback(null, headers);
								break;

							case "text": callback(request.responseText, headers); break;
							case "binary": callback(request.response, headers); break;
							case "image": callback(request.response, headers); break;
							case "arraybuffer": callback(request.response, headers); break;
							case "xml->json": callback(kr3m.xml.parseString(request.responseText), headers); break;
						}
					}
					catch(e)
					{
						Log.logError(e);
					}
				}
			}
			else if (errorCallback)
			{
				errorCallback(status);
			}
		}



		private static adjustMimeType(request:any, url:string, desiredType:string):void
		{
			if (request instanceof XMLHttpRequest)
			{
				switch (desiredType)
				{
					case "json":
						request.overrideMimeType("application/json");
						break;

					case "text":
						request.overrideMimeType("text/plain");
						break;
				}
			}
		}



		/*
			Lädt eine URL und gibt die von dort erhaltene Datei / Daten
			direkt als response im callback zurück. Es ist völlig egal,
			um was für eine Datei oder was für eine Art von Daten (Text,
			HTML, CSS, JSON, XML, Bilder, Sound, Binärdateien, usw.) es
			sich handelt, es wird alles geladen.

			Zu beachten ist, dass in den meisten Browsern Ajax-Calls
			aus Sicherheitsgründen nicht verwendet werden können um URLs
			von anderen Domains zu laden. Wird so etwas gebraucht, kann
			der relayService des kr3m.net.subservers.ajax.AjaxServer
			verwendet werden, falls ein node.js Backend verwendet wird.
		*/
		public static call(
			url:string,
			callback?:(response:any, headers:{[key:string]:string}) => void,
			type?:string,
			errorCallback?:(errorCode:number) => void):any
		{
			type = type || Ajax.getTypeFromUrl(url) || "json";
			var request = Ajax.getXMLHttpRequestObject();
			Ajax.adjustMimeType(request, url, type);
			request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, errorCallback);
			request.open("GET", url, true);
			if (type == "arraybuffer")
				request.responseType = type;
			request.send();
			return request;
		}



		/*
			Funktioniert genau so wie kr3m.util.Ajax.call, bricht
			die Anfrage aber nach einer bestimmten Zeit ab und ruft
			die timeoutCallback Funktion auf.
		*/
		public static callTimeout(
			url:string,
			successCallback:(response:any) => void,
			timeoutCallback:() => void,
			timeout:number,
			type?:string):void
		{
			if (timeout <= 0)
			{
				Ajax.call(url, successCallback, type);
				return;
			}

			var xhr = null;
			kr3m.async.Timeout.call(timeout, function(callback:(response:any) => void)
			{
				xhr = Ajax.call(url, callback, type);
			}, successCallback, () =>
			{
				xhr.abort();
				timeoutCallback();
			});
		}



		/*
			Funktioniert genau so wie kr3m.util.Ajax.call, schickt aber
			noch die in data übergebenen Parameter als POST-Daten in
			die Anfrage mit.

			Die Daten werden als JSON versendet und zusätzlich noch in
			ein Objekt als payload Attribut gesetzt. Diese, etwas
			umständliche (interne) Handhabung ist nötig, um
			rückwärtskompatibel zu unseren älteren Backends zu sein. Die
			neueren Backends erwarten die Daten in ebensolcher Form.
		*/
		public static postCall(
			url:string,
			callback?:(response:any, headers:{[key:string]:string}) => void,
			data:any = {},
			type?:string):any
		{
			type = type || Ajax.getTypeFromUrl(url) || "json";
			var request = Ajax.getXMLHttpRequestObject();

			var encoded:any = {};
			for (var i in data)
				encoded[i] = encodeURIComponent(data[i]);

			Ajax.adjustMimeType(request, url, type);

			var params = StringEx.joinAssoc(encoded);
			request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, null);
			request.open("POST", url, true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send(params);
			return request;
		}



		/*
			Funktioniert genau so wie kr3m.util.Ajax.postCall, bricht
			die Anfrage aber nach einer bestimmten Zeit ab und ruft
			die timeoutCallback Funktion auf.
		*/
		public static postCallTimeout(
			url:string,
			successCallback:(response:any) => void,
			timeoutCallback:() => void,
			timeout:number,
			data:any = {},
			type?:string):void
		{
			if (timeout <= 0)
			{
				Ajax.postCall(url, successCallback, data, type);
				return;
			}

			var xhr = null;
			kr3m.async.Timeout.call(timeout, function(callback:(response:any) => void)
			{
				xhr = Ajax.postCall(url, callback, data, type);
			}, successCallback, () =>
			{
				xhr.abort();
				timeoutCallback();
			});
		}



		/*
			Ruft einen Service im Backend auf. Diese Methode funktioniert
			für beide bei uns verwendete Backendtypen: auf Zend-PHP gebaute,
			die den GatewayController verwenden, aber auch für die auf
			node.js aufgebauten Backends mit einer Instanz von
			kr3m.net.subservers.ajax.AjaxServer.
		*/
		public static callService(
			method:string,
			data:any = {},
			callback?:(response:any, headers:{[key:string]:string}) => void,
			type?:string,
			errorCallback?:(errorCode:number) => void):any
		{
			var params = "method=" + method + "&payload=" + encodeURIComponent(Json.encode(data));
			if (Ajax.serviceUrl)
				var url = Ajax.serviceUrl + "?_=" + (new Date()).getTime();
			else
				var url = Browser.getBaseUrl() + "gateway?_=" + (new Date()).getTime();

			type = type || Ajax.getTypeFromUrl(url) || "json";
			var request = Ajax.getXMLHttpRequestObject();

			Ajax.adjustMimeType(request, url, type);

			request.onreadystatechange = Ajax.responseHandler.bind(null, request, callback, type, errorCallback);
			request.open("POST", url, true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send(params);
			return request;
		}



		/*
			Diese Methode funktioniert prinzipiell genau so wie
			kr3m.util.Ajax.callService hat aber den Unterschied, dass
			laufende Serviceaufrufe abgebrochen werden, wenn der gleiche
			Service nochmal aufgerufen wird, bevor die Antwort vom Server
			angekommen ist. Entsprechend wird auch nur das callback für
			den letzten Aufruf des Services aufgerufen.
		*/
		public static callServiceUnique(
			method:string,
			data:any = {},
			callback?:(response:any, headers:{[key:string]:string}) => void,
			type?:string,
			errorCallback?:(errorCode:number) => void):any
		{
			var oldXhr = Ajax.pendingXhr[method];
			if (oldXhr)
				oldXhr.abort();

			var xhr = Ajax.callService(method, data, (response:any, headers:{[key:string]:string}) =>
			{
				delete Ajax.pendingXhr[method];
				callback && callback(response, headers);
			}, null, errorCallback);

			Ajax.pendingXhr[method] = xhr;
		}



		/*
			Funktioniert genau so wie kr3m.util.Ajax.callService,
			bricht die Anfrage aber nach einer bestimmten Zeit ab
			und ruft die timeoutCallback Funktion auf.
		*/
		public static callServiceTimeout(
			method:string,
			data:any,
			successCallback:(response:any, headers:{[key:string]:string}) => void,
			timeoutCallback:() => void,
			timeout:number,
			type?:string,
			errorCallback?:(errorCode:number) => void):void
		{
			if (timeout <= 0)
			{
				Ajax.callService(method, data, successCallback, type, errorCallback);
				return;
			}

			var xhr = null;
			kr3m.async.Timeout.call(timeout, function(callback:(response:any) => void)
			{
				xhr = Ajax.callService(method, data, callback, type, errorCallback);
			}, successCallback, () =>
			{
				xhr.abort();
				timeoutCallback();
			});
		}
	}
}

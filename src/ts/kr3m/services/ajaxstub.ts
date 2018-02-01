/// <reference path="../types.ts"/>
/// <reference path="../util/ajax.ts"/>
/// <reference path="../util/util.ts"/>

//# DEBUG
/// <reference path="../util/log.ts"/>
//# /DEBUG



module kr3m.services
{
	export class AjaxStub
	{
//# APP
		private serverUrl:string;
//# /APP
		private cache:any = {};

		public showServiceCallsInLog = false; // sollen die Serviceaufrufe an den Server in der Browserkonsole angezeigt werden? Funktioniert nur in der DEBUG Version
		public htmlEscapeStrings = true; // sollen Strings, die vom Server kommen automatisch htmlEscaped werden?
		public timeoutDuration = 0; // Nach welcher Zeit (in ms) sollen Anfragen an den Server als fehlgeschlagen gemeldet werden? 0 für niemals als fehlgeschlagen melden
		public cacheDuration = 600000; // Wie lange werden Anfragen im Cache gehalten bevor sie erneut vom Server geholt werden wenn callServiceCached verwendet wird? (in ms)



//# APP
		constructor(serverUrl:string)
		{
			this.serverUrl = serverUrl;
			kr3m.util.Ajax.serviceUrl = serverUrl + "/gateway";
		}
//# /APP



		/*
			Führt "Aufräumarbeiten" auf dem erhaltenen Ergebnis
			aus. Je nach Bedarf werden z.B. Urls angepasst oder
			Texte HtmlEscaped oder dergleichen.

			Falls diese Methode in einer abgeleiteten Klasse
			überschrieben werden sollte, muss berücksichtigt
			werden, dass key Punkte enthalten kann und auf
			Unterelemente verweisen kann.
		*/
		protected cleanResult(key:string, value:any, result:any):void
		{
			var type = typeof(value);
			if (type == "string")
			{
				var newValue = value;

				if (this.htmlEscapeStrings)
					newValue = kr3m.util.Util.encodeHtml(newValue);
//# APP
				var urlPattern = /url$/i;
				if (urlPattern.test(key))
					newValue = this.serverUrl + "/" + newValue;
//# /APP
				if (newValue != value)
					kr3m.util.Util.setProperty(result, key, newValue);
			}
		}



		public callService(
			serviceName:string,
			params:any = {},
			callback?:(result:any, headers:{[key:string]:string}) => void,
			timeoutCallback?:Callback,
			errorCallback?:(errorCode:number) => void):void
		{
//# DEBUG
			if (this.showServiceCallsInLog)
			{
				kr3m.util.Log.log("<== " + serviceName);
				kr3m.util.Log.log(params);
			}
//# /DEBUG
			kr3m.util.Ajax.callServiceTimeout(serviceName, params, (result, headers) =>
			{
//# DEBUG
				kr3m.util.Util.forEachRecursive(result, this.cleanResult.bind(this));
				if (this.showServiceCallsInLog)
				{
					kr3m.util.Log.log("==> " + serviceName);
					kr3m.util.Log.log(result);
				}
//# /DEBUG
				callback && callback(result, headers);
			}, () =>
			{
//# DEBUG
				if (this.showServiceCallsInLog)
					kr3m.util.Log.log("<== " + serviceName + " [TIMEOUT]");
//# /DEBUG
				timeoutCallback && timeoutCallback();
			}, this.timeoutDuration, null, errorCallback);
		}



		/*
			Funktioniert prinzipiell genau so wie callService aber mit
			dem kleinen Unterschied, dass wenn dieser Service mit den
			gleichen Parametern schon einmal aufgerufen wurde und das
			Ergebnis nicht älter als AjaxStub.cacheDuration ist, das
			Ergebnis direkt aus dem Cache geholt wird anstatt erst vom
			Server abgefragt zu werden.

			Ist in erster Linie für solche Serveranfragen gedacht, deren
			Ergebnisse sich selten ändern, wenn überhaupt. Zum Beispiel
			Preise in Shops, Serverkonstanten, Einstellungen aus der
			Datenbank, Werte für spezielle Kundenbrandings usw.
		*/
		public callServiceCached(
			serviceName:string,
			params:any = {},
			callback?:AnyCallback,
			timeoutCallback?:Callback,
			errorCallback?:(errorCode:number) => void):void
		{
			if (!callback)
				return this.callService(serviceName, params);

			var key = serviceName + "(" + kr3m.util.Json.encode(params) + ")";
			var item = this.cache[key];
			if (item && item.expires >= new Date())
				return callback(kr3m.util.Util.clone(item.response));

			this.callService(serviceName, params, (response) =>
			{
				var expires = new Date();
				expires.setTime(expires.getTime() + this.cacheDuration);
				var item = {expires : expires, response : response};
				this.cache[key] = item;
				callback(kr3m.util.Util.clone(item.response));
			}, timeoutCallback, errorCallback);
		}



		public clearCache(
			serviceName:string,
			params?:any)
		{
			if (params)
			{
				var key = serviceName + "(" + kr3m.util.Json.encode(params) + ")";
				if (this.cache[key])
					delete this.cache[key];
			}
			else
			{
				serviceName += "(";
				for (var i in this.cache)
				{
					if (i.indexOf(serviceName) == 0)
						delete this.cache[i];
				}
			}
		}
	}
}

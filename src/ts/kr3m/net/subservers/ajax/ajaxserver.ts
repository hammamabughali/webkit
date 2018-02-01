/// <reference path="../../../net/subserver2.ts"/>
/// <reference path="../../../types.ts"/>
/// <reference path="../../../util/class.ts"/>
/// <reference path="../../../util/json.ts"/>
/// <reference path="../../../util/stringex.ts"/>
/// <reference path="../../../util/util.ts"/>



module kr3m.net.subservers.ajax
{
	export type ServiceFunction = (session:kr3m.net.Session, params:any, callback:AnyCallback, context?:kr3m.net.RequestContext) => void;



	/*
		Diese Klasse stellt einen klassischen Ajax-Service-Server
		dar, wie wir ihn schon in zahlreichen anderen Projekten
		verwendet haben. Falls die fortgeschrittene Technologie
		des RPC-Servers zu aufwendig ist oder aus Rahmenbedingungen
		nicht angewendet werden kann, einfach das hier verwenden
		wie gewohnt.
	*/
	export class AjaxServer extends kr3m.net.SubServer2
	{
		private handleFunctions:{[name:string]:ServiceFunction} = {};
		private gatewayUrl:string;

//# PROFILING
		public slowRequestThreshold = 100; //Anfragen, die mehr Millisekunden dauern als hier angegeben werden als slow angezeigt
//# /PROFILING



		constructor(gatewayUrl?:string)
		{
			super();
			this.gatewayUrl = gatewayUrl;
		}



		/*
			Mit dieser Methode kann eingestellt werden, ob der relay-Dienst
			des AjaxServers zur Verfügung steht. Mit dem relay-Dienst kann
			man Ressourcen von anderen Domains laden, was in den meisten
			Browsern aus Sicherheitsgründen verboten ist. Ist der
			relay-Dienst aktiviert, kann er einfach mit

				kr3m.util.Ajax.callService("relay", params, callback)

			aufgerufen werden. In params muss das Feld url gesetzt sein,
			das angibt, welche Resource geladen werden soll. Die callback-
			Funktion erhält ein Objekt zurück, in dem das Feld status auf
			"success" oder einen Fehlerzustand gesetzt ist und das Feld
			text, welches den Inhalt des runtergeladenen Dokumentes enthält.

			Aktuell werden nur Textresourcen unterstützt, aber das soll
			sich in Zukunft noch ändern.
		*/
		public setRelayEnabled(enabled:boolean):void
		{
			if (enabled)
				this.handleFunctions["relay"] = this.relay.bind(this);
			else
				delete this.handleFunctions["relay"];
		}



		private relay(
			session:kr3m.net.Session,
			params:any,
			callback:AnyCallback):void
		{
			httpLib.get(params.url, (response:any) =>
			{
				//TODO: für Binärdateien erweitern
				var text:string = "";
				response.setEncoding("utf8");
				response.on("data", (data:any) =>
				{
					text += data.toString();
				});
				response.on("end", () =>
				{
					callback({status:"success", text:text});
				});
			}).on("error", (e:any) =>
			{
				logError(e.message);
				callback({status:"failed"});
			});
		}



		public registerService(
			serviceName:string,
			handleFunc:ServiceFunction):void
		{
			this.handleFunctions[serviceName] = handleFunc;
		}



		/*
			Registriert alle statischen Methoden der Klasse
			clazz als Services unter dem Namen
			"KLASSENNAME.METHODENNAME".
		*/
		public registerServiceClass(clazz:any):void
		{
			var className = kr3m.util.Class.getNameOfClass(clazz);
			for (var i in clazz)
				this.registerService(className + "." + i, clazz[i]);
		}



		/*
			Registriert alle Methoden des Objektes obj
			als Services unter dem Namen
			"KLASSENNAME.METHODENNAME".
		*/
		public registerServiceObject(obj:any):void
		{
			var className = kr3m.util.Class.getClassNameOfInstance(obj);
			for (var i in obj)
				this.registerService(className + "." + i, obj[i].bind(obj));
		}



		private getService(
			context:kr3m.net.RequestContext,
			callback:(service:string, params:any) => void):void
		{
			context.getRequestBody((requestData) =>
			{
				if (this.gatewayUrl)
				{
					var relevantUrl = kr3m.util.StringEx.getAfter(context.uri, this.gatewayUrl);
					if (relevantUrl != context.uri)
					{
						var parts = relevantUrl.split("/");
						if (parts.length != 2)
							return callback(null, null);

						var service = parts[0] + "." + parts[1];
						var getParams = context.getRequestQuery() || {};
						var postParams = context.getPostValuesSync(requestData) || {};
						var params = kr3m.util.Util.mergeAssoc(getParams, postParams);
						return callback(service, params);
					}
				}

				if (!requestData)
					return callback(null, null);

				var match = requestData.match(/method=([^&]+)&/);
				var service = match ? match[1] : null;
				if (!service)
					return callback(null, null);

				match = requestData.match(/payload=([^&]*)/);
				var params = null;
				try
				{
					if (match)
						params = kr3m.util.Json.decode(decodeURIComponent(match[1]));
				}
				catch (exc)
				{
					logWarning("failed to decode payload '" + requestData + "'", exc);
				}
				callback(service, params);
			});
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			this.getService(context, (service, params) =>
			{
				logVerbose("-->", service, params);
//# PROFILING
//# VERBOSE
				logProfilingLow("service call for", service);
//# /VERBOSE
//# /PROFILING
				if (!service)
					return callback(false);

				var func = this.handleFunctions[service];
				if (!func)
				{
//# DEBUG
					logError("ajax call for unknown service \"" + service + "\"");
					logError(params);
//# /DEBUG
					context.setResponseContent("500 Error\n");
					context.flushResponse(500);
					return callback(true);
				}
//# PROFILING
				var timer:any = null;
//# VERBOSE
				var waitAndWarnAgain = (name:string, params:any) =>
				{
					timer = setTimeout(() =>
					{
						logProfiling("still waiting for " + service);
						waitAndWarnAgain(service, params);
					}, Math.max(10000, this.slowRequestThreshold));
				};
//# /VERBOSE
				timer = setTimeout(() =>
				{
					logProfiling("---------------------------------------------");
					logProfiling("slow ajax request detected for " + service);
					logProfiling("---------------------------------------------");
					logProfiling(params);
					logProfiling("---------------------------------------------");
//# VERBOSE
					waitAndWarnAgain(service, params);
//# /VERBOSE
				}, this.slowRequestThreshold);
//# /PROFILING
				func(context.session, params, (result) =>
				{
//# PROFILING
					clearTimeout(timer);
//# /PROFILING
					logVerbose("<--", service, result);
					if (typeof result !== "undefined")
						context.setResponseContent(kr3m.util.Json.encode(result));
					else
						context.setResponseContent("{}");

					context.disableBrowserCaching();
					context.flushResponse(200);
					callback(true);
				}, context);
			});
		}
	}
}

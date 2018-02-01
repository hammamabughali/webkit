/// <reference path="../../net2/handlers/abstract.ts"/>
/// <reference path="../../services/paramshelper.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/class.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.net2.handlers
{
	export type AjaxCallHandler = (context:Context, params:any, callback:AnyCallback) => void;



	export class AjaxGateway extends Abstract
	{
		protected handlers:{[serviceName:string]:AjaxCallHandler} = {};



		constructor(
			uriPattern:RegExp = /^\/gateway$/)
		{
			super(uriPattern);
		}



		public on(
			serviceName:string,
			handler:AjaxCallHandler):void
		{
			this.handlers[serviceName] = handler;
		}



		public registerObject(obj:Object):void
		{
			var className = kr3m.util.Class.getClassNameOfInstance(obj);
			for (var i in obj)
			{
				if (typeof obj[i] == "function")
					this.on(className + "." + i, obj[i].bind(obj));
			}
		}



		public registerClass(clas:any):void
		{
			var className = kr3m.util.Class.getNameOfClass(clas);
			for (var i in clas)
			{
				if (typeof clas[i] == "function")
					this.on(className + "." + i, clas[i]);
			}
		}



		protected getService(
			context:Context,
			callback:(serviceName:string, params:any) => void):void
		{
			context.request.getContent((content) =>
			{
				if (!content)
					return callback(null, null);

				var match = content.match(/method=([^&]+)&/);
				var serviceName = match ? match[1] : null;
				if (!serviceName)
					return callback(null, null);

				match = content.match(/payload=([^&]*)/);
				var params = null;
				try
				{
					if (match)
						params = kr3m.util.Json.decode(decodeURIComponent(match[1]));
				}
				catch (exc)
				{
					logWarning("failed to decode payload '" + content + "'", exc);
				}
				callback(serviceName, params);
			});
		}



		public handle(context:Context):void
		{
			context.response.disableBrowserCaching();
			this.getService(context, (serviceName, params) =>
			{
				logVerbose("-->", serviceName, params);
				var handler = this.handlers[serviceName];
				if (!handler)
				{
					logDebug("ajax call for unknown service", serviceName, params);
					return context.flush(500, "unknown service \"" + serviceName + "\"");
				}

				handler(context, params, (response) =>
				{
					logVerbose("<--", serviceName, response);
					var json = kr3m.util.Json.encode(response);
					context.flush(200, json, "text/json; charset=utf-8");
				});
			});
		}
	}
}

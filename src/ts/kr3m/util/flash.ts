/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/loop.ts"/>



module kr3m.util
{
	export class Flash
	{
		private delay = new kr3m.async.Delayed();

		public dom:HTMLElement;



		private static splitVersion(version:string):[number, number, number]
		{
			version = version || "";
			var parts = version.replace(/^.*?(\d+)\.(\d+)(?:\.| r)(\d+).*?$/, "$1.$2.$3").split(".").map((p:string) => parseInt(p, 10));
			if (!parts || parts.length != 3)
				return [-1, -1, -1];
			return [parts[0], parts[1], parts[2]];
		}



		private static isNewer(available:number[], required:number[]):boolean
		{
			for (var i = 0; i < 3; ++i)
			{
				if (available[i] < required[i])
					return false;
			}
			return true;
		}



		public static isInstalled(
			requiredVersion:string,
			callback:(hasFlash:boolean) => void):void
		{
			var required = Flash.splitVersion(requiredVersion);

			var plugin = navigator.plugins && navigator.plugins["Shockwave Flash"];
			var mimeType = navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"];
			if (plugin && mimeType && mimeType.enabledPlugin)
			{
				var available = Flash.splitVersion(plugin.description);
				return callback(Flash.isNewer(available, required));
			}

			var ax = window["ActiveXObject"] && new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			if (ax)
			{
				var available = Flash.splitVersion(ax.getVariable("$version"));
				return callback(Flash.isNewer(available, required));
			}

			callback(false);
		}



		constructor(
			container:HTMLElement, swfUrl:string,
			width:string|number, height:string|number,
			flashVars?:{[name:string]:any},
			params?:{[name:string]:any},
			attributes?:{[name:string]:any},
			callback?:() => void)
		{
			flashVars = flashVars || {};
			params = params || {};
			attributes = attributes || {};

			attributes["data"] = swfUrl;
			attributes["width"] = width;
			attributes["height"] = height;

			for (var i in flashVars)
			{
				if (params["flashvars"])
					params["flashvars"] += "&" + i + "=" + flashVars[i];
				else
					params["flashvars"] = i + "=" + flashVars[i];
			}

			this.dom = document.createElement("object");
			this.dom.setAttribute("type", "application/x-shockwave-flash");
			for (var i in attributes)
			{
				if (attributes[i] != Object.prototype[i])
					this.dom.setAttribute(i.toLowerCase(), attributes[i]);
			}

			for (var i in params)
			{
				if (params[i] != Object.prototype[i] && i.toLowerCase() != "movie")
				{
					var param = document.createElement("param");
					param.setAttribute("name", i);
					param.setAttribute("value", params[i]);
					this.dom.appendChild(param);
				}
			}
			container.appendChild(this.dom);
			if (callback)
				setTimeout(callback, 0);
		}



		public destroy():void
		{
			this.dom.remove();
		}
	}
}

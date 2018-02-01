/// <reference path="../util/browser.ts"/>
/// <reference path="../util/browserhistory.ts"/>



//# CLIENT
module kr3m.util
{
	export class Deeplinking
	{
		private static passiveMode = false;
		public static targetWindow:Window = window;



		public static getCurrent(
			targetWindow:Window = Deeplinking.targetWindow):string
		{
			var hash = targetWindow.location.hash;
			if (!hash)
				return "";

			if (hash.charAt(0) == "#")
				hash = hash.slice(1);

			if (hash.charAt(0) == "!")
				hash = hash.slice(1);

			return hash;
		}



		public static buildUrl(link:string, params?:{[name:string]:any}):string
		{
			if (link.charAt(0) != "#")
				link = "#" + link;

			if (!params)
				return link;

			var result = link;
			for (var i in params)
				result += "&" + i + "=" + encodeURIComponent(params[i]);
			return result;
		}



		public static goTo(
			link:string,
			params?:{[name:string]:any},
			targetWindow:Window = Deeplinking.targetWindow):void
		{
			var url = Deeplinking.buildUrl(link, params);
			targetWindow.location.href = url;
		}



		public static getCurrentLink(
			targetWindow:Window = Deeplinking.targetWindow):string
		{
			var hash = Deeplinking.getCurrent(targetWindow);
			var parts = hash.split("&");
			return parts[0];
		}



		public static getCurrentParams(
			targetWindow:Window = Deeplinking.targetWindow):any
		{
			var hash = Deeplinking.getCurrent(targetWindow);
			var parts = hash.split("&");
			var params:any = {};
			for (var i = 1; i < parts.length; ++i)
			{
				var pos = parts[i].indexOf("=");
				var key = parts[i].slice(0, pos);
				var value = parts[i].slice(pos + 1);
				params[key] = decodeURIComponent(value);
			}
			return params;
		}



		public static setParams(
			params:{[name:string]:string},
			targetWindow:Window = Deeplinking.targetWindow):void
		{
			var link = Deeplinking.getCurrentLink(targetWindow);
			var oldParams = Deeplinking.getCurrentParams(targetWindow);
			for (var name in params)
				oldParams[name] = params[name];
			Deeplinking.goTo(link, oldParams);
		}



		public static setParam(
			name:string,
			value:string,
			targetWindow:Window = Deeplinking.targetWindow):void
		{
			var link = Deeplinking.getCurrentLink(targetWindow);
			var params = Deeplinking.getCurrentParams(targetWindow);
			params[name] = value;
			Deeplinking.goTo(link, params);
		}



		public static deleteParam(
			name:string,
			targetWindow:Window = Deeplinking.targetWindow):void
		{
			var link = Deeplinking.getCurrentLink(targetWindow);
			var params = Deeplinking.getCurrentParams(targetWindow);
			delete params[name];
			Deeplinking.goTo(link, params);
		}



		public static addDeeplink(link:string):void
		{
			if (!Deeplinking.passiveMode)
				BrowserHistory.addUrl("#" + link, "", null, Deeplinking.targetWindow);
		}



		public static setPassiveMode(isPassive:boolean):void
		{
			Deeplinking.passiveMode = isPassive;
		}



		public static addLinkChangeListener(
			listener:(link:string) => void):void
		{
			Deeplinking.onChange(listener);
		}



		public static onChange(
			listener:(link:string, params?:any, event?:Event) => void,
			targetWindow:Window = Deeplinking.targetWindow):void
		{
			targetWindow.addEventListener("hashchange", (event:Event = null) =>
			{
				Deeplinking.passiveMode = true;
				var link = Deeplinking.getCurrentLink();
				var params = Deeplinking.getCurrentParams();
				listener(link, params, event);
				Deeplinking.passiveMode = false;
			}, false);
		}
	}
}
//# /CLIENT

/// <reference path="../types.ts"/>
/// <reference path="../util/url.ts"/>

//# DEPRECATED 1_4_10_0
/// <reference path="../loading/loader.ts"/>
//# /DEPRECATED 1_4_10_0



module kr3m.async
{
	export class Dom
	{
		private static addedLinks:{[url:string]:string} = {};



		public static addCssFromString(
			css:string,
			callback?:Callback,
			errorCallback?:Callback,
			rootUrl?:string):void
		{
			if (!css)
				return errorCallback && errorCallback();

			if (rootUrl)
			{
				css = css.replace(/url\s*\(\s*["']?(.+?)["']?\s*\)/ig, (match, url) =>
					"url('" + kr3m.util.Url.merge(rootUrl, url) + "')");
			}

			var styleObj = document.createElement("style");
			styleObj.innerHTML = css;
			document.body.appendChild(styleObj);
			callback && callback();
		}



//# DEPRECATED 1_4_10_0
		public static addCssFromUrl(
			cssUrl:string,
			callback:Callback,
			errorCallback?:Callback):void
		{
			var loader = kr3m.loading.Loader.getInstance();
			loader.queue(cssUrl, (cssContent) =>
			{
				Dom.addCssFromString(cssContent, callback, errorCallback, cssUrl);
			}, 0, errorCallback);
			loader.load();
		}
//# /DEPRECATED 1_4_10_0



		public static addCssLink(
			cssUrl:string,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			if (Dom.addedLinks[cssUrl] == kr3m.SUCCESS)
				return callback();

			if (Dom.addedLinks[cssUrl] == kr3m.ERROR_EXTERNAL)
				return errorCallback && errorCallback();

			if (Dom.addedLinks[cssUrl] == "LOADING")
			{
				setTimeout(() => Dom.addCssLink(cssUrl, callback, errorCallback), 100);
				return;
			}

			Dom.addedLinks[cssUrl] = "LOADING";

			var obj = document.createElement("link");
			obj.rel = "stylesheet";
			obj.type = "text\/css";
			obj.onerror = () =>
			{
				Dom.addedLinks[cssUrl] = kr3m.ERROR_EXTERNAL;
				errorCallback && errorCallback();
			};
			obj.onload = () =>
			{
				Dom.addedLinks[cssUrl] = kr3m.SUCCESS;
				callback && callback();
			};
			document.body.appendChild(obj);
			obj.href = cssUrl;
		}



//# DEPRECATED 1_4_10_0
		public static addJsFromUrl(
			jsUrl:string,
			callback:Callback,
			errorCallback?:Callback):void
		{
			var loader = kr3m.loading.Loader.getInstance();
			loader.queue(jsUrl, (jsContent:string) =>
			{
				var scriptObj = document.createElement("script");
				scriptObj.innerHTML = jsUrl;
				document.body.appendChild(scriptObj);
				setTimeout(callback, 1);
			}, 0, errorCallback);
			loader.load();
		}
//# /DEPRECATED 1_4_10_0



		public static addJsLink(
			jsUrl:string,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			if (Dom.addedLinks[jsUrl] == kr3m.SUCCESS)
				return callback && callback();

			if (Dom.addedLinks[jsUrl] == kr3m.ERROR_EXTERNAL)
				return errorCallback && errorCallback();

			if (Dom.addedLinks[jsUrl] == "LOADING")
			{
				setTimeout(() => Dom.addCssLink(jsUrl, callback, errorCallback), 100);
				return;
			}

			Dom.addedLinks[jsUrl] = "LOADING";

			var obj = document.createElement("script");
			obj.type = "text\/javascript";
			obj.onerror = () =>
			{
				Dom.addedLinks[jsUrl] = kr3m.ERROR_EXTERNAL;
				errorCallback && errorCallback();
			};
			obj.onload = () =>
			{
				Dom.addedLinks[jsUrl] = kr3m.SUCCESS;
				callback && callback();
			};
			document.body.appendChild(obj);
			obj.src = jsUrl;
		}
	}
}

/// <reference path="../lib/node.ts"/>
/// <reference path="../net/httprequest.ts"/>
/// <reference path="../net2/constants.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.javascript
{
	/*
		Helper class for web access from within a javascript sandbox.
	*/
	export class WebLib
	{
		private static cached:{[url:string]:{content:string, updatedWhen:number}} = {};

		public static TIMEOUT_DURATION = 2000;



		public static get():void
		{
			var url = <string> arguments[0];
			var params = arguments.length > 2 ? arguments[1] : undefined;
			var callback = <(content:string, httpStatus:number) => void> arguments[arguments.length - 1];

			var request = new kr3m.net.HttpRequest(url, params, "GET");
			request.send((response) => callback(response.toString(), 200), (errorMessage, statusCode) => callback("", statusCode));
		}



		public static getCached(
			url:string,
			ttl:number,
			callback:(content:string, httpStatus:number) => void):void
		{
			var cached = WebLib.cached[url];
			if (cached && cached.updatedWhen + ttl > Date.now())
				return callback(cached.content, 200);

			var request = new kr3m.net.HttpRequest(url, null, "GET");
			request.setTimeout(WebLib.TIMEOUT_DURATION, () =>
			{
				logWarning("WebLib.getCached('" + url + "') timed out");
				callback("", 500);
			});
			request.send((response) =>
			{
				var cached = {content : response.toString(), updatedWhen : Date.now()};
				WebLib.cached[url] = cached;
				callback(cached.content, 200);
			}, (errorMessage, statusCode) => callback("", statusCode));
		}



		public static post():void
		{
			var url = <string> arguments[0];
			var params = arguments.length > 2 ? arguments[1] : undefined;
			var callback = <(content:string, httpStatus:number) => void> arguments[arguments.length - 1];

			var request = new kr3m.net.HttpRequest(url, params, "POST");
			request.send((response) => callback(response.toString(), 200), (errorMessage, statusCode) => callback("", statusCode));
		}



		public static relay(
			url:string,
			options:{cacheDuration:number, uriPrefix?:string},
			callback:(newUrl:string) => void):void
		{
			options["url"] = url;
			var json = kr3m.util.Json.encode(options);
			var cipher = cryptoLib.createCipher("aes192", kr3m.net2.RELAY_PASSWORD);
			var relayUrl = cipher.update(json, "utf8", "hex") + cipher.final("hex");
			relayUrl = (options.uriPrefix === undefined ? "/r/" : options.uriPrefix) + relayUrl;
			callback(relayUrl);
		}
	}
}

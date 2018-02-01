/// <reference path="../util/json.ts"/>
/// <reference path="../util/util.ts"/>

//# !CLIENT
/// <reference path="../lib/node.ts"/>
//# /!CLIENT



module kr3m.util
{
//# CLIENT
	export class Fingerprint
	{
		private static data:any;
		private static hash:string;



		private static getCanvasPrint():string
		{
			var canvas = document.createElement("canvas");
			var context;
			try
			{
				context = canvas.getContext("2d");
			}
			catch (e)
			{
				return "";
			}

			var txt = "kr3m.com, <canvas> 3.1415";
			context.textBaseline = "top";
			context.font = "14px 'Arial'";
			context.textBaseline = "alphabetic";
			context.fillStyle = "#f60";
			context.fillRect(125, 1, 62, 20);
			context.fillStyle = "#069";
			context.fillText(txt, 2, 15);
			context.fillStyle = "rgba(102, 204, 0, 0.7)";
			context.fillText(txt, 4, 17);
			return canvas.toDataURL();
		}



		public static get():any
		{
			if (Fingerprint.data)
				return Fingerprint.data;

			var fp:any = {};
			fp.agent = navigator.userAgent;
			fp.canvas = Fingerprint.getCanvasPrint();
			fp.language = navigator.language || navigator["userLanguage"] || "";
			fp.plugins = kr3m.util.Util.gather(navigator.plugins, "name");
			fp.screen =
			{
				current : {w : screen.width, h : screen.height},
				available : {w : screen.availWidth, h : screen.availHeight},
				colorDepth : screen.colorDepth,
				dpi : {x : screen.deviceXDPI, y : screen.deviceYDPI}
			};
			fp.storage = {local : !!window.localStorage, session : !!window.sessionStorage};
			fp.systemLanguage = navigator["systemLanguage"] || "";
			var now = new Date();
			fp.timeOffset = now.getHours() - now.getUTCHours();
			Fingerprint.data = fp;
			return fp;
		}



		public static getHash():string
		{
			if (Fingerprint.hash)
				return Fingerprint.hash;

			Fingerprint.hash = kr3m.util.Json.encode(Fingerprint.get());
			return Fingerprint.hash;
		}
	}
//# /CLIENT



//# !CLIENT
	export class Fingerprint
	{
		public static get(request:any):any
		{
			var fp:any = {};
			fp.acceptLanguage = request.headers["accept-language"] || "";
			fp.host = request.host || request.headers["host"];
			fp.userAgent = request.headers["user-agent"] || "";
			return fp;
		}



		public static getHash(request:any):string
		{
			var print = kr3m.util.Json.encode(Fingerprint.get(request));
			return cryptoLib.createHash("md5").update(print).digest("hex");
		}
	}
//# /!CLIENT
}

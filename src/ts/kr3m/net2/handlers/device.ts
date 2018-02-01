/// <reference path="../../net2/handlers/abstract.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/tokenizer.ts"/>



module kr3m.net2.handlers
{
	/*
		Ein Handler, der das verwendete Gerät / Browser des
		Users auf Clientseite und Serverseite analysiert und
		die erkannten Eigenschaften im Vergleich anzeigt.
	*/
	export class Device extends Abstract
	{
		public template = "//# EMBED(embed/device.html, jsonNoQuotes)";
		public deviceJs = "//# EMBED(embed/device.js, jsonNoQuotes)";



		constructor(
			uriPattern:RegExp = /^\/device$/)
		{
			super(uriPattern);
		}



		public handle(context:Context):void
		{
			var serverDevice = kr3m.util.Json.encode(context.request.getDevice());
			var tokens =
			{
				deviceJs : this.deviceJs,
				serverDevice : serverDevice
			};
			var html = tokenize(this.template, tokens);
			context.flush(200, html, "text/html; charset=utf-8");
		}
	}
}

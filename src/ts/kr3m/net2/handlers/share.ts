/// <reference path="../../constants.ts"/>
/// <reference path="../../net2/handlers/abstract.ts"/>
/// <reference path="../../util/tokenizer.ts"/>



module kr3m.net2.handlers
{
	export class Share extends kr3m.net2.handlers.Abstract
	{
		public template = "//# EMBED(embed/share.html, jsonNoQuotes)";



		constructor(
			uriPattern:RegExp = /^\/share(\.php|\.html)?$/i)
		{
			super(uriPattern);
		}



		public handle(context:Context):void
		{
			var params = context.request.getQueryValues();
			for (var name in params)
			{
				if (name.slice(0, 2) == "og")
					params[name.slice(2)] = params[name];
			}

			for (var name in params)
				params[name] = kr3m.util.Util.encodeHtml(params[name]);

			for (var name in context.config.share)
				params[name] = params[name] || context.config.share[name] || "";

			var result = tokenize(this.template, params);
			context.flush(200, result, "text/html");
		}
	}
}

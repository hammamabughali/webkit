/// <reference path="../../cuboro/context.ts"/>
/// <reference path="../../kr3m/net2/handlers/ajaxgateway.ts"/>



module cuboro.handlers
{
	/*
		This handler delivers custom language file depending
		on which region's (CH, RU, JP, etc.) game is loaded.
	*/
	export class Language extends kr3m.net2.handlers.Abstract
	{
		constructor()
		{
			super(/\/lang_[a-z][a-z](?:[A-Z][A-Z])?\.json$/);
		}



		public handle(context:cuboro.Context):void
		{
			context.localization.getTexts(context, (texts) =>
			{
				var json = kr3m.util.Json.encode(texts);
				context.flush(200, json, "application/json; charset=utf-8");
			});
		}
	}
}

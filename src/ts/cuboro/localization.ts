/// <reference path="../cuboro/context.ts"/>
/// <reference path="../kr3m/net2/localizations/simple.ts"/>
/// <reference path="../kr3m/async/if.ts"/>



module cuboro
{
	export class Localization extends kr3m.net2.localizations.Simple
	{
		public getHash(
			context:cuboro.Context,
			callback:StringCallback):void
		{
			context.need({locales : true, region : true}, () =>
			{
				var matches = context.request.getUri().match(/^.*\/lang_([a-z][a-z](?:[A-Z][A-Z])?)\.json\b.*$/);
				var hash = matches ? matches[1] : "";
				kr3m.async.If.then(!hash, (thenDone) =>
				{					
					super.getHash(context, (supHash) =>
					{
						hash = supHash;
						thenDone();
					});
				}, () =>
				{
					if (hash.length == 2)
						hash += context.region.regionId;
					callback(hash);
				});				
			}, () => callback(this.config.fallbackLocale));
		}
	}
}

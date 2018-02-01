/// <reference path="../cache/async.ts"/>
/// <reference path="../loading/loader2.ts"/>
/// <reference path="../types.ts"/>



module kr3m.loading
{
	export class AssetLibrary
	{
		private cache:kr3m.cache.Async;
		private priority = 0;



		constructor()
		{
			this.cache = new kr3m.cache.Async((url:string, callback:AnyCallback) =>
			{
				var loader = Loader2.getInstance();
				loader.loadFile(url, this.priority, (content) =>
				{
					if (!content)
						return logError("could not load asset", url);
					callback(content);
				});
			});
		}



		public get(
			url:string,
			callback:AnyCallback,
			priority = 0):void
		{
			this.priority = priority;
			this.cache.get(url, callback);
		}
	}
}

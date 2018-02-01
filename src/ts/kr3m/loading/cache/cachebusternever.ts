/// <reference path="../../loading/cache/cachebuster.ts"/>



module kr3m.loading.cache
{
	/*
		Diese CacheBuster-Klasse verlässt sich vollständig auf den
		Browser-Cache und holt immer die Version daraus, wenn es
		eine gibt.
	*/
	export class CacheBusterNever extends kr3m.loading.cache.CacheBuster
	{
		public getString():string
		{
			return "";
		}
	}
}

/// <reference path="../../loading/cache/cachebuster.ts"/>
/// <reference path="../../util/rand.ts"/>



module kr3m.loading.cache
{
	/*
		Diese CacheBuster-Klasse umgeht den Browser-Cache völlig
		und lädt bei jedem Ladevorgang eine neue Version der Resource.
	*/
	export class CacheBusterAlways extends kr3m.loading.cache.CacheBuster
	{
		public getString():string
		{
			return "" + kr3m.util.Rand.getInt(0, 2000000000);
		}
	}
}

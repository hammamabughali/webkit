/// <reference path="../../loading/cache/cachebuster.ts"/>



module kr3m.loading.cache
{
	/*
		Diese CacheBuster-Klasse holt die Resourcen aus dem Browser-Cache
		wenn diese die gleiche Versionsnummer haben wie die, die dem
		CacheBuster im Konstruktor übergeben wurde. Anderfalls werden sie
		neu geladen.
	*/
	export class CacheBusterVersion extends kr3m.loading.cache.CacheBuster
	{
		private version:string;



		constructor(version:string)
		{
			super();
			this.version = version.replace(/[^_\w]/gi, "_");
		}



		public getString():string
		{
			return this.version;
		}
	}
}

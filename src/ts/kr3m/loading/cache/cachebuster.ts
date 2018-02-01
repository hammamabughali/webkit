/// <reference path="../../util/stringex.ts"/>



module kr3m.loading.cache
{
	/*
		Mit CacheBuster-Klassen kann kontrolliert werden, wie der Loader
		Resourcen von URLs lädt um zu verhindern, dass der Browser-Cache
		Probleme macht. Die verschiedenen abgeleiteten Klassen stellen
		verschiedene verhalten zur Verfügung.
	*/
	export abstract class CacheBuster
	{
		public abstract getString():string;



		public applyToUrl(url:string):string
		{
			var pos = url.indexOf("?");
			if (pos >= 0)
			{
				var query:string = url.substring(pos + 1);
				var params:any = kr3m.util.StringEx.splitAssoc(query);
				params["_"] = this.getString();
				url = url.substring(0, pos);
				url = url + "?" + kr3m.util.StringEx.joinAssoc(params);
			}
			else
			{
				url = url + "?_=" + this.getString();
			}
			return url;
		}
	}
}

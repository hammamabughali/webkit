module kr3m.canvas.util
{
	export class TextureCacheMap
	{
		private static keyMap:{[key:string]:string} = {};
		private static urlMap:{[url:string]:string} = {};



		public static add(key:string, url:string):void
		{
			canvas.util.TextureCacheMap.keyMap[key] = url;
			url = url.split('?')[0];
			canvas.util.TextureCacheMap.urlMap[url] = key;
		}



		public static getKeyByUrl(url:string):string
		{
			var key:string = canvas.util.TextureCacheMap.urlMap[url.split('?')[0]];
			return (!!key) ? key : null;
		}



		public static getUrlByKey(key:string):string
		{
			var url:string = canvas.util.TextureCacheMap.keyMap[key];
			return (!!url) ? url : null;
		}
	}
}

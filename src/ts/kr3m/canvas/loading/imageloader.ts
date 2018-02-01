/// <reference path="../../canvas/loading/iloader.ts"/>
/// <reference path="../../canvas/util/texturecachemap.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.loading
{
	export class ImageLoader extends PIXI.ImageLoader implements kr3m.canvas.loading.ILoader
	{
		private key:string;



		constructor(key:string, url:string, buildVersion:string = '1.0', crossorigin:boolean = false)
		{
			kr3m.canvas.util.TextureCacheMap.add(key, url);
			super(url, crossorigin);
			this.key = key;
		}
	}
}

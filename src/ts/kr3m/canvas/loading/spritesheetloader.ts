/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.loading
{
	export class SpriteSheetLoader extends PIXI.SpriteSheetLoader implements kr3m.canvas.loading.ILoader
	{
		private key:string;



		constructor(key:string, url:string, buildVersion:string = '1.0', crossorigin:boolean = false)
		{
			super(url + '?_=' + buildVersion, crossorigin);
		}
	}
}

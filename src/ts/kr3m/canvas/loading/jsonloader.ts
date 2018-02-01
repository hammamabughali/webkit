/// <reference path="../../canvas/loading/iloader.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.loading
{
	export class JsonLoader extends PIXI.JsonLoader implements kr3m.canvas.loading.ILoader
	{
		private key:string;



		constructor(key:string, url:string, buildVersion:string = '1.0', crossorigin:boolean = false)
		{
			super(url + '?_=' + buildVersion, crossorigin);
		}
	}
}

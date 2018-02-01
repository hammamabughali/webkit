/// <reference path="../../pogo/light.ts"/>



module pogo.lights
{
	export interface PointOptions extends pogo.LightOptions
	{
	}



	export class Point extends pogo.Light
	{
		protected options:PointOptions;



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity3d,
			options?:PointOptions)
		{
			super(parentOrCanvas, options);
		}
	}
}

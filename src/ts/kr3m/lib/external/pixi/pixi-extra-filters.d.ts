﻿/// <reference path="pixi.js.d.ts"/>

/*
	Support for the community filters not found in the core
	Commit History Review 10/Aug
		https://github.com/pixijs/pixi-extra-filters
	*/
declare module PIXI
{
	export module filters
	{
		export class BulgePinchFilters extends PIXI.Filter
		{
			radius:number;
			strength:number;
			center: PIXI.Point;
		}

		export class ColorReplaceFilter extends PIXI.Filter
		{
			constructor(originalColor:number[], newColor:number[], epsilon?:number);

			originalColor:number[];
			newColor:number[];
			epsilon:number;
		}

		export class GlowFilter extends PIXI.Filter
		{
			color:number;
			outerStrength:number;
			innerStrength:number;
			viewWidth:number;
			viewHeight:number;

			constructor(viewWidth:number, viewHeight:number, distance:number, outerStrength:number, innerStrength:number, color:number, quality:number);
		}

		export class OutlineFilter extends PIXI.Filter
		{
			color:number;
			viewWidth:number;
			viewHeight:number;

			constructor(viewWidth:number, viewHeight:number, thickness:number, color:number);
		}
	}
}

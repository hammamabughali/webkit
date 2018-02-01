/// <reference path="slice9.ts"/>



module gf.display
{
	export class Slice3 extends gf.display.Slice9
	{
		constructor(game:gf.core.Game, firstSize:number, secondSize:number, key:string | PIXI.Texture, frameName?:string, direction:string = gf.HORIZONTAL)
		{
			let h:boolean = direction == gf.HORIZONTAL;

			super(game, h ? firstSize : 10, h ? 10 : firstSize, h ? secondSize : 10, h ? 10 : secondSize, key, frameName);
		}
	}
}

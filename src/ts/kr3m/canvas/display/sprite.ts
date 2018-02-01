/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.display
{
	export class Sprite extends PIXI.Sprite
	{
		public frameName:string;



		constructor(key:string, frameTexture:boolean = false)
		{
			super((!frameTexture) ? PIXI.Texture.fromImage(key) : PIXI.Texture.fromFrame(key));
			this.frameName = key;
		}
	}
}

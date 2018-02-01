/// <reference path="../../canvas/display/sprite.ts"/>
/// <reference path="../../canvas/util/transform.ts"/>



module kr3m.canvas.display
{
	export class DragonBonesSprite extends kr3m.canvas.display.Sprite
	{
		public skew:PIXI.Point;



		constructor(key:string, frameTexture:boolean = false)
		{
			super(key, frameTexture);

			this.skew = new PIXI.Point();
		}



		public updateTransform():void
		{
			kr3m.canvas.util.updateTranform(this);
		}
	}
}

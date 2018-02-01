/// <reference path="../../canvas/util/transform.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.display
{
	export class DragonBonesContainer extends PIXI.DisplayObjectContainer
	{
		public skew:PIXI.Point;



		constructor()
		{
			super();
			this.skew = new PIXI.Point();
		}



		public updateTransform():void
		{
			kr3m.canvas.util.updateTranform(this);

			for (var i = 0, j = this.children.length; i < j; i++)
				this.children[i].updateTransform();
		}
	}
}

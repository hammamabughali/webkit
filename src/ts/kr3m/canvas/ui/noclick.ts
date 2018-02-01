/// <reference path="../../canvas/app/application.ts"/>


module kr3m.canvas.ui
{
	export class NoClick extends PIXI.Graphics
	{
		constructor(app:kr3m.canvas.app.Application, width:number = null, height:number = null)
		{
			super();

			if (width == null)
				width = app.renderer.width;

			if (height == null)
				height = app.renderer.height;

			this.beginFill(0xFF00FF, 0);
			this.drawRect(0, 0, width, height);
			this.endFill();

			this.interactive = true;
			this.buttonMode = false;

			var handler = (data:PIXI.InteractionData) => {};
			this.mouseover = this.mouseout = this.mousedown = this.mouseup = this.mouseupoutside = handler;
			this.click = this.touchstart = this.touchend = this.touchendoutside = this.tap = handler;
		}
	}
}

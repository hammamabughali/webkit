/// <reference path="../../pogo/texture.ts"/>
/// <reference path="../../pogo/ticked.ts"/>
/// <reference path="../../ui2/canvas2d.ts"/>



module pogo.textures
{
	export interface CanvasOptions extends pogo.TextureOptions
	{
		width?:number;
		height?:number;
	}



	export abstract class Canvas extends pogo.Texture implements pogo.Ticked
	{
		protected options:CanvasOptions;

		public canvas2d:kr3m.ui2.Canvas2d;



		constructor(
			canvas:pogo.Canvas,
			options?:CanvasOptions)
		{
			super(canvas, options);
			this.canvas2d = new kr3m.ui2.Canvas2d(null, {width : this.options.width || 512, height : this.options.height || 512});
			canvas.addTicked(this);
		}



		public update(data:pogo.TickData):void
		{
			//# FIXME: NYI update
			this.setImage(this.canvas.getDomElement());
		}
	}
}

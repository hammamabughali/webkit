/// <reference path="../../math/vector2d.ts"/>
/// <reference path="../../pogo/frames/rectangle.ts"/>



module pogo.frames
{
	export interface ThumbControlOptions extends RectangleOptions
	{
		controlTextureUrl:string,
		controlWidth:number,
		controlHeight:number
	}



	export class ThumbControl extends Rectangle
	{
		protected options:ThumbControlOptions;

		private control:Rectangle;
		private wBg:number;
		private hBg:number;
		private wC:number;
		private hC:number;
		private maxLen:number;

		public output = new kr3m.math.Vector2d();



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity2d,
			options:ThumbControlOptions)
		{
			super(parentOrCanvas, options);
			this.px = this.options.width / 2;
			this.py = this.options.height / 2;

			this.control = new Rectangle(this,
			{
				width : this.options.controlWidth,
				height : this.options.controlHeight,
				textureUrl : this.options.controlTextureUrl
			});
			this.control.px = this.options.controlWidth / 2;
			this.control.py = this.options.controlHeight / 2;

			this.wBg = this.options.width;
			this.hBg = this.options.height;
			this.wC = this.options.controlWidth;
			this.hC = this.options.controlHeight;

			this.maxLen = Math.min(this.options.width, this.options.height) / 2;
		}



		public update(data:pogo.TickData):void
		{
			super.update(data);

			//# TODO: soll das hier auf ein Event-driven System umgestellt werden?
			var touches = this.canvas.touchscreen.getTouchesStartedInArea(this.x - this.maxLen, this.y - this.maxLen, this.maxLen * 2, this.maxLen * 2);
			if (touches.length > 0)
			{
				var t = touches[0];
				var v = new kr3m.math.Vector2d(t.x - this.x, t.y - this.y);
				var f = v.length() / this.maxLen;
				if (f > 1)
				{
					v.scale(1 / f);
					f = 1;
				}
				this.output.x = v.x / this.maxLen;
				this.output.y = v.y / this.maxLen;
				this.control.tween.stop();
				this.control.x = v.x;
				this.control.y = v.y;
			}
			else
			{
				this.output.x = 0;
				this.output.y = 0;
				this.control.tween.to(0.2, {x:0, y:0});
			}
		}
	}
}

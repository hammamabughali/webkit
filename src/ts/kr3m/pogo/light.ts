/// <reference path="../pogo/entity3d.ts"/>
/// <reference path="../webgl/color.ts"/>



module pogo
{
	export interface LightOptions extends Entity3dOptions
	{
		color?:kr3m.webgl.Color;
	}



	export class Light extends Entity3d
	{
		protected options:LightOptions;

		protected color = new kr3m.webgl.Color(1, 1, 1);



		constructor(
			parentOrCanvas:Canvas|Entity3d,
			options?:LightOptions)
		{
			super(parentOrCanvas, options);

			if (this.options.color)
				this.setColor(this.options.color);
		}



		public setColor(r:number, g:number, b:number):void;
		public setColor(col:kr3m.webgl.Color):void;
		public setColor():void
		{
			if (arguments.length == 1)
			{
				this.color.r = arguments[0].r;
				this.color.g = arguments[0].g;
				this.color.b = arguments[0].b;
			}
			else
			{
				this.color.r = arguments[0];
				this.color.g = arguments[1];
				this.color.b = arguments[2];
			}
		}



		public set col(value:kr3m.webgl.Color)
		{
			this.color.r = value.r;
			this.color.g = value.g;
			this.color.b = value.b;
		}



		public get col():kr3m.webgl.Color
		{
			return this.color.clone();
		}



		public pushColor(stream:number[]):void
		{
			stream.push(this.color.r);
			stream.push(this.color.g);
			stream.push(this.color.b);
		}
	}
}

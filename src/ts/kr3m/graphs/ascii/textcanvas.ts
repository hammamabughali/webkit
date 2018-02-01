/// <reference path="../../model/array2d.ts"/>
/// <reference path="../../util/log.ts"/>

//# !CLIENT
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../lib/readline.ts"/>
//# /!CLIENT



//# EXPERIMENTAL
module kr3m.graphs.ascii
{
	export class TextCanvas
	{
		protected buffer:kr3m.model.Array2d<string>;
		protected colorPrefix:string = "";
		protected colorSuffix:string = "";



		constructor(
			protected width:number,
			protected height:number)
		{
			this.buffer = new kr3m.model.Array2d<string>(" ", width, height);
		}



		public setColor(color:string = ""):TextCanvas
		{
			this.colorPrefix = color;
			this.colorSuffix = color ? kr3m.util.Log.COLOR_RESET : "";
			return this;
		}



		public put(x:number, y:number, v:string = "*"):TextCanvas
		{
			if (x >= 0 && x < this.width && y >= 0 && y < this.height)
				this.buffer.set(x, y, this.colorPrefix + v + this.colorSuffix);
			return this;
		}



		public box(x:number, y:number, w:number, h:number, v:string = "*"):TextCanvas
		{
			for (var yy = 0; yy < h; ++yy)
			{
				for (var xx = 0; xx < w; ++xx)
					this.put(x + xx, y + yy, v);
			}
			return this;
		}



		public text(x:number, y:number, text:string):TextCanvas
		{
			var startX = x;
			for (var i = 0; i < text.length; ++i)
			{
				var t = text.charAt(i);
				if (t == "\n")
				{
					++y;
					x = startX;
				}
				else
				{
					this.put(x, y, t);
					++x;
				}
			}
			return this;
		}



		public log():TextCanvas
		{
			for (var i = 0; i < this.buffer.getHeight(); ++i)
				log(this.buffer.getRow(i).join(""));
			return this;
		}



//# !CLIENT
		public out(x:number, y:number):TextCanvas
		{
			readlineLib.cursorTo(process.stdout, x, y);
			for (var i = 0; i < this.buffer.getHeight(); ++i)
			{
				if (x != 0)
					readlineLib.cursorTo(process.stdout, x, y + i);
				console.log(this.buffer.getRow(i).join(""));
			};
			return this;
		}
//# /!CLIENT
	}
}
//# /EXPERIMENTAL

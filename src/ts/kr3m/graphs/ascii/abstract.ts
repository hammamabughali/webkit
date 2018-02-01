/// <reference path="../../graphs/ascii/textcanvas.ts"/>
/// <reference path="../../graphs/math.ts"/>
/// <reference path="../../util/log.ts"/>



//# EXPERIMENTAL
module kr3m.graphs.ascii
{
	export abstract class Abstract
	{
		protected data:number[][] = [];
		protected legend:string[][] = [];

		protected colors:string[] =
		[
			kr3m.util.Log.COLOR_BRIGHT_RED,
			kr3m.util.Log.COLOR_BRIGHT_GREEN,
			kr3m.util.Log.COLOR_BRIGHT_BLUE,
			kr3m.util.Log.COLOR_BRIGHT_YELLOW,
			kr3m.util.Log.COLOR_BRIGHT_MAGENTA,
			kr3m.util.Log.COLOR_BRIGHT_CYAN,
			kr3m.util.Log.COLOR_DARK_RED,
			kr3m.util.Log.COLOR_DARK_GREEN,
			kr3m.util.Log.COLOR_DARK_BLUE,
			kr3m.util.Log.COLOR_DARK_YELLOW,
			kr3m.util.Log.COLOR_DARK_MAGENTA,
			kr3m.util.Log.COLOR_DARK_CYAN
		];



		public formatter = (value:number) => value.toString();



		constructor(
			protected width:number = 60,
			protected height:number = 40)
		{
		}



		public setData(data:number[][]):void
		{
			this.data = data;
		}



		public getData():number[][]
		{
			return this.data;
		}



		public setLegend(legend:string[][]):void
		{
			this.legend = legend;
		}



		public getLegend():string[][]
		{
			return this.legend;
		}



		public abstract log():void;
	}
}
//# /EXPERIMENTAL

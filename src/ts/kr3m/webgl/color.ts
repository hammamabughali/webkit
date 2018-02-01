/// <reference path="../math/interpolatable.ts"/>



module kr3m.webgl
{
	export class Color implements kr3m.math.Interpolatable<kr3m.webgl.Color>
	{
		constructor(public r:number = 0, public g:number = 0, public b:number = 0)
		{
		}



		public clone():kr3m.webgl.Color
		{
			return new kr3m.webgl.Color(this.r, this.g, this.b);
		}



		public interpolated(f:number, other:kr3m.webgl.Color):kr3m.webgl.Color
		{
			var r = (other.r - this.r) * f + this.r;
			var g = (other.g - this.g) * f + this.g;
			var b = (other.b - this.b) * f + this.b;
			return new kr3m.webgl.Color(r, g, b);
		}



		public fromRaw(raw:any):kr3m.webgl.Color
		{
			return new kr3m.webgl.Color(raw.r || 0, raw.g || 0, raw.b || 0);
		}
	}
}

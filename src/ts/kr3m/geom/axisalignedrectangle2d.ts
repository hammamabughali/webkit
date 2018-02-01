/// <reference path="../math/matrix2x3.ts"/>
/// <reference path="../math/vector2d.ts"/>



module kr3m.geom
{
	/*
		Hilfsklasse zum Arbeiten mit Rechtecken, die an
		den X- und Y-Achsen des Koordinatensystems
		ausgerichtet sind (ohne Drehung oder andere
		Verzerrungen).
	*/
	export class AxisAlignedRectangle2d
	{
		constructor(
			public x = 0, public y = 0,
			public w = 0, public h = 0)
		{
		}



		public intersects(aaR:AxisAlignedRectangle2d):boolean
		{
			if (aaR.x > this.x + this.w)
				return false;

			if (aaR.y > this.y + this.h)
				return false;

			if (aaR.x + aaR.w < this.x)
				return false;

			if (aaR.y + aaR.h < this.y)
				return false;

			return true;
		}



		public contains(aaR:AxisAlignedRectangle2d):boolean
		{
			if (aaR.x + aaR.w > this.x + this.w)
				return false;

			if (aaR.y + aaR.h > this.y + this.h)
				return false;

			if (aaR.x < this.x)
				return false;

			if (aaR.y < this.y)
				return false;

			return true;
		}



		public getArea():number
		{
			return this.w * this.h;
		}



		public clip(aaR:AxisAlignedRectangle2d):void
		{
			var x = Math.max(this.x, aaR.x);
			var y = Math.max(this.y, aaR.y);
			var w = Math.min(this.right(), aaR.right()) - x;
			var h = Math.min(this.bottom(), aaR.bottom()) - y;
			aaR.x = x;
			aaR.y = y;
			aaR.w = Math.max(0, w);
			aaR.h = Math.max(0, h);
		}



		public merge(aaR:AxisAlignedRectangle2d):void
		{
			var x = Math.min(this.x, aaR.x);
			var y = Math.min(this.y, aaR.y);
			var w = Math.max(this.right(), aaR.right()) - x;
			var h = Math.max(this.bottom(), aaR.bottom()) - y;
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}



		public round():void
		{
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.w = Math.ceil(this.w);
			this.h = Math.ceil(this.h);
		}



		public transformedBounds(
			transform:kr3m.math.Matrix2x3):AxisAlignedRectangle2d
		{
			var p:kr3m.math.Vector2d[] =
			[
				new kr3m.math.Vector2d(this.x, this.y),
				new kr3m.math.Vector2d(this.x + this.w, this.y),
				new kr3m.math.Vector2d(this.x, this.y + this.h),
				new kr3m.math.Vector2d(this.x + this.w, this.y + this.h)
			];

			for (var i = 0; i < 4; ++i)
				p[i] = transform.applied(p[i]);

			var x = Math.min(p[0].x, p[1].x, p[2].x, p[3].x);
			var y = Math.min(p[0].y, p[1].y, p[2].y, p[3].y);
			var w = Math.max(p[0].x, p[1].x, p[2].x, p[3].x) - x;
			var h = Math.max(p[0].y, p[1].y, p[2].y, p[3].y) - y;
			return new AxisAlignedRectangle2d(x, y, w, h);
		}



		public boundPoints(points:kr3m.math.Vector2d[]):void
		{
			if (points.length == 0)
			{
				this.x = 0;
				this.y = 0;
				this.w = 0;
				this.h = 0;
				return;
			}

			var x1 = points[0].x;
			var x2 = points[0].x;
			var y1 = points[0].y;
			var y2 = points[0].y;

			for (var i = 1; i < points.length; ++i)
			{
				x1 = Math.min(x1, points[i].x);
				x2 = Math.max(x2, points[i].x);
				y1 = Math.min(y1, points[i].y);
				y2 = Math.max(y2, points[i].y);
			}

			this.x = x1;
			this.y = y1;
			this.w = x2 - x1 + 1;
			this.h = y2 - y1 + 1;
		}



		public clone():AxisAlignedRectangle2d
		{
			return new AxisAlignedRectangle2d(this.x, this.y, this.w, this.h);
		}



		public left():number
		{
			return this.x;
		}



		public right():number
		{
			return this.x + this.w;
		}



		public top():number
		{
			return this.y;
		}



		public bottom():number
		{
			return this.y + this.h;
		}



		public squeezeLeft(amount:number):void
		{
			this.w -= amount;
		}



		public squeezeRight(amount:number):void
		{
			this.x += amount;
			this.w -= amount;
		}



		public squeezeDown(amount:number):void
		{
			this.y += amount;
			this.h -= amount;
		}



		public squeezeUp(amount:number):void
		{
			this.h -= amount;
		}



		public pushLeft(amount:number):void
		{
			this.x -= amount;
		}



		public pushRight(amount:number):void
		{
			this.x += amount;
		}



		public pushDown(amount:number):void
		{
			this.y += amount;
		}



		public pushUp(amount:number):void
		{
			this.y -= amount;
		}
	}
}

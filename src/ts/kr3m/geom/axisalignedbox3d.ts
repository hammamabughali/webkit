/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../math/vector3d.ts"/>



module kr3m.geom
{
	/*
		Hilfsklasse zum Arbeiten mit Quadern, die an
		den X-, Y- und Z-Achsen des Koordinatensystems
		ausgerichtet sind (ohne Drehung oder andere
		Verzerrungen).
	*/
	export class AxisAlignedBox3d
	{
		constructor(
			public x = 0, public y = 0, public z = 0,
			public w = 0, public h = 0, public d = 0)
		{
		}



		public clone():AxisAlignedBox3d
		{
			return new AxisAlignedBox3d(this.x, this.y, this.z, this.w, this.h, this.d);
		}



		public enclose(vs:kr3m.math.Vector3d[]):void
		{
			this.x = vs[0].x;
			this.y = vs[0].y;
			this.z = vs[0].z;
			this.w = 0;
			this.h = 0;
			this.d = 0;
			for (var i = 1; i < vs.length; ++i)
			{
				var v = vs[i];

				if (v.x < this.x)
				{
					this.w += this.x - v.x;
					this.x = v.x;
				}

				if (v.y < this.y)
				{
					this.h += this.y - v.y;
					this.y = v.y;
				}

				if (v.z < this.z)
				{
					this.d += this.z - v.z;
					this.z = v.z;
				}

				if (v.x > this.x + this.w)
					this.w = v.x - this.x;

				if (v.y > this.y + this.h)
					this.h = v.y - this.y;

				if (v.z > this.z + this.d)
					this.d = v.z - this.z;
			}
		}



		public applyMatrix(m:kr3m.math.Matrix4x4):AxisAlignedBox3d
		{
			var vs =
			[
				new kr3m.math.Vector3d(this.x, this.y, this.z),
				new kr3m.math.Vector3d(this.x, this.y, this.z + this.d),
				new kr3m.math.Vector3d(this.x, this.y + this.h, this.z),
				new kr3m.math.Vector3d(this.x, this.y + this.h, this.z + this.d),
				new kr3m.math.Vector3d(this.x + this.w, this.y, this.z),
				new kr3m.math.Vector3d(this.x + this.w, this.y, this.z + this.d),
				new kr3m.math.Vector3d(this.x + this.w, this.y + this.h, this.z),
				new kr3m.math.Vector3d(this.x + this.w, this.y + this.h, this.z + this.d)
			];

			for (var i = 0; i < vs.length; ++i)
				vs[i] = m.apply3d(vs[i]);

			var aaB = new AxisAlignedBox3d();
			aaB.enclose(vs);
			return aaB;
		}



		public equals(aaB:AxisAlignedBox3d):boolean
		{
			return aaB.x == this.x && aaB.y == this.y && aaB.z == this.z && aaB.w == this.w && aaB.h == this.h && aaB.d == this.d;
		}



		public intersects(aaB:AxisAlignedBox3d):boolean
		{
			if (aaB.x > this.x + this.w)
				return false;

			if (aaB.y > this.y + this.h)
				return false;

			if (aaB.z > this.z + this.d)
				return false;

			if (aaB.x + aaB.w < this.x)
				return false;

			if (aaB.y + aaB.h < this.y)
				return false;

			if (aaB.z + aaB.d < this.z)
				return false;

			return true;
		}



		public contains(aaB:AxisAlignedBox3d):boolean
		{
			if (aaB.x < this.x)
				return false;

			if (aaB.y < this.y)
				return false;

			if (aaB.z < this.z)
				return false;

			if (aaB.x + aaB.w > this.x + this.w)
				return false;

			if (aaB.y + aaB.h > this.y + this.h)
				return false;

			if (aaB.z + aaB.d > this.z + this.d)
				return false;

			return true;
		}



		public getVolume():number
		{
			return Math.abs(this.w * this.h * this.d);
		}



		public clip(aaB:AxisAlignedBox3d):void
		{
			var x = Math.max(this.x, aaB.x);
			var y = Math.max(this.y, aaB.y);
			var z = Math.max(this.z, aaB.z);
			var w = Math.min(this.right(), aaB.right()) - x;
			var h = Math.min(this.bottom(), aaB.bottom()) - y;
			var d = Math.min(this.front(), aaB.front()) - z;
			aaB.x = x;
			aaB.y = y;
			aaB.z = z;
			aaB.w = Math.max(0, w);
			aaB.h = Math.max(0, h);
			aaB.d = Math.max(0, d);
		}



		public merge(aaB:AxisAlignedBox3d):void
		{
			var x = Math.min(this.x, aaB.x);
			var y = Math.min(this.y, aaB.y);
			var z = Math.min(this.z, aaB.z);
			var w = Math.max(this.right(), aaB.right()) - x;
			var h = Math.max(this.bottom(), aaB.bottom()) - y;
			var d = Math.max(this.front(), aaB.front()) - z;
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			this.h = h;
			this.d = d;
		}



		public round():void
		{
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			this.z = Math.floor(this.z);
			this.w = Math.ceil(this.w);
			this.h = Math.ceil(this.h);
			this.d = Math.ceil(this.d);
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
			return this.y + this.h;
		}



		public bottom():number
		{
			return this.y;
		}



		public back():number
		{
			return this.z;
		}



		public front():number
		{
			return this.z + this.d;
		}
	}
}

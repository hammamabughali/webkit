/// <reference path="../math/mathex.ts"/>
/// <reference path="../math/matrix.ts"/>
/// <reference path="../math/vector2d.ts"/>



module kr3m.math
{
	/*
		Eine einfache 2x3 Matrix, wie sie oft in der 2D-Grafik
		verwendet wird. Über diese Matrix können Verschiebungen
		(Translation), Drehungen (Rotation) und Skalierungen
		von Objekten durchgeführt werden.

		Vorsicht: diese Matrix ist keine "richtige" Matrix. Sie
		verhält sich wie eine affine 3x3 Matrix bei der die
		letzte Zeile immer die Werte 0, 0 und 1 hat.
	*/
	export class Matrix2x3 extends Matrix
	{
		constructor()
		{
			super(2, 3);
			this.v[0] = 1;
			this.v[3] = 1;
		}



		public setFrom(m:Matrix2x3):void
		{
			for (var i = 0; i < this.v.length; ++i)
				this.v[i] = m.v[i];
		}



		public clone():Matrix2x3
		{
			var m = new Matrix2x3();
			for (var i = 0; i < this.v.length; ++i)
				m.v[i] = this.v[i];
			return m;
		}



		public setTranslation(x:number, y:number):void;
		public setTranslation(v:Vector2d):void;

		public setTranslation():void
		{
			if (arguments.length == 2)
			{
				var x = <number> arguments[0];
				var y = <number> arguments[1];
			}
			else
			{
				var v = <Vector2d> arguments[0];
				var x = v.x;
				var y = v.y;
			}

			this.v[ 0] = 1; this.v[2] = 0; this.v[4] = x;
			this.v[ 1] = 0; this.v[3] = 1; this.v[5] = y;
		}



		public translate(x:number, y:number):void
		{
			this.v[4] += x;
			this.v[5] += y;
		}



		/*
			Rotiert um angle Grad um den Ursprungspunkt im Uhrzeigersinn.
		*/
		public rotate(angle:number):void
		{
			var v = this.v.slice();
			var c = Math.cos(angle * DEG_2_RAD);
			var s = Math.sin(angle * DEG_2_RAD);
			this.v[0] = c * v[0] - s * v[1]; this.v[2] = c * v[2] - s * v[3]; this.v[4] = c * v[4] - s * v[5];
			this.v[1] = s * v[0] + c * v[1]; this.v[3] = s * v[2] + c * v[3]; this.v[5] = s * v[4] + c * v[5];
		}



		public rotateAround(angle:number, x:number, y:number):void
		{
			this.translate(-x, -y);
			this.rotate(angle);
			this.translate(x, y);
		}



		public setScale(x:number, y:number, z:number):void;
		public setScale(v:Vector2d):void;

		public setScale():void
		{
			if (arguments.length == 2)
			{
				var x = <number> arguments[0];
				var y = <number> arguments[1];
			}
			else
			{
				var v = <Vector2d> arguments[0];
				var x = v.x;
				var y = v.y;
			}

			this.v[0] = x; this.v[2] = 0; this.v[4] = 0;
			this.v[1] = 0; this.v[3] = y; this.v[5] = 0;
		}



		public scale(x:number, y:number = x):void
		{
			for (var i = 0; i < this.v.length; )
			{
				this.v[i++] *= x;
				this.v[i++] *= y;
			}
		}



		public scaleFrom(s:number, x:number, y:number):void
		{
			this.translate(-x, -y);
			this.scale(s);
			this.translate(x, y);
		}



		public scaleXYFrom(sx:number, sy:number, x:number, y:number):void
		{
			this.translate(-x, -y);
			this.scale(sx, sy);
			this.translate(x, y);
		}



		public scaled(factor:number):Matrix
		{
			var s = new Matrix(this.m, this.n);
			for (var i = 0; i < 4; ++i)
				s.v[i] = this.v[i] * factor;
			s.v[4] = this.v[4];
			s.v[5] = this.v[5];
			return s;
		}



		public transposed():Matrix
		{
			var t = new Matrix(3,2);
			t.v[0] = this.v[0]; t.v[3] = this.v[1];
			t.v[1] = this.v[2]; t.v[4] = this.v[3];
			t.v[2] = this.v[4]; t.v[5] = this.v[5];
			return t;
		}



		public concated2x3(m:Matrix):Matrix2x3
		{
			var c = new Matrix2x3();
			c.v[0] = this.v[0] * m.v[0] + this.v[2] * m.v[1]; c.v[2] = this.v[0] * m.v[2] + this.v[2] * m.v[3]; c.v[4] = this.v[0] * m.v[4] + this.v[2] * m.v[5] + this.v[4];
			c.v[1] = this.v[1] * m.v[0] + this.v[3] * m.v[1]; c.v[3] = this.v[1] * m.v[2] + this.v[3] * m.v[3]; c.v[5] = this.v[1] * m.v[4] + this.v[3] * m.v[5] + this.v[5];
			return c;
		}



		public concat2x3(m:Matrix2x3):void
		{
			var r = this.concated2x3(m);
			this.v = r.v;
		}



		public applied(v:Vector2d):Vector2d
		{
			var x = this.v[0] * v.x + this.v[2] * v.y + this.v[4];
			var y = this.v[1] * v.x + this.v[3] * v.y + this.v[5];
			return new Vector2d(x, y);
		}
	}
}

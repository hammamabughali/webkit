module kr3m.math
{
	/*
		Eine Matrix beliebiger Größe. Sofern vorhanden
		sollten andere Matrix-Klassen verwendet werden,
		die auf die entsprechenden Dimensionen optimiert
		sind, wie z.B. Matrix3x3 oder
		Matrix2x2 usw. Eine m x n Matrix hat
		m Zeilen und n Reihen. Die einzelnen Werte werden
		zeilenweise gespeichert.
	*/
	export class Matrix
	{
		public m:number;
		public n:number;
		public v:number[] = [];



		constructor(m:number, n:number)
		{
			this.m = m;
			this.n = n;
			for (var i = n * m; i > 0; --i)
				this.v.push(0);
		}



		public setIdentity():void
		{
			for (var x = 0; x < this.m; ++x)
				for (var y = 0; y < this.n; ++y)
					this.v[y * this.m + x] = (x == y) ? 1 : 0;
		}



		public copyFrom(m:Matrix):void
		{
//# DEBUG
			if (this.m != m.m || this.n != m.n)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
//# /DEBUG

			for (var i = 0; i < this.v.length; ++i)
				this.v[i] = m.v[i];
		}



		public cwCalled(func:(component:number) => number):Matrix
		{
			var m = new Matrix(this.m, this.n);
			m.v = this.v.map(func);
			return m;
		}



		public concat(m:Matrix):void
		{
			var c = this.concated(m);
			this.v = c.v;
		}



		public transposed():Matrix
		{
			var r = new Matrix(this.n, this.m);
			for (var x = 0; x < this.m; ++x)
				for (var y = 0; y < this.n; ++y)
					r.v[x * this.n + y] = this.v[y * this.m + x];
			return r;
		}



		/*
			Komponentenweise Addition
		*/
		public plus(m:Matrix):Matrix
		{
//# DEBUG
			if (this.m != m.m || this.n != m.n)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
//# /DEBUG

			var r = new Matrix(this.m, this.n);
			for (var i = 0; i < this.v.length; ++i)
				r.v[i] = this.v[i] + m.v[i];
			return r;
		}



		/*
			Komponentenweise Addition
		*/
		public add(m:Matrix):void
		{
//# DEBUG
			if (this.m != m.m || this.n != m.n)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
//# /DEBUG

			for (var i = 0; i < this.v.length; ++i)
				this.v[i] += m.v[i];
		}



		/*
			Komponentenweise Subtraktion
		*/
		public minus(m:Matrix):Matrix
		{
//# DEBUG
			if (this.m != m.m || this.n != m.n)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
//# /DEBUG

			var r = new Matrix(this.m, this.n);
			for (var i = 0; i < this.v.length; ++i)
				r.v[i] = this.v[i] - m.v[i];
			return r;
		}



		/*
			Komponentenweise Multiplikation
		*/
		public times(m:Matrix):Matrix
		{
//# DEBUG
			if (this.m != m.m || this.n != m.n)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " != " + m.m + "x" + m.n);
//# /DEBUG

			var r = new Matrix(this.m, this.n);
			for (var i = 0; i < this.v.length; ++i)
				r.v[i] = this.v[i] * m.v[i];
			return r;
		}



		public scaled(factor:number):Matrix
		{
			var r = new Matrix(this.m, this.n);
			for (var i = 0; i < this.v.length; ++i)
				r.v[i] = this.v[i] * factor;
			return r;
		}



		public concated(m:Matrix):Matrix
		{
//# DEBUG
			if (this.n != m.m)
				throw new Error("matrix dimensions do not match: " + this.m + "x" + this.n + " can't be concated with " + m.m + "x" + m.n);
//# /DEBUG

			var c = new Matrix(this.m, m.n);
			for (var i = 0; i < this.m; ++i)
			{
				for (var j = 0; j < m.n; ++j)
				{
					var index = j * c.m + i;
					c.v[index] = 0;
					for (var k = 0; k < this.n; ++k)
						c.v[index] += this.v[k * this.m + i] * m.v[j * m.m + k];
				}
			}
			return c;
		}



		public loadArray(values:number[]):void
		{
			if (values.length != this.v.length)
				throw new Error("loadArray values length doesn't match internal matrix v length");

			for (var i = 0; i < values.length; ++i)
				this.v[i] = values[i];
		}



		public toArray():number[]
		{
			return this.v.slice();
		}



		public getDump():string
		{
			var output = "\n";
			for (var i = 0; i < this.m; ++i)
			{
				var line = "|";
				for (var j = 0; j < this.n; ++j)
				{
					line += "\t" + this.v[j * this.m + i];
				}
				line += "\t|\n";
				output += line;
			}
			return output;
		}
	}
}

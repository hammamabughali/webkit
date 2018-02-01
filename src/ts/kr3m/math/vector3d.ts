/// <reference path="../math/accumulable.ts"/>
/// <reference path="../math/interpolatable.ts"/>
/// <reference path="../math/mathex.ts"/>



module kr3m.math
{
	/*
		Allgemeine Vektorklasse für den 3d-Raum.

		Zur Verwendung: die Methoden, die wie eine Rechenoperation
		heißen, verändern den Vektor, dessen Methode aufgerufen wird
		und geben kein Ergebnis zurück (z.B. add, subtract, scale).

		Die Methoden, die nach einem Rechenzeichen benannt sind (z.B.
		plus, minus), führen die dazugehörige Rechenoperation aus und
		geben das Ergebnis zurück - der Vektor, dessen Methode
		ausgeführt wurde bleibt dabei unverändert.

		Erstere Methoden sind schneller aber umständlicher zu handhaben,
		die zweiten sind komfortabler zum Rechnen längerer Formeln im
		Vektorraum. Wenn es nicht dringend auf Schnelligkeit ankommt,
		können die letztern ohne Bedenken verwendet werden.

		Winkelangaben werden alle in Grad gemacht.
	*/
	export class Vector3d implements Interpolatable<Vector3d>, Accumulable<Vector3d>
	{
		constructor(
			public x = 0,
			public y = 0,
			public z = 0)
		{
		}



		public clone():Vector3d
		{
			return new Vector3d(this.x, this.y, this.z);
		}



		public add(v:{x:number, y:number, z:number}):void
		{
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
		}



		public accumulate(v:{x:number, y:number, z:number}):void
		{
			this.add(v);
		}



		public plus(v:{x:number, y:number, z:number}):Vector3d
		{
			return new Vector3d(this.x + v.x, this.y + v.y, this.z + v.z);
		}



		public subtract(v:{x:number, y:number, z:number}):void
		{
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
		}



		public minus(v:{x:number, y:number, z:number}):Vector3d
		{
			return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z);
		}



		public scale(f:number):void
		{
			this.x *= f;
			this.y *= f;
			this.z *= f;
		}



		public scaled(f:number):Vector3d
		{
			return new Vector3d(this.x * f, this.y * f, this.z * f);
		}



		public normalize():void
		{
			var l = this.length();
			if (l != 0)
			{
				this.x /= l;
				this.y /= l;
				this.z /= l;
			}
		}



		public normalized():Vector3d
		{
			var l = this.length();
			if (l != 0)
				return new Vector3d(this.x / l, this.y / l, this.z / l);
			else
				return new Vector3d(0, 0, 0);
		}



		public length():number
		{
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		}



		public squaredLength():number
		{
			return this.x * this.x + this.y * this.y + this.z * this.z;
		}



		public manhattanLength():number
		{
			return Math.max(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
		}



		public isZero():boolean
		{
			return !(this.x || this.y || this.z);
		}



		public dot(v:{x:number, y:number, z:number}):number
		{
			return this.x * v.x + this.y * v.y + this.z * v.z;
		}



		public cross(v:{x:number, y:number, z:number}):Vector3d
		{
			var result = new Vector3d();
			result.x = this.y * v.z - this.z * v.y;
			result.y = this.z * v.x - this.x * v.z;
			result.z = this.x * v.y - this.y * v.x;
			return result;
		}



		public interpolated(f:number, other:{x:number, y:number, z:number}):Vector3d
		{
			var x = (other.x - this.x) * f + this.x;
			var y = (other.y - this.y) * f + this.y;
			var z = (other.z - this.z) * f + this.z;
			return new Vector3d(x, y, z);
		}



		public fromRaw(raw:{x?:number, y?:number, z?:number}):Vector3d
		{
			return new Vector3d(raw.x || 0, raw.y || 0, raw.z || 0);
		}
	}
}

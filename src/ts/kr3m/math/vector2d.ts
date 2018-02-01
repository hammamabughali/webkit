/// <reference path="../math/accumulable.ts"/>
/// <reference path="../math/interpolatable.ts"/>
/// <reference path="../math/mathex.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.math
{
	/*
		Allgemeine Vektorklasse für den 2d-Raum.

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
	export class Vector2d implements Interpolatable<Vector2d>, Accumulable<Vector2d>
	{
		constructor(public x = 0, public y = 0)
		{
		}



		public isZero():boolean
		{
			return !(this.x || this.y);
		}



		public clone():Vector2d
		{
			return new Vector2d(this.x, this.y);
		}



		public add(v:{x:number, y:number}):void
		{
			this.x += v.x;
			this.y += v.y;
		}



		public accumulate(v:{x:number, y:number}):void
		{
			this.add(v);
		}



		public plus(v:{x:number, y:number}):Vector2d
		{
			return new Vector2d(this.x + v.x, this.y + v.y);
		}



		public subtract(v:{x:number, y:number}):void
		{
			this.x -= v.x;
			this.y -= v.y;
		}



		public minus(v:{x:number, y:number}):Vector2d
		{
			return new Vector2d(this.x - v.x, this.y - v.y);
		}



		public scale(f:number):void
		{
			this.x *= f;
			this.y *= f;
		}



		public scaled(f:number):Vector2d
		{
			return new Vector2d(this.x * f, this.y * f);
		}



		public normalize():void
		{
			var l = this.length();
			if (l != 0)
			{
				this.x /= l;
				this.y /= l;
			}
		}



		public normalized():Vector2d
		{
			var l = this.length();
			if (l != 0)
				return new Vector2d(this.x / l, this.y / l);
			else
				return new Vector2d(0, 0);
		}



		public rotationAngle():number
		{
			return Math.atan2(this.y, this.x) * RAD_2_DEG;
		}



		public rotate(angle:number):void
		{
			angle *= DEG_2_RAD;
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			var x = c * this.x - s * this.y;
			this.y = s * this.x + c * this.y;
			this.x = x;
		}



		public rotated(angle:number):Vector2d
		{
			angle *= DEG_2_RAD;
			var s = Math.sin(angle);
			var c = Math.cos(angle);
			var x = c * this.x - s * this.y;
			var y = s * this.x + c * this.y;
			return new Vector2d(x, y);
		}



		public ortho(cw:boolean = true):Vector2d
		{
			return cw ? new Vector2d(-this.y, this.x) : new Vector2d(this.y, -this.x);
		}



		public length():number
		{
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}



		public squaredLength():number
		{
			return this.x * this.x + this.y * this.y;
		}



		public manhattanLength():number
		{
			return Math.abs(this.x) + Math.abs(this.y);
		}



		public diagonalLength():number
		{
			return Math.max(Math.abs(this.x), Math.abs(this.y));
		}



		public dot(v:Vector2d):number
		{
			return this.x * v.x + this.y * v.y;
		}



		public interpolated(f:number, other:{x:number, y:number}):Vector2d
		{
			var x = (other.x - this.x) * f + this.x;
			var y = (other.y - this.y) * f + this.y;
			return new Vector2d(x, y);
		}



		public fromRaw(raw:{x?:number, y?:number}):Vector2d
		{
			return new Vector2d(raw.x || 0, raw.y || 0);
		}



		public toArray():[number, number]
		{
			return [this.x, this.y];
		}



		public equals(v:{x:number, y:number}):boolean
		{
			return Math.abs(this.x - v.x) < kr3m.math.EPSILON && Math.abs(this.y - v.y) < kr3m.math.EPSILON;
		}



		public toString():string
		{
			return this.x + ";" + this.y;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var V = kr3m.math.Vector2d;
	new kr3m.unittests.Suite("kr3m.math.Vector2d")
	.add(new kr3m.unittests.CaseSync("constructor I", () => new V().toArray(), [0, 0]))
	.add(new kr3m.unittests.CaseSync("constructor II", () => new V(5, 3).toArray(), [5, 3]))
	.add(new kr3m.unittests.CaseSync("isZero I", () => new V().isZero(), true))
	.add(new kr3m.unittests.CaseSync("isZero II", () => new V(5, 3).isZero(), false))
	.add(new kr3m.unittests.CaseSync("isZero III", () => new V(5, 0).isZero(), false))
	.add(new kr3m.unittests.CaseSync("isZero IV", () => new V(0, 3).isZero(), false))
	.add(new kr3m.unittests.CaseSync("normalized I", () => new V(1, 0).normalized().toArray(), [1, 0]))
	.add(new kr3m.unittests.CaseSync("normalized II", () => new V(0, 1).normalized().toArray(), [0, 1]))
	.add(new kr3m.unittests.CaseSync("normalized III", () => new V(0, -6).normalized().toArray(), [0, -1]))
	.add(new kr3m.unittests.CaseSync("normalized IV", () => new V(46, 0).normalized().toArray(), [1, 0]))
	.add(new kr3m.unittests.CaseSync("normalized V", () => new V(1, 1).normalized().toArray(), [0.7071067811865475, 0.7071067811865475]))
	.add(new kr3m.unittests.CaseSync("normalized VI", () => new V(1, -1).normalized().toArray(), [0.7071067811865475, -0.7071067811865475]))
	.add(new kr3m.unittests.CaseSync("normalized VII", () => new V(-1, -1).normalized().toArray(), [-0.7071067811865475, -0.7071067811865475]))
	.add(new kr3m.unittests.CaseSync("normalized VIII", () => new V(-1, 1).normalized().toArray(), [-0.7071067811865475, 0.7071067811865475]))
	.add(new kr3m.unittests.CaseSync("rotated I", () => new V(1, 0).rotated(0), {x:1, y:0}))
	.add(new kr3m.unittests.CaseSync("rotated II", () => new V(1, 0).rotated(45), {x:0.7071067811865, y:0.7071067811865}))
	.add(new kr3m.unittests.CaseSync("rotated III", () => new V(1, 0).rotated(90), {x:0, y:1}))
	.add(new kr3m.unittests.CaseSync("rotated IV", () => new V(1, 0).rotated(135), {x:-0.7071067811865, y:0.7071067811865}))
	.add(new kr3m.unittests.CaseSync("rotated IV", () => new V(1, 0).rotated(180), {x:-1, y:0}))
	.add(new kr3m.unittests.CaseSync("rotated V", () => new V(1, 0).rotated(225), {x:-0.7071067811865, y:-0.7071067811865}))
	.add(new kr3m.unittests.CaseSync("rotated VI", () => new V(1, 0).rotated(270), {x:0, y:-1}))
	.add(new kr3m.unittests.CaseSync("rotated VII", () => new V(1, 0).rotated(315), {x:0.7071067811865, y:-0.7071067811865}))
	.add(new kr3m.unittests.CaseSync("rotated VIII", () => new V(1, 0).rotated(360), {x:1, y:0}))
	.add(new kr3m.unittests.CaseSync("length I", () => new V(0, 0).length(), 0))
	.add(new kr3m.unittests.CaseSync("length II", () => new V(5, 0).length(), 5))
	.add(new kr3m.unittests.CaseSync("length III", () => new V(0, -3).length(), 3))
	.add(new kr3m.unittests.CaseSync("length IV", () => new V(3, 4).length(), 5))
	.add(new kr3m.unittests.CaseSync("squaredLength I", () => new V(0, 0).squaredLength(), 0))
	.add(new kr3m.unittests.CaseSync("squaredLength II", () => new V(5, 0).squaredLength(), 25))
	.add(new kr3m.unittests.CaseSync("squaredLength III", () => new V(0, -3).squaredLength(), 9))
	.add(new kr3m.unittests.CaseSync("squaredLength IV", () => new V(3, 4).squaredLength(), 25))
	.add(new kr3m.unittests.CaseSync("manhattanLength I", () => new V(0, 0).manhattanLength(), 0))
	.add(new kr3m.unittests.CaseSync("manhattanLength II", () => new V(5, 0).manhattanLength(), 5))
	.add(new kr3m.unittests.CaseSync("manhattanLength III", () => new V(0, -3).manhattanLength(), 3))
	.add(new kr3m.unittests.CaseSync("manhattanLength IV", () => new V(3, 4).manhattanLength(), 7))
	.add(new kr3m.unittests.CaseSync("diagonalLength I", () => new V(0, 0).diagonalLength(), 0))
	.add(new kr3m.unittests.CaseSync("diagonalLength II", () => new V(5, 0).diagonalLength(), 5))
	.add(new kr3m.unittests.CaseSync("diagonalLength III", () => new V(0, -3).diagonalLength(), 3))
	.add(new kr3m.unittests.CaseSync("diagonalLength IV", () => new V(3, 4).diagonalLength(), 4))
	.run();
}, 1);
//# /UNITTESTS

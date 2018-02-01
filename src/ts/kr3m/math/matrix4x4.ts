/// <reference path="../math/mathex.ts"/>
/// <reference path="../math/matrix.ts"/>
/// <reference path="../math/vector3d.ts"/>



module kr3m.math
{
	export class Matrix4x4 extends Matrix
	{
		constructor()
		{
			super(4, 4);
		}



		public clone():Matrix4x4
		{
			var r = new Matrix4x4();
			r.v = this.v.slice();
			return r;
		}



		public apply3d(v:Vector3d):Vector3d
		{
			var r = new Vector3d();
			r.x = this.v[0] * v.x + this.v[4] * v.y + this.v[ 8] * v.z + this.v[12];
			r.y = this.v[1] * v.x + this.v[5] * v.y + this.v[ 9] * v.z + this.v[13];
			r.z = this.v[2] * v.x + this.v[6] * v.y + this.v[10] * v.z + this.v[14];
			return r;
		}



		/*
			Schnellere Version von concat, die davon ausgeht, dass es sich
			um 4x4 Matrizen handelt.
		*/
		public concated4x4(m:Matrix4x4):Matrix4x4
		{
			var r = new Matrix4x4();
			r.v[ 0] = this.v[ 0] * m.v[ 0] + this.v[ 4] * m.v[ 1] + this.v[ 8] * m.v[ 2] + this.v[12] * m.v[ 3];
			r.v[ 1] = this.v[ 1] * m.v[ 0] + this.v[ 5] * m.v[ 1] + this.v[ 9] * m.v[ 2] + this.v[13] * m.v[ 3];
			r.v[ 2] = this.v[ 2] * m.v[ 0] + this.v[ 6] * m.v[ 1] + this.v[10] * m.v[ 2] + this.v[14] * m.v[ 3];
			r.v[ 3] = this.v[ 3] * m.v[ 0] + this.v[ 7] * m.v[ 1] + this.v[11] * m.v[ 2] + this.v[15] * m.v[ 3];
			r.v[ 4] = this.v[ 0] * m.v[ 4] + this.v[ 4] * m.v[ 5] + this.v[ 8] * m.v[ 6] + this.v[12] * m.v[ 7];
			r.v[ 5] = this.v[ 1] * m.v[ 4] + this.v[ 5] * m.v[ 5] + this.v[ 9] * m.v[ 6] + this.v[13] * m.v[ 7];
			r.v[ 6] = this.v[ 2] * m.v[ 4] + this.v[ 6] * m.v[ 5] + this.v[10] * m.v[ 6] + this.v[14] * m.v[ 7];
			r.v[ 7] = this.v[ 3] * m.v[ 4] + this.v[ 7] * m.v[ 5] + this.v[11] * m.v[ 6] + this.v[15] * m.v[ 7];
			r.v[ 8] = this.v[ 0] * m.v[ 8] + this.v[ 4] * m.v[ 9] + this.v[ 8] * m.v[10] + this.v[12] * m.v[11];
			r.v[ 9] = this.v[ 1] * m.v[ 8] + this.v[ 5] * m.v[ 9] + this.v[ 9] * m.v[10] + this.v[13] * m.v[11];
			r.v[10] = this.v[ 2] * m.v[ 8] + this.v[ 6] * m.v[ 9] + this.v[10] * m.v[10] + this.v[14] * m.v[11];
			r.v[11] = this.v[ 3] * m.v[ 8] + this.v[ 7] * m.v[ 9] + this.v[11] * m.v[10] + this.v[15] * m.v[11];
			r.v[12] = this.v[ 0] * m.v[12] + this.v[ 4] * m.v[13] + this.v[ 8] * m.v[14] + this.v[12] * m.v[15];
			r.v[13] = this.v[ 1] * m.v[12] + this.v[ 5] * m.v[13] + this.v[ 9] * m.v[14] + this.v[13] * m.v[15];
			r.v[14] = this.v[ 2] * m.v[12] + this.v[ 6] * m.v[13] + this.v[10] * m.v[14] + this.v[14] * m.v[15];
			r.v[15] = this.v[ 3] * m.v[12] + this.v[ 7] * m.v[13] + this.v[11] * m.v[14] + this.v[15] * m.v[15];
			return r;
		}



		/*
			Schnellere Version von concated, die davon ausgeht, dass es sich
			um 4x4 Matrizen handelt.
		*/
		public concat4x4(m:Matrix4x4):void
		{
			var r = this.concated4x4(m);
			this.v = r.v;
		}



		/*
			Schnellere Version von concat, die davon ausgeht, dass es sich
			um homogene Matrizen handelt.
		*/
		public concatedFast(m:Matrix4x4):Matrix4x4
		{
			var r = new Matrix4x4();
			r.v[ 0] = this.v[ 0] * m.v[ 0] + this.v[ 4] * m.v[ 1] + this.v[ 8] * m.v[ 2];
			r.v[ 1] = this.v[ 1] * m.v[ 0] + this.v[ 5] * m.v[ 1] + this.v[ 9] * m.v[ 2];
			r.v[ 2] = this.v[ 2] * m.v[ 0] + this.v[ 6] * m.v[ 1] + this.v[10] * m.v[ 2];
			r.v[ 3] = 0;
			r.v[ 4] = this.v[ 0] * m.v[ 4] + this.v[ 4] * m.v[ 5] + this.v[ 8] * m.v[ 6];
			r.v[ 5] = this.v[ 1] * m.v[ 4] + this.v[ 5] * m.v[ 5] + this.v[ 9] * m.v[ 6];
			r.v[ 6] = this.v[ 2] * m.v[ 4] + this.v[ 6] * m.v[ 5] + this.v[10] * m.v[ 6];
			r.v[ 7] = 0;
			r.v[ 8] = this.v[ 0] * m.v[ 8] + this.v[ 4] * m.v[ 9] + this.v[ 8] * m.v[10];
			r.v[ 9] = this.v[ 1] * m.v[ 8] + this.v[ 5] * m.v[ 9] + this.v[ 9] * m.v[10];
			r.v[10] = this.v[ 2] * m.v[ 8] + this.v[ 6] * m.v[ 9] + this.v[10] * m.v[10];
			r.v[11] = 0;
			r.v[12] = this.v[ 0] * m.v[12] + this.v[ 4] * m.v[13] + this.v[ 8] * m.v[14] + this.v[12] * m.v[15];
			r.v[13] = this.v[ 1] * m.v[12] + this.v[ 5] * m.v[13] + this.v[ 9] * m.v[14] + this.v[13] * m.v[15];
			r.v[14] = this.v[ 2] * m.v[12] + this.v[ 6] * m.v[13] + this.v[10] * m.v[14] + this.v[14] * m.v[15];
			r.v[15] = this.v[15] * m.v[15];
			return r;
		}



		/*
			Schnellere Version von concated, die davon ausgeht, dass es sich
			um homogene Matrizen handelt.
		*/
		public concatFast(m:Matrix4x4):void
		{
			var r = this.concatedFast(m);
			this.v = r.v;
		}



		public translate(x:number, y:number, z:number):void
		{
			var v = this.v.slice();
			this.v[12] = v[0] * x + v[4] * y + v[ 8] * z + v[12];
			this.v[13] = v[1] * x + v[5] * y + v[ 9] * z + v[13];
			this.v[14] = v[2] * x + v[6] * y + v[10] * z + v[14];
			this.v[15] = v[3] * x + v[7] * y + v[11] * z + v[15];
		}



		public setTranslation(x:number, y:number, z:number):void;
		public setTranslation(v:Vector3d):void;

		public setTranslation():void
		{
			if (arguments.length == 3)
			{
				var x = <number> arguments[0];
				var y = <number> arguments[1];
				var z = <number> arguments[2];
			}
			else
			{
				var v = <Vector3d> arguments[0];
				var x = v.x;
				var y = v.y;
				var z = v.z;
			}

			this.v[ 0] = 1; this.v[ 4] = 0; this.v[ 8] = 0; this.v[12] = x;
			this.v[ 1] = 0; this.v[ 5] = 1; this.v[ 9] = 0; this.v[13] = y;
			this.v[ 2] = 0; this.v[ 6] = 0; this.v[10] = 1; this.v[14] = z;
			this.v[ 3] = 0; this.v[ 7] = 0; this.v[11] = 0; this.v[15] = 1;
		}



		public setScale(x:number, y:number, z:number):void;
		public setScale(v:Vector3d):void;

		public setScale():void
		{
			if (arguments.length == 3)
			{
				var x = <number> arguments[0];
				var y = <number> arguments[1];
				var z = <number> arguments[2];
			}
			else
			{
				var v = <Vector3d> arguments[0];
				var x = v.x;
				var y = v.y;
				var z = v.z;
			}

			this.v[ 0] = x; this.v[ 4] = 0; this.v[ 8] = 0; this.v[12] = 0;
			this.v[ 1] = 0; this.v[ 5] = y; this.v[ 9] = 0; this.v[13] = 0;
			this.v[ 2] = 0; this.v[ 6] = 0; this.v[10] = z; this.v[14] = 0;
			this.v[ 3] = 0; this.v[ 7] = 0; this.v[11] = 0; this.v[15] = 1;
		}



		public setViewport(w:number, h:number):void
		{
			this.v[0] = this.v[4] = this.v[8] = this.v[12] = 0;
			this.v[1] = this.v[5] = this.v[9] = this.v[13] = 0;
			this.v[2] = this.v[6] = this.v[10] = this.v[14] = 0;
			this.v[3] = this.v[7] = this.v[11] = this.v[15] = 0;

			this.v[0] = 2 / w;
			this.v[5] = 2 / -h;
			this.v[10] = 1;
			this.v[12] = -1;
			this.v[13] = 1;
			this.v[15] = 1;
		}



		/*
			Generiert eine perspektivische Matrix mit den gegebenen
			Eigenschaften.
		*/
		public setPerspective(
			fov:number,
			aspect:number,
			clipNear:number,
			clipFar:number):void
		{
			var f = (1 / Math.tan(fov / 2 * DEG_2_RAD));

			this.v[0] = this.v[4] = this.v[8] = this.v[12] = 0;
			this.v[1] = this.v[5] = this.v[9] = this.v[13] = 0;
			this.v[2] = this.v[6] = this.v[10] = this.v[14] = 0;
			this.v[3] = this.v[7] = this.v[11] = this.v[15] = 0;

			this.v[0] = f / aspect;
			this.v[5] = f;
			this.v[10] = (clipFar + clipNear) / (clipNear - clipFar);
			this.v[11] = -1;
			this.v[14] = (2 * clipFar * clipNear) / (clipNear - clipFar);
		}



		/*
			Invertiert die Matrix unter der Annahme, dass nur Rotationen
			und Translationen verwendet wurden um sie zu generieren.
		*/
		public invertFast():void
		{
			var temp:number;
			temp = this.v[1]; this.v[1] = this.v[4]; this.v[4] = temp;
			temp = this.v[2]; this.v[2] = this.v[8]; this.v[8] = temp;
			temp = this.v[6]; this.v[6] = this.v[9]; this.v[9] = temp;
			var x = -this.v[0] * this.v[12] - this.v[4] * this.v[13] - this.v[ 8] * this.v[14];
			var y = -this.v[1] * this.v[12] - this.v[5] * this.v[13] - this.v[ 9] * this.v[14];
			var z = -this.v[2] * this.v[12] - this.v[6] * this.v[13] - this.v[10] * this.v[14];
			this.v[12] = x;
			this.v[13] = y;
			this.v[14] = z;
		}



		public rotateZ(angle:number):void
		{
			angle *= DEG_2_RAD;
			var s = Math.sin(angle);
			var n = -s;
			var c = Math.cos(angle);
			var v:number[] = this.v.slice();
			this.v[0] = v[0] * c + v[4] * s;
			this.v[1] = v[1] * c + v[5] * s;
			this.v[2] = v[2] * c + v[6] * s;
			this.v[3] = v[3] * c + v[7] * s;
			this.v[4] = v[0] * n + v[4] * c;
			this.v[5] = v[1] * n + v[5] * c;
			this.v[6] = v[2] * n + v[6] * c;
			this.v[7] = v[3] * n + v[7] * c;
		}



		/*
			Gibt eine Matrix zurück, die nur die Drehungen aus dieser
			Matrix enthält. Diese Funktion ist eine schnelle Variante
			von getRotationOnly, die aber nur funktioniert, so lange
			ausschließlich Verschiebungen und Drehungen verwendet
			wurden um diese Matrix zu generieren. Falls auch
			Skalierungen oder andere "komplexere" Transformationen
			verwendet wurden, ist die Ergebnismatrix nicht korrekt.
		*/
		public getRotationOnlyFast():Matrix4x4
		{
			//# TODO: man könnte in der Matrixklasse speichern, ob die oben genannten Operationen verwendet wurden oder nicht und entsprechend zwischen einer schnellen oder einer langsamen aber immer korrekten Methode umschalten
			var m = new Matrix4x4();
			m.v[0] = this.v[0]; m.v[1] = this.v[1]; m.v[2] = this.v[2];
			m.v[4] = this.v[4]; m.v[5] = this.v[5]; m.v[6] = this.v[6];
			m.v[8] = this.v[8]; m.v[9] = this.v[9]; m.v[10] = this.v[10];
			m.v[15] = this.v[15];
			return m;
		}



		/*
			Vertauscht zwei Zeilen in der Matrix
		*/
		public swapRows(r1:number, r2:number)
		{
			var temp:number;
			temp = this.v[r1]; this.v[r1] = this.v[r2]; this.v[r2] = temp;
			temp = this.v[r1 + 4]; this.v[r1 + 4] = this.v[r2 + 4]; this.v[r2 + 4] = temp;
			temp = this.v[r1 + 8]; this.v[r1 + 8] = this.v[r2 + 8]; this.v[r2 + 8] = temp;
			temp = this.v[r1 + 12]; this.v[r1 + 12] = this.v[r2 + 12]; this.v[r2 + 12] = temp;
		}



		/*
			Multipliziert alle Werte in einer gegebenen Zeile mit dem
			gegebenen Wert
		*/
		public scaleRow(row:number, factor:number)
		{
			this.v[row] *= factor;
			this.v[row + 4] *= factor;
			this.v[row + 8] *= factor;
			this.v[row + 12] *= factor;
		}



		/*
			Multipliziert eine Zeile und fügt sie anschließend einer
			anderen Zeile hinzu
		*/
		public addScaledRow(r1:number, factor:number, r2:number)
		{
			this.v[r2] += factor * this.v[r1];
			this.v[r2 + 4] += factor * this.v[r1 + 4];
			this.v[r2 + 8] += factor * this.v[r1 + 8];
			this.v[r2 + 12] += factor * this.v[r1 + 12];
		}



		/*
			Invertiert die Matrix, egal wie sie aufgebaut ist (sie muss
			natürlich noch invertierbar sein). Ist sehr viel langsamer
			als invertFast, kann aber in viel mehr Fällen benutzt werden.
		*/
		public invert():void
		{
			var m = new Matrix4x4();
			m.setIdentity();

			for (var i = 0; i < 4; ++i)
			{
				var j = 0;
				while (j + i < 4 && this.v[i * 4 + i + j] == 0)
					++j;

				if (i + j >= 4)
					throw "invalid matrix";

				if (j > 0)
				{
					this.swapRows(i, i + j);
					m.swapRows(i, i + j);
				}

				var f = this.v[i * 4 + i];
				if (f != 1)
				{
					f = 1 / f;
					this.scaleRow(i, f);
					m.scaleRow(i, f);
				}

				for (j = 0; j < 4; ++j)
				{
					if (i != j)
					{
						f = -this.v[i * 4 + j];
						if (f != 0)
						{
							this.addScaledRow(i, f, j);
							m.addScaledRow(i, f, j);
						}
					}
				}
			}

			for (var i = 0; i < 16; ++i)
				this.v[i] = m.v[i];
		}



		public inverted():Matrix4x4
		{
			var r = this.clone();
			r.invert();
			return r;
		}
	}
}

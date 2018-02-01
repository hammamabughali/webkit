/// <reference path="../math/accumulable.ts"/>
/// <reference path="../math/interpolatable.ts"/>
/// <reference path="../math/mathex.ts"/>
/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../math/vector3d.ts"/>



module kr3m.math
{
	export class Quaternion implements Interpolatable<Quaternion>, Accumulable<Quaternion>
	{
		public w:number;
		public x:number;
		public y:number;
		public z:number;



		constructor(w:number = 0, x:number = 0, y:number = 0, z:number = 0)
		{
			this.w = w;
			this.x = x;
			this.y = y;
			this.z = z;
		}



		public setUnit(x:number, y:number, z:number):void
		{
			this.x = x;
			this.y = y;
			this.z = z;

			var w = 1 - (x * x) - (y * y) - (z * z);
			this.w = (w < 0) ? 0 : -Math.sqrt(w);
		}



		public clone():Quaternion
		{
			return new Quaternion(this.w, this.x, this.y, this.z);
		}



		public normalize():void
		{
			var s = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
			if (s < 0.1)
				return;

			var inv = 1 / Math.sqrt(s);
			this.x *= inv;
			this.y *= inv;
			this.z *= inv;
			this.w *= inv;
		}



		public accumulate(v:Quaternion):void
		{
			var w = this.w;
			var x = this.x;
			var y = this.y;
			var z = this.z;
			this.w = v.w * w - v.x * x - v.y * y - v.z * z;
			this.x = v.w * x + v.x * w + v.z * y - v.y * z;
			this.y = v.w * y + v.y * w + v.x * z - v.z * x;
			this.z = v.w * z + v.z * w + v.y * x - v.x * y;
		}



		public plus(other:Quaternion):Quaternion
		{
			var q = new Quaternion(this.w, this.x, this.y, this.z);
			q.accumulate(other);
			return q;
		}



		public addRotation(x:number, y:number, z:number, a:number):void
		{
			var q = new Quaternion();
			q.setRotation(x, y, z, a);
			this.accumulate(q);
		}



		public prependRotation(x:number, y:number, z:number, a:number):void
		{
			var q = new Quaternion();
			q.setRotation(x, y, z, a);
			q.accumulate(this);
			this.w = q.w;
			this.x = q.x;
			this.y = q.y;
			this.z = q.z;
		}



		public setRotation(x:number, y:number, z:number, a:number):void
		{
			var l = Math.sqrt(x * x + y * y + z * z);
			var a = a * Math.PI / 360;
			this.w = Math.cos(a);
			var f = Math.sin(a) / l;
			this.x = f * x;
			this.y = f * y;
			this.z = f * z;
		}



		/*
			Interpoliert entlang einer Strecke und normalisiert.
			Ist schnell aber nicht 100% richtig.
		*/
		public nlerped(f:number, other:Quaternion):Quaternion
		{
			var q = new Quaternion();
			var dot = this.dot(other);
			var fInv = 1 - f;
			if (dot < 0)
			{
				q.w = fInv * this.w - f * other.w;
				q.x = fInv * this.x - f * other.x;
				q.y = fInv * this.y - f * other.y;
				q.z = fInv * this.z - f * other.z;
			}
			else
			{
				q.w = fInv * this.w + f * other.w;
				q.x = fInv * this.x + f * other.x;
				q.y = fInv * this.y + f * other.y;
				q.z = fInv * this.z + f * other.z;
			}
			q.normalize();
			return q;
		}



		public dot(q:Quaternion):number
		{
			return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
		}



		public invert():void
		{
			this.x = -this.x;
			this.y = -this.y;
			this.z = -this.z;
		}



		public inverted():Quaternion
		{
			var q = this.clone();
			q.invert();
			return q;
		}



		public applied(v:Vector3d):Vector3d
		{
			var q = this.plus(new Quaternion(0, v.x, v.y, v.z)).plus(this.inverted());
			return new Vector3d(q.x, q.y, q.z);
		}



		/*
			Interpoliert entlang der Oberfläche eines Einheitskreises.
			Ist 100% richtig aber langsam.
		*/
		public slerped(f:number, other:Quaternion):Quaternion
		{
			var cosom = this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
			var to1 = [0, 0, 0, 0];
			if (cosom < 0)
			{
				cosom = -cosom;
				to1[0] = -other.x;
				to1[1] = -other.y;
				to1[2] = -other.z;
				to1[3] = -other.w;
			}
			else
			{
				to1[0] = other.x;
				to1[1] = other.y;
				to1[2] = other.z;
				to1[3] = other.w;
			}

			if (1 - cosom > 0.01)
			{
				var omega = Math.acos(cosom);
				var sinom = Math.sin(omega);
				var scale0 = Math.sin((1 - f) * omega) / sinom;
				var scale1 = Math.sin(f * omega) / sinom;
			}
			else
			{
				var scale0 = 1 - f;
				var scale1 = f;
			}

			var q = new Quaternion();
			q.x = scale0 * this.x + scale1 * to1[0];
			q.y = scale0 * this.y + scale1 * to1[1];
			q.z = scale0 * this.z + scale1 * to1[2];
			q.w = scale0 * this.w + scale1 * to1[3];
			return q;
		}



		public interpolated(f:number, other:Quaternion):Quaternion
		{
			return this.nlerped(f, other);
		}



		public fromRaw(raw:any):Quaternion
		{
			if (raw.a !== undefined)
			{
				if (!raw.x && !raw.y && !raw.z)
					raw.y = 1;

				var q = new Quaternion();
				q.setRotation(raw.x || 0, raw.y || 0, raw.z || 0, raw.a);
				return q;
			}

			return new Quaternion(raw.w || 0, raw.x || 0, raw.y || 0, raw.z || 0);
		}



		public getRotationMatrix():Matrix4x4
		{
			var m = new Matrix4x4();

			var x2 = this.x + this.x;
			var y2 = this.y + this.y;
			var z2 = this.z + this.z;
			var xx = this.x * x2;
			var xy = this.x * y2;
			var xz = this.x * z2;
			var yy = this.y * y2;
			var yz = this.y * z2;
			var zz = this.z * z2;
			var wx = this.w * x2;
			var wy = this.w * y2;
			var wz = this.w * z2;

			m.v[ 0] = 1 - (yy + zz);
			m.v[ 1] = xy - wz;
			m.v[ 2] = xz + wy;
			m.v[ 3] = 0;

			m.v[ 4] = xy + wz;
			m.v[ 5] = 1 - (xx + zz);
			m.v[ 6] = yz - wx;
			m.v[ 7] = 0;

			m.v[ 8] = xz - wy;
			m.v[ 9] = yz + wx;
			m.v[10] = 1 - (xx + yy);
			m.v[11] = 0;

			m.v[12] = 0;
			m.v[13] = 0;
			m.v[14] = 0;
			m.v[15] = 1;

			return m;
		}
	}
}

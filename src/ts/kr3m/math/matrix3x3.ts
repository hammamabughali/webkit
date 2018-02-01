/// <reference path="../math/matrix.ts"/>



module kr3m.math
{
	export class Matrix3x3 extends Matrix
	{
		constructor()
		{
			super(3, 3);
		}



		public setIdentity():void
		{
			this.v[0] = this.v[4] = this.v[8] = 1;
			this.v[1] = this.v[2] = this.v[3] = 0;
			this.v[5] = this.v[6] = this.v[7] = 0;
		}



		public setScale(x:number, y:number, z:number):void
		{
			this.v[0] = x;
			this.v[4] = y;
			this.v[8] = z;
			this.v[1] = this.v[2] = this.v[3] = 0;
			this.v[5] = this.v[6] = this.v[7] = 0;
		}
	}
}

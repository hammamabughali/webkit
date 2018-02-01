/// <reference path="../math/matrix.ts"/>



module kr3m.math
{
	export class Matrix2x2 extends Matrix
	{
		constructor()
		{
			super(2, 2);
		}



		public setIdentity():void
		{
			this.v[0] = this.v[3] = 1;
			this.v[1] = this.v[2] = 0;
		}



		public setRotation(angle:number):void
		{
			this.v[0] = Math.cos(angle);
			this.v[2] = Math.sin(angle);
			this.v[1] = -this.v[2];
			this.v[3] = this.v[0];
		}



		public setScale(x:number, y:number):void
		{
			this.v[0] = x;
			this.v[1] = this.v[2] = 0;
			this.v[3] = y;
		}
	}
}

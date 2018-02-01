/// <reference path="../../pogo/cameras/free.ts"/>



module pogo.cameras
{
	export interface KeyboardControlledOptions extends FreeOptions
	{
	}



	export class KeyboardControlled extends pogo.cameras.Free
	{
		protected options:KeyboardControlledOptions;

		public keys =
		{
			MOVE_FORWARD : [87],
			MOVE_BACKWARDS : [83],
			MOVE_LEFT : [65],
			MOVE_RIGHT : [68],
			ROTATE_LEFT : [81],
			ROTATE_RIGHT : [69],
			MOVE_UP : [82],
			MOVE_DOWN : [70],
			LOOK_UP : [84],
			LOOK_DOWN: [71],
			ROLL_CW : [89],
			ROLL_CCW : [88]
		};

		public moveSpeed = 2;
		public rotateSpeed = 90;



		constructor(
			canvas:pogo.Canvas,
			options?:KeyboardControlledOptions)
		{
			super(canvas, options);
		}



		protected isDown(keyCodes:number[]):boolean
		{
			for (var i = 0; i < keyCodes.length; ++i)
			{
				if (this.canvas.keyboard.isDown(keyCodes[i]))
					return true;
			}
			return false;
		}



		protected updatePosition(data:TickData):void
		{
			var move = new kr3m.math.Vector3d(0, 0, 0);

			if (this.isDown(this.keys.MOVE_FORWARD))
				--move.z;

			if (this.isDown(this.keys.MOVE_BACKWARDS))
				++move.z;

			if (this.isDown(this.keys.MOVE_LEFT))
				--move.x;

			if (this.isDown(this.keys.MOVE_RIGHT))
				++move.x;

			if (this.isDown(this.keys.MOVE_UP))
				++move.y;

			if (this.isDown(this.keys.MOVE_DOWN))
				--move.y;

			if (move.isZero())
				return;

			move.normalize();
			move.scale(this.moveSpeed * data.deltaScaled);

			var matrix = this.getViewMatrix();
			matrix.invertFast();
			var v = matrix.v;

			var xAxis = new kr3m.math.Vector3d(v[0], v[1], v[2]);
			var yAxis = new kr3m.math.Vector3d(v[4], v[5], v[6]);
			var zAxis = new kr3m.math.Vector3d(v[8], v[9], v[10]);

			this.pos = this.pos
				.plus(xAxis.scaled(move.x))
				.plus(yAxis.scaled(move.y))
				.plus(zAxis.scaled(move.z));
		}



		protected updateRotation(data:TickData):void
		{
			var rotate = new kr3m.math.Vector3d(0, 0, 0);

			if (this.isDown(this.keys.ROTATE_LEFT))
				--rotate.y;

			if (this.isDown(this.keys.ROTATE_RIGHT))
				++rotate.y;

			if (this.isDown(this.keys.LOOK_UP))
				--rotate.x;

			if (this.isDown(this.keys.LOOK_DOWN))
				++rotate.x;

			if (this.isDown(this.keys.ROLL_CW))
				++rotate.z;

			if (this.isDown(this.keys.ROLL_CCW))
				--rotate.z;

			if (rotate.isZero())
				return;

			rotate.normalize();
			var angle = data.deltaScaled * this.rotateSpeed;
			this.r.prependRotation(rotate.x, rotate.y, rotate.z, angle);
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public update(data:TickData):void
		{
			super.update(data);
			this.updatePosition(data);
			this.updateRotation(data);
		}
	}
}

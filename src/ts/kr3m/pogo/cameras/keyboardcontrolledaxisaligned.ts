/// <reference path="../../pogo/cameras/free.ts"/>



module pogo.cameras
{
	export interface KeyboardControlledAxisAlignedOptions extends pogo.CameraOptions
	{
	}



	export class KeyboardControlledAxisAligned extends pogo.cameras.Free
	{
		protected options:KeyboardControlledAxisAlignedOptions;

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
			LOOK_DOWN: [71]
		};

		public moveSpeed = 2;
		public rotateSpeed = 90;
		public minAngleX = -60;
		public maxAngleX = 60;

		//# TODO: angleX und angleY sollten aus dem Rotationsquaternion berechnet werden damit es keine Probleme mit Tweens gibt
		//# TODO: alternativ (aber nicht ganz so elegant): getter und setter für angleX und angleY definieren
		protected angleX = 0;
		protected angleY = 0;



		constructor(
			canvas:pogo.Canvas,
			options?:KeyboardControlledAxisAlignedOptions)
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

			var xAxis = new kr3m.math.Vector3d(v[0], 0, v[2]);
			xAxis.normalize();
			var yAxis = new kr3m.math.Vector3d(0, 1, 0);
			var zAxis = new kr3m.math.Vector3d(v[8], 0, v[10]);
			zAxis.normalize();

			this.pos = this.pos
				.plus(xAxis.scaled(move.x))
				.plus(yAxis.scaled(move.y))
				.plus(zAxis.scaled(move.z));
		}



		protected updateRotation(data:TickData):void
		{
			var deltaX = 0;
			var deltaY = 0;

			if (this.isDown(this.keys.ROTATE_LEFT))
				deltaY -= data.deltaScaled * this.rotateSpeed;

			if (this.isDown(this.keys.ROTATE_RIGHT))
				deltaY += data.deltaScaled * this.rotateSpeed;

			if (this.isDown(this.keys.LOOK_UP))
				deltaX -= data.deltaScaled * this.rotateSpeed;

			if (this.isDown(this.keys.LOOK_DOWN))
				deltaX += data.deltaScaled * this.rotateSpeed;

			deltaX = Math.min(deltaX, this.maxAngleX - this.angleX);
			deltaX = Math.max(deltaX, this.minAngleX - this.angleX);

			if (!deltaX && !deltaY)
				return;

			this.angleX += deltaX;
			this.angleY += deltaY;

			this.r.setRotation(1, 0, 0, this.angleX);
			this.r.addRotation(0, 1, 0, this.angleY);
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public update(data:pogo.TickData):void
		{
			super.update(data);
			this.updatePosition(data);
			this.updateRotation(data);
		}
	}
}

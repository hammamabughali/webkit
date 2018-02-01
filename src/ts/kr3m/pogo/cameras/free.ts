/// <reference path="../../math/quaternion.ts"/>
/// <reference path="../../math/vector3d.ts"/>
/// <reference path="../../pogo/camera.ts"/>



module pogo.cameras
{
	export interface FreeOptions extends pogo.CameraOptions
	{
	}



	export class Free extends pogo.Camera
	{
		protected options:FreeOptions;

		protected p = new kr3m.math.Vector3d();
		protected r = new kr3m.math.Quaternion();

		protected fov = 0;
		protected aspectRatio = 1;
		protected clipNear = 0.0001;
		protected clipFar = 10;



		constructor(
			canvas:pogo.Canvas,
			options?:FreeOptions)
		{
			super(canvas, options);

			this.aspectRatio = canvas.getAspectRatio();
			this.setRotation(0, 1, 0, 0);
			this.setPosition(0, 0, 0);
			this.setFov(45);
		}



		public setFov(angle:number):void
		{
			if (angle == this.fov)
				return;

			this.fov = angle;
			this.perspectiveMatrixDirty = true;
			this.touchCanvas();
		}



		public setClipDistance(far:number, near?:number):void
		{
			this.clipFar = far;
			this.clipNear = near || far / 10000;
			this.perspectiveMatrixDirty = true;
			this.touchCanvas();
		}



		public setAspectRatio(ratio:number):void
		{
			if (ratio == this.aspectRatio)
				return;

			this.aspectRatio = ratio;
			this.perspectiveMatrixDirty = true;
			this.touchCanvas();
		}



		protected updatePerspectiveMatrix():void
		{
			this.perspectiveMatrix.setPerspective(this.fov, this.aspectRatio, this.clipNear, this.clipFar);
			this.perspectiveMatrixDirty = false;
		}



		public getPerspectiveMatrix():kr3m.math.Matrix4x4
		{
			this.setAspectRatio(this.canvas.getAspectRatio());
			return super.getPerspectiveMatrix();
		}



		public getTweenSnapshot():any
		{
			var snapshot =
			{
				x : this.p.x,
				y : this.p.y,
				z : this.p.z,
				rot :
				{
					w : this.r.w,
					x : this.r.x,
					y : this.r.y,
					z : this.r.z
				}
			};
			return snapshot;
		}



		public set x(value:number)
		{
			this.p.x = value;
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public get x():number
		{
			return this.p.x;
		}



		public set y(value:number)
		{
			this.p.y = value;
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public get y():number
		{
			return this.p.y;
		}



		public set z(value:number)
		{
			this.p.z = value;
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public get z():number
		{
			return this.p.z;
		}



		public setPosition(x:number, y:number, z:number):void;
		public setPosition(pos:kr3m.math.Vector3d):void;

		public setPosition():void
		{
			if (arguments.length == 1)
			{
				this.p.x = arguments[0].x;
				this.p.y = arguments[0].y;
				this.p.z = arguments[0].z;
			}
			else
			{
				this.p.x = arguments[0];
				this.p.y = arguments[1];
				this.p.z = arguments[2];
			}
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public set pos(value:kr3m.math.Vector3d)
		{
			this.p.x = value.x;
			this.p.y = value.y;
			this.p.z = value.z;
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public get pos():kr3m.math.Vector3d
		{
			return this.p.clone();
		}



		public setRotation(x:number, y:number, z:number, angle:number):void;
		public setRotation(rot:kr3m.math.Quaternion):void;

		public setRotation()
		{
			if (arguments.length == 1)
			{
				this.r.x = arguments[0].x;
				this.r.y = arguments[0].y;
				this.r.z = arguments[0].z;
				this.r.w = arguments[0].w;
			}
			else
			{
				this.r.setRotation(arguments[0], arguments[1], arguments[2], arguments[3]);
			}
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public set rot(value:kr3m.math.Quaternion)
		{
			this.r.w = value.w;
			this.r.x = value.x;
			this.r.y = value.y;
			this.r.z = value.z;
			this.viewMatrixDirty = true;
			this.touchCanvas();
		}



		public get rot():kr3m.math.Quaternion
		{
			return this.r.clone();
		}



		protected updateAABB():void
		{
			this.aabb.x = 0;
			this.aabb.y = 0;
			this.aabb.z = 0;
			this.aabb.w = 0;
			this.aabb.h = 0;
			this.aabb.d = 0;
		}



		protected updateViewMatrix():void
		{
			this.viewMatrix.setIdentity();
			this.viewMatrix.setTranslation(this.p);
			this.viewMatrix.concat4x4(this.r.getRotationMatrix());
			this.viewMatrix.invertFast();
			this.viewMatrixDirty = false;
		}
	}
}

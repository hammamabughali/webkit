/// <reference path="../math/quaternion.ts"/>
/// <reference path="../math/vector3d.ts"/>
/// <reference path="../pogo/entity.ts"/>
/// <reference path="../util/util.ts"/>



module pogo
{
	export interface Entity3dOptions extends EntityOptions
	{
		position?:kr3m.math.Vector3d;
		x?:number;
		y?:number;
		z?:number;
	}



	export class Entity3d extends Entity
	{
		protected options:Entity3dOptions;

		protected p = new kr3m.math.Vector3d(0, 0, 0);
		protected s = new kr3m.math.Vector3d(1, 1, 1);
		protected r = new kr3m.math.Quaternion();



		constructor(
			parentOrCanvas:Canvas|Entity3d,
			options?:Entity3dOptions)
		{
			super(parentOrCanvas, options);
			this.r.setRotation(0, 1, 0, 0);
			this.matrix.setIdentity();

			if (this.options.position)
				this.setPosition(this.options.position);

			if (this.options.x)
				this.x = this.options.x;

			if (this.options.y)
				this.y = this.options.y;

			if (this.options.z)
				this.z = this.options.z;
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
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set pos(value:kr3m.math.Vector3d)
		{
			this.p.x = value.x;
			this.p.y = value.y;
			this.p.z = value.z;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get pos():kr3m.math.Vector3d
		{
			return this.p.clone();
		}



		public pushPosition(stream:number[]):void
		{
			stream.push(this.p.x);
			stream.push(this.p.y);
			stream.push(this.p.z);
		}



		public set x(value:number)
		{
			this.p.x = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get x():number
		{
			return this.p.x;
		}



		public set y(value:number)
		{
			this.p.y = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get y():number
		{
			return this.p.y;
		}



		public set z(value:number)
		{
			this.p.z = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get z():number
		{
			return this.p.z;
		}



		public setScale(x:number, y:number, z:number):void;
		public setScale(scale:kr3m.math.Vector3d):void;

		public setScale():void
		{
			if (arguments.length == 1)
			{
				this.s.x = arguments[0].x;
				this.s.y = arguments[0].y;
				this.s.z = arguments[0].z;
			}
			else
			{
				this.s.x = arguments[0];
				this.s.y = arguments[1];
				this.s.z = arguments[2];
			}
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set scale(value:kr3m.math.Vector3d)
		{
			this.s.x = value.x;
			this.s.y = value.y;
			this.s.z = value.z;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get scale():kr3m.math.Vector3d
		{
			return this.s.clone();
		}



		public set sx(value:number)
		{
			this.s.x = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get sx():number
		{
			return this.s.x;
		}



		public set sy(value:number)
		{
			this.s.y = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get sy():number
		{
			return this.s.y;
		}



		public set sz(value:number)
		{
			this.s.z = value;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get sz():number
		{
			return this.s.z;
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
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set rot(value:kr3m.math.Quaternion)
		{
			this.r.w = value.w;
			this.r.x = value.x;
			this.r.y = value.y;
			this.r.z = value.z;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public get rot():kr3m.math.Quaternion
		{
			return this.r.clone();
		}



		public setWorldPosition(worldX:number, worldY:number, worldZ:number):void
		{
			var v = new kr3m.math.Vector3d(worldX, worldY, worldZ);
			var local = this.getMatrix().inverted().apply3d(v);
			this.setPosition(local);
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



		protected updateMatrix():void
		{
			this.matrix.setTranslation(this.p);
			this.matrix.concat4x4(this.r.getRotationMatrix());
			var scaleMatrix = new kr3m.math.Matrix4x4();
			scaleMatrix.setScale(this.s);
			this.matrix.concat4x4(scaleMatrix);

			if (this.parent)
				this.matrix = this.parent.getMatrix().concated4x4(this.matrix);

			var workset = this.children.slice();
			while (workset.length > 0)
			{
				var child = <Entity3d> workset.pop();
				child.matrixDirty = true;
				if (child.children.length > 0)
					workset = workset.concat(child.children);
			}
		}
	}
}

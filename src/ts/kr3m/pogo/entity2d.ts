/// <reference path="../math/vector2d.ts"/>
/// <reference path="../pogo/entity.ts"/>
/// <reference path="../util/util.ts"/>



module pogo
{
	export interface Entity2dOptions extends EntityOptions
	{
	}



	export class Entity2d extends Entity
	{
		protected options:Entity2dOptions;

		protected p = new kr3m.math.Vector2d(0, 0);
		protected o = new kr3m.math.Vector2d(0, 0);
		protected s = new kr3m.math.Vector2d(1, 1);
		protected r = 0;

		protected inverseOffsetMatrix = new kr3m.math.Matrix4x4();



		constructor(
			parentOrCanvas:Canvas|Entity2d,
			options?:Entity2dOptions)
		{
			super(parentOrCanvas, options);
		}



		public setPosition(x:number, y:number):void;
		public setPosition(pos:kr3m.math.Vector2d):void;

		public setPosition():void
		{
			if (arguments.length == 1)
			{
				this.p.x = arguments[0].x;
				this.p.y = arguments[0].y;
			}
			else
			{
				this.p.x = arguments[0];
				this.p.y = arguments[1];
			}
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set pos(value:kr3m.math.Vector2d)
		{
			this.setPosition(value);
		}



		public get pos():kr3m.math.Vector2d
		{
			return this.p.clone();
		}



		public set x(value:number)
		{
			this.setPosition(value, this.p.y);
		}



		public get x():number
		{
			return this.p.x;
		}



		public set y(value:number)
		{
			this.setPosition(this.p.x, value);
		}



		public get y():number
		{
			return this.p.y;
		}



		public setPivot(x:number, y:number):void;
		public setPivot(pivot:kr3m.math.Vector2d):void;

		public setPivot():void
		{
			if (arguments.length == 1)
			{
				this.o.x = arguments[0].x;
				this.o.y = arguments[0].y;
			}
			else
			{
				this.o.x = arguments[0];
				this.o.y = arguments[1];
			}
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set pivot(value:kr3m.math.Vector2d)
		{
			this.setPivot(value);
		}



		public get pivot():kr3m.math.Vector2d
		{
			return this.o.clone();
		}



		public set px(value:number)
		{
			this.setPivot(value, this.o.y);
		}



		public get px():number
		{
			return this.o.x;
		}



		public set py(value:number)
		{
			this.setPivot(this.o.x, value);
		}



		public get py():number
		{
			return this.o.y;
		}



		public pushPosition(stream:number[]):void
		{
			stream.push(this.p.x);
			stream.push(this.p.y);
		}



		public setScale(x:number, y:number):void;
		public setScale(scale:kr3m.math.Vector2d):void;

		public setScale():void
		{
			if (arguments.length == 1)
			{
				this.s.x = arguments[0].x;
				this.s.y = arguments[0].y;
			}
			else
			{
				this.s.x = arguments[0];
				this.s.y = arguments[1];
			}
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set scale(value:kr3m.math.Vector2d)
		{
			this.setScale(value);
		}



		public get scale():kr3m.math.Vector2d
		{
			return this.s.clone();
		}



		public set sx(value:number)
		{
			this.setScale(value, this.s.y);
		}



		public get sx():number
		{
			return this.s.x;
		}



		public set sy(value:number)
		{
			this.setScale(this.s.x, value);
		}



		public get sy():number
		{
			return this.s.y;
		}



		public setRotation(angle:number):void
		{
			this.r = angle;
			this.matrixDirty = true;
			this.touchCanvas();
		}



		public set rot(angle:number)
		{
			this.setRotation(angle);
		}



		public get rot():number
		{
			return this.r;
		}



		public setWorldPosition(x:number, y:number, z:number):void
		{
			var world = new kr3m.math.Vector3d(x, y, z);
			if (this.parent)
				var local = this.parent.getMatrix().inverted().apply3d(world);
			else
				var local = world;
			this.setPosition(local.x + this.o.x, local.y + this.o.y);
		}



		protected updateAABB():void
		{
			this.aabb.x = -this.o.x;
			this.aabb.y = -this.o.y;
			this.aabb.z = 0;
			this.aabb.w = 0;
			this.aabb.h = 0;
			this.aabb.d = 0;
		}



		protected updateMatrix():void
		{
			this.matrix.setIdentity();
			this.matrix.setTranslation(this.p.x, this.p.y, 0);
			this.matrix.rotateZ(this.r);
			var scaleMatrix = new kr3m.math.Matrix4x4();
			scaleMatrix.setScale(this.s.x, this.s.y, 1);
			this.matrix.concat4x4(scaleMatrix);
			this.matrix.translate(-this.o.x, -this.o.y, 0);

			this.inverseOffsetMatrix.setTranslation(this.o.x, this.o.y, 0);

			if (this.parent)
			{
				if (this.parent instanceof Entity2d)
					this.matrix = this.parent.getMatrix().concated4x4(this.parent.inverseOffsetMatrix).concated4x4(this.matrix);
				else
					this.matrix = this.parent.getMatrix().concated4x4(this.matrix);
			}

			var workset = this.children.slice();
			while (workset.length > 0)
			{
				var child = <Entity2d> workset.pop();
				child.matrixDirty = true;
				if (child.children.length > 0)
					workset = workset.concat(child.children);
			}
		}
	}
}

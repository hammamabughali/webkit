/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../pogo/anchor.ts"/>
/// <reference path="../pogo/entity2d.ts"/>
/// <reference path="../pogo/material.ts"/>
/// <reference path="../pogo/mesh.ts"/>



module pogo
{
	export interface FrameOptions extends Entity2dOptions
	{
		width?:number;
		height?:number;
	}



	export class Frame extends Entity2d
	{
		protected options:FrameOptions;

		protected material:Material;
		protected mesh:Mesh;

		protected w:number;
		protected h:number;

		protected stopAnchorBubbling = false;
		protected anchoredFrames:Frame[] = [];
		protected anchors:Anchor[] = [];



		constructor(
			parentOrCanvas:Canvas|Entity2d,
			options?:FrameOptions)
		{
			super(parentOrCanvas, options);
			this.flags.addSetConstraint("ready", ["mesh", "material"], true);

			this.w = this.options.width || 0;
			this.h = this.options.height || 0;
		}



		public setMesh(mesh:Mesh):void
		{
			this.flags.clear("mesh");
			this.mesh = mesh;
			if (this.mesh)
			{
				this.mesh.flags.onceSet("ready", () =>
				{
					this.flags.set("mesh");
					this.touchCanvas();
				});
			}
		}



		public setMaterial(material:Material):void
		{
			this.flags.clear("material");
			this.material = material;
			if (this.material)
			{
				this.material.flags.onceSet("ready", () =>
				{
					this.flags.set("material");
					this.touchCanvas();
				});
			}
		}



		public setPosition(x:number, y:number):void;
		public setPosition(pos:kr3m.math.Vector2d):void;

		public setPosition():void
		{
			super.setPosition(arguments[0], arguments[1]);
			this.updateAnchors();
		}



		public setPivot(x:number, y:number):void;
		public setPivot(pivot:kr3m.math.Vector2d):void;

		public setPivot():void
		{
			super.setPivot(arguments[0], arguments[1]);
			this.updateAnchors();
		}



		public setScale(x:number, y:number):void;
		public setScale(scale:kr3m.math.Vector2d):void;

		public setScale():void
		{
			super.setScale(arguments[0], arguments[1]);
			this.updateAnchors();
		}



		public setRotation(angle:number):void
		{
			super.setRotation(angle);
			this.updateAnchors();
		}



		public setSize(w:number, h:number):void
		{
			if (this.w == w && this.h == h)
				return;

			this.w = w;
			this.h = h;

			this.aabbDirty = true;
			this.aabbWorldDirty = true;

			this.updateAnchors();
		}



		public getWidth():number
		{
			return this.w;
		}



		public getHeight():number
		{
			return this.h;
		}



		protected applyAnchors():void
		{
			var constraints:{left?:number, top?:number, right?:number, bottom?:number} = {};
			for (var i = 0; i < this.anchors.length; ++i)
			{
				var a = this.anchors[i];
				a.updateOffset();
				var c = a.getConstraints();
				for (var id in c)
				{
//# DEBUG
					if (constraints[id] !== undefined)
						throw new Error("conflicting anchor setup: " + a.refFrame.name + "." + a.refPoint + " -> " + a.frame.name + "." + a.point);
//# /DEBUG
					constraints[id] = c[id];
				}
			}

			var worldPos = this.getWorldPosition();
			var w = this.w;
			var h = this.h;

			//# TODO: do we have to actually apply the matrix to w and h too?

			if (constraints.left !== undefined && constraints.right !== undefined)
			{
				worldPos.x = constraints.left;
				w = constraints.right - constraints.left;
			}
			else if (constraints.left !== undefined)
			{
				worldPos.x = constraints.left;
			}
			else if (constraints.right !== undefined)
			{
				worldPos.x = constraints.right - w;
			}

			if (constraints.top !== undefined && constraints.bottom !== undefined)
			{
				worldPos.y = constraints.top;
				h = constraints.bottom - constraints.top;
			}
			else if (constraints.top !== undefined)
			{
				worldPos.y = constraints.top;
			}
			else if (constraints.bottom !== undefined)
			{
				worldPos.y = constraints.bottom - h;
			}

			this.stopAnchorBubbling = true;
			this.setSize(w, h);
			this.setWorldPosition(worldPos.x, worldPos.y, worldPos.z);
			this.stopAnchorBubbling = false;
			this.updateAnchors();
		}



		protected updateAnchors():void
		{
			if (this.stopAnchorBubbling)
				return;

			for (var i = 0; i < this.anchoredFrames.length; ++i)
				this.anchoredFrames[i].applyAnchors();
		}



//# DEBUG
		private checkForCircularAnchors(anchor:Anchor):void
		{
			//# FIXME: NYI checkForCircularAnchors
		}
//# /DEBUG



		public addAnchor(
			refFrame:Frame,
			options?:AnchorOptions):void
		{
			var anchor = new Anchor(this, refFrame, options);
			this.anchors.push(anchor);
//# DEBUG
			this.checkForCircularAnchors(anchor);
//# /DEBUG
			if (refFrame.anchoredFrames.indexOf(this) < 0)
				refFrame.anchoredFrames.push(this);

			this.applyAnchors();
		}



		protected updateAABB():void
		{
			this.aabb.x = -this.o.x;
			this.aabb.y = -this.o.y;
			this.aabb.z = 0;
			this.aabb.w = this.w;
			this.aabb.h = this.h;
			this.aabb.d = 0;
		}



		public render(
			matrices:{[id:string]:kr3m.math.Matrix4x4}):void
		{
			if (!this.flags.isSet("ready"))
				return;

			var uM = this.getMatrix();
			matrices["uM"] = uM;

			var uPVM = matrices["uPV"].concated4x4(uM);
			matrices["uPVM"] = uPVM;

			this.material.render(matrices, this.mesh, []);
		}
	}
}

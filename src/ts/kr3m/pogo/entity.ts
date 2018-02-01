/// <reference path="../async/flags.ts"/>
/// <reference path="../math/matrix4x4.ts"/>
/// <reference path="../pogo/tickdata.ts"/>
/// <reference path="../pogo/ticked.ts"/>
/// <reference path="../pogo/tween.ts"/>
/// <reference path="../util/tokenizer.ts"/>



module pogo
{
	export interface EntityOptions
	{
		name?:string;
		priority?:number;
		visible?:boolean;
	}



	export abstract class Entity implements Ticked
	{
		private static freeId = 0;

		private id:number;

		protected options:EntityOptions;

		protected canvas:Canvas;

		public name:string;
		public flags = new kr3m.async.Flags();
		public visible = true;

		protected tickFuncs:Array<(data:TickData) => void> = [];
		protected tweenObj:Tween<Entity>;

		protected matrixDirty = true;
		protected matrix = new kr3m.math.Matrix4x4();

		protected aabb = new AABB();
		protected aabbDirty = true;
		protected aabbWorld = new AABB();
		protected aabbWorldDirty = true;

		public parent:Entity;
		public children:Entity[] = [];



		constructor(
			parentOrCanvas:Canvas|Entity,
			options?:EntityOptions)
		{
			this.id = ++Entity.freeId;

			this.options = options || {};

			if (parentOrCanvas instanceof Canvas)
			{
				this.canvas = parentOrCanvas;
				this.canvas.addEntity(this);
			}
			else
			{
				this.parent = parentOrCanvas;
				this.parent.addChild(this);
				this.canvas = this.parent.canvas;
			}
			this.tweenObj = new Tween(this);

			if (this.options.visible !== undefined)
				this.visible = this.options.visible;

			this.name = tokenize(this.options.name || "Entity_##id##", {id : ("000000" + this.id).slice(-6)});
		}



		public getCanvas():Canvas
		{
			return this.canvas;
		}



		public getHirarchyName():string
		{
			var result = this.name;
			for (var temp = this.parent; temp; temp = temp.parent)
				result = temp.name + "." + result;
			return result;
		}



		public addChild(child:Entity):void
		{
			if (!kr3m.util.Util.contains(this.children, child))
				this.children.push(child);
			child.parent = this;
		}



		public removeChild(child:Entity):void
		{
			kr3m.util.Util.remove(this.children, child);
			child.parent = null;
		}



		public touchCanvas():void
		{
			if (this.canvas)
				this.canvas.dirty = true;
		}



		public get tween():Tween<Entity>
		{
			return this.tweenObj;
		}



		public onTick(func:(data:pogo.TickData) => void):void
		{
			this.tickFuncs.push(func);
		}



		public update(data:pogo.TickData):void
		{
			for (var i = 0; i < this.tickFuncs.length; ++i)
				this.tickFuncs[i](data);

			this.tween.update(data.deltaScaled);

			for (var i = 0; i < this.children.length; ++i)
				this.children[i].update(data);
		}



		protected abstract updateMatrix():void;



		public getMatrix():kr3m.math.Matrix4x4
		{
			if (this.matrixDirty)
			{
				this.updateMatrix();
				this.matrixDirty = false;
				this.aabbWorldDirty = true;
			}
			return this.matrix;
		}



		public getWorldPosition(
			localX = 0,
			localY = 0,
			localZ = 0):kr3m.math.Vector3d
		{
			return this.getMatrix().apply3d(new kr3m.math.Vector3d(localX, localY, localZ));
		}



		public abstract setWorldPosition(worldX:number, worldY:number, worldZ:number):void;



		protected abstract updateAABB():void;



		public getAABB():AABB
		{
			if (this.aabbDirty)
			{
				this.updateAABB();
				this.aabbDirty = false;
			}
			return this.aabb.clone();
		}



		protected updateWorldAABB():void
		{
			this.aabbWorld = this.getAABB().applyMatrix(this.getMatrix());
		}



		public getWorldAABB():AABB
		{
			if (this.aabbWorldDirty)
			{
				this.updateWorldAABB();
				this.aabbWorldDirty = false;
			}
			return this.aabbWorld.clone();
		}
	}
}

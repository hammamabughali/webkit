/// <reference path="../../canvas/display/dragonbonescontainer.ts"/>
/// <reference path="../../canvas/display/dragonbonessprite.ts"/>
/// <reference path="../../lib/dragonbones.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.factory
{
	export class DragonBonesFactory extends dragonBones.factorys.BaseFactory
	{
		public _generateArmature():dragonBones.Armature
		{
			return new dragonBones.Armature(new kr3m.canvas.display.DragonBonesContainer());
		}



		public _generateSlot():dragonBones.Slot
		{
			return new dragonBones.Slot(new DisplayBridge());
		}



		public _generateDisplay(
			textureAtlas:any,
			frameName:string,
			pivotX:number,
			pivotY:number):PIXI.Sprite
		{
			var display = new kr3m.canvas.display.DragonBonesSprite(frameName, true);
			display.pivot.x = pivotX;
			display.pivot.y = pivotY;
			return display;
		}
	}



	class DisplayBridge implements dragonBones.display.IDisplayBridge
	{
		public static RADIAN_TO_ANGLE:number = PIXI.RAD_TO_DEG;

		private display:kr3m.canvas.util.ITransforming;



		public getVisible():boolean
		{
			return this.display ? this.display.visible : false;
		}



		public setVisible(value:boolean):void
		{
			if (this.display)
				this.display.visible = value;
		}



		public getDisplay():kr3m.canvas.util.ITransforming
		{
			return this.display;
		}



		public setDisplay(value:kr3m.canvas.util.ITransforming):void
		{
			if (this.display == value)
				return;

			var index:number = -1;
			var parent:PIXI.DisplayObjectContainer;
			if (this.display)
			{
				parent = this.display.parent;
				if (parent)
				{
					index = parent.getChildIndex(this.display);
					parent.removeChild(this.display);
				}
			}
			this.display = value;
			this.addDisplay(parent, index);
		}



		public dispose():void
		{
			this.display = null;
		}



		public updateTransform(
			matrix:dragonBones.geom.Matrix,
			transform:dragonBones.objects.DBTransform):void
		{
			this.display.x = matrix.tx;
			this.display.y = matrix.ty;
			this.display.skew.x = transform.skewX;
			this.display.skew.y = transform.skewY;
			this.display.scale.x = transform.scaleX;
			this.display.scale.y = transform.scaleY;
		}



		public updateColor(
			aOffset:number,
			rOffset:number,
			gOffset:number,
			bOffest:number,
			aMultiplier:number,
			rMultiplier:number,
			gMultiplier:number,
			bMultiplier:number):void
		{
			if (this.display)
				this.display.alpha = aMultiplier;
		}



		public updateBlendMode(blendMode:string):void
		{
		}



		public addDisplay(parent:PIXI.DisplayObjectContainer, index:number):void
		{
			if (parent && this.display)
				(index > 0) ? parent.addChildAt(this.display, index) : parent.addChild(this.display);
		}



		public removeDisplay():void
		{
			if (this.display && this.display.parent)
				this.display.parent.removeChild(this.display);
		}
	}
}

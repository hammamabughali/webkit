/// <reference path="../geom/point2d.ts"/>
/// <reference path="../math/mathex.ts"/>
/// <reference path="../spritecontainer.ts"/>



module kr3m.pseudocanvas
{
	export class Sprite extends kr3m.pseudocanvas.SpriteContainer
	{
		private position = new kr3m.geom.Point2d();
		private offset = new kr3m.geom.Point2d();
		private size = new kr3m.geom.Point2d();
		private stylesDirty:boolean;



		constructor(parent, width:number = 100, height:number = 100)
		{
			super(parent);
			this.size.x = width;
			this.size.y = height;
			this.stylesDirty = false;
			this.dom.css(
			{
				width:width,
				height:height,
				overflow:"hidden",
				position:"absolute"
			});
		}



		public getTop():number
		{
			return this.position.y - this.offset.y;
		}



		public getBottom():number
		{
			return this.position.y - this.offset.y + this.size.y;
		}



		public getLeft():number
		{
			return this.position.x - this.offset.x;
		}



		public getRight():number
		{
			return this.position.x - this.offset.x + this.size.x;
		}



		public setTop(value:number):void
		{
			this.position.y = value + this.offset.y;
			this.stylesDirty = true;
		}



		public setBottom(value:number):void
		{
			this.position.y = value + this.offset.y - this.size.y;
			this.stylesDirty = true;
		}



		public setLeft(value:number):void
		{
			this.position.x = value + this.offset.x;
			this.stylesDirty = true;
		}



		public setRight(value:number):void
		{
			this.position.x = value + this.offset.x - this.size.x;
			this.stylesDirty = true;
		}



		public setOffsetToCenter():void
		{
			this.offset.x = this.size.x * 0.5;
			this.offset.y = this.size.y * 0.5;
			this.stylesDirty = true;
		}



		public dirty():void
		{
			this.stylesDirty = true;
		}



		public updateStyles():void
		{
			if (this.stylesDirty)
			{
				var left = this.position.x - this.offset.x;
				var top = this.position.y - this.offset.y;
				this.dom.css({top:top, left:left});
				this.stylesDirty = false;
			}
			super.updateStyles();
		}



		public rotateAroundLocal(x:number, y:number, angle:number):void
		{
			var dx = this.position.x - x;
			var dy = this.position.y - y;
			var oldAngle = Math.atan2(dy, dx);
			var radius = Math.sqrt(dx * dx + dy * dy);
			var newAngle = oldAngle + angle * kr3m.math.MathEx.DEG_2_RAD;
			this.position.x = x + radius * Math.cos(newAngle);
			this.position.y = y + radius * Math.sin(newAngle);
			this.stylesDirty = true;
		}



		public setLocalPosition(x:number, y:number):void
		{
			this.position.x = x;
			this.position.y = y;
			this.stylesDirty = true;
		}
	}
}

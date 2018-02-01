/// <reference path="../geom/axisalignedrectangle2d.ts"/>



module kr3m.geom
{
	export class AxisAlignedRectangleContainer2d
	{
		private rects:kr3m.geom.AxisAlignedRectangle2d[] = [];
		private clipRect:kr3m.geom.AxisAlignedRectangle2d = null;



		public clear():void
		{
			this.rects = [];
		}



		public getAllIntersecting(
			container:kr3m.geom.AxisAlignedRectangleContainer2d):kr3m.geom.AxisAlignedRectangleContainer2d
		{
			var result = new kr3m.geom.AxisAlignedRectangleContainer2d();
			for (var i = 0; i < container.rects.length; ++i)
			{
				if (this.intersects(container.rects[i]))
					result.rects.push(container.rects[i]);
			}
			return result;
		}



		public intersects(
			rect:kr3m.geom.AxisAlignedRectangle2d):kr3m.geom.AxisAlignedRectangle2d
		{
			for (var i = 0; i < this.rects.length; ++i)
			{
				if (this.rects[i].intersects(rect))
					return this.rects[i];
			}
			return null;
		}



		public setClipRect(rect:kr3m.geom.AxisAlignedRectangle2d):void
		{
			this.clipRect = rect.clone();
			for (var i = 0; i < this.rects.length; ++i)
			{
				this.clipRect.clip(this.rects[i]);
				if (this.rects[i].w == 0 || this.rects[i].h == 0)
					this.rects.splice(i--, 1);
			}
		}



		public push(rect:kr3m.geom.AxisAlignedRectangle2d):void
		{
			if (this.clipRect)
				this.clipRect.clip(rect);

			if (rect.w <= 0 || rect.h <= 0)
				return;

			var intersect = this.intersects(rect);
			if (intersect)
				intersect.merge(rect);
			else
				this.rects.push(rect);
		}



		public pop():kr3m.geom.AxisAlignedRectangle2d
		{
			return this.rects.pop();
		}



		public trim():void
		{
			for (var i = 0; i < this.rects.length; ++i)
			{
				var a = this.rects[i];
				for (var j = i + 1; j < this.rects.length; ++j)
				{
					var b = this.rects[j];
					if (a.intersects(b))
					{
						a.merge(b);
						this.rects.splice(j--, 1);
					}
				}
				this.rects[i].round();
			}
		}



		public merge(container:kr3m.geom.AxisAlignedRectangleContainer2d):void
		{
			for (var i = 0; i < container.rects.length; ++i)
				this.push(container.rects[i]);
			this.trim();
		}



		public forEach(func:(rect:kr3m.geom.AxisAlignedRectangle2d) => void):void
		{
			for (var i = 0; i < this.rects.length; ++i)
				func(this.rects[i]);
		}



		public getLength():number
		{
			return this.rects.length;
		}
	}
}

/// <reference path="../math/vector2d.ts"/>
/// <reference path="../pogo/frame.ts"/>



module pogo
{
	export type AnchorPoint = "tl"|"t"|"tr"|"l"|"c"|"r"|"bl"|"b"|"br";
	export type AnchorUnit = "px"|"vw"|"vh"|"vmin"|"%";



	export class AnchorOptions
	{
		point?:AnchorPoint;
		refPoint?:AnchorPoint;
		x?:number;
		y?:number;
		unit?:AnchorUnit;
		unitX?:AnchorUnit;
		unitY?:AnchorUnit;
	}



	export class Anchor
	{
		public static roundFractions = true;

		protected options:AnchorOptions;

		public point:AnchorPoint;
		public refPoint:AnchorPoint;
		public offset = new kr3m.math.Vector3d(0, 0, 0);



		constructor(
			public frame:Frame,
			public refFrame:Frame,
			options?:AnchorOptions)
		{
			this.options = options || {};
			this.point = options.point || "c";
			this.refPoint = options.refPoint || options.point;
			this.options.x = options.x || 0;
			this.options.y = options.y || 0;
			this.options.unitX = options.unitX || options.unit || "px";
			this.options.unitY = options.unitY || options.unit || "px";
			this.updateOffset();
		}



		public updateOffset():void
		{
			switch (this.options.unitX)
			{
				case "px":
					this.offset.x = this.options.x;
					break;

				case "vw":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.x = this.options.x * canvas.getWidth() / 100;
					else
						this.offset.x = 0;
					break;

				case "vh":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.x = this.options.x * canvas.getHeight() / 100;
					else
						this.offset.x = 0;
					break;

				case "vmin":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.x = this.options.x * Math.min(canvas.getWidth(), canvas.getHeight()) / 100;
					else
						this.offset.x = 0;
					break;

				case "%":
					if (this.frame.parent && this.frame.parent instanceof Frame)
						this.offset.x = this.options.x * this.frame.parent.getWidth() / 100;
					else
						this.offset.x = 0;
					break;

				default:
					throw new Error("unsupported anchor unit: " + this.options.unitX);
			}

			switch (this.options.unitY)
			{
				case "px":
					this.offset.y = this.options.y;
					break;

				case "vw":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.y = this.options.y * canvas.getWidth() / 100;
					else
						this.offset.y = 0;
					break;

				case "vh":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.y = this.options.y * canvas.getHeight() / 100;
					else
						this.offset.y = 0;
					break;

				case "vmin":
					var canvas = this.frame.getCanvas();
					if (canvas)
						this.offset.y = this.options.y * Math.min(canvas.getWidth(), canvas.getHeight()) / 100;
					else
						this.offset.y = 0;
					break;

				case "%":
					if (this.frame.parent && this.frame.parent instanceof Frame)
						this.offset.y = this.options.y * this.frame.parent.getHeight() / 100;
					else
						this.offset.y = 0;
					break;

				default:
					throw new Error("unsupported anchor unit: " + this.options.unitX);
			}
		}



		public getRefPosition():kr3m.math.Vector3d
		{
			var refAABB = this.refFrame.getWorldAABB();
			// we're not using the bottom(), left(), right() and top() methods because those assume an inverted y-axis
			switch (this.refPoint)
			{
				case "b":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w / 2, refAABB.y + refAABB.h, refAABB.z).plus(this.offset);

				case "bl":
					return new kr3m.math.Vector3d(refAABB.x, refAABB.y + refAABB.h, refAABB.z).plus(this.offset);

				case "br":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w, refAABB.y + refAABB.h, refAABB.z).plus(this.offset);

				case "c":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w / 2, refAABB.y + refAABB.h / 2, refAABB.z).plus(this.offset);

				case "l":
					return new kr3m.math.Vector3d(refAABB.x, refAABB.y + refAABB.h / 2, refAABB.z).plus(this.offset);

				case "r":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w, refAABB.y + refAABB.h / 2, refAABB.z).plus(this.offset);

				case "t":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w / 2, refAABB.y, refAABB.z).plus(this.offset);

				case "tl":
					return new kr3m.math.Vector3d(refAABB.x, refAABB.y, refAABB.z).plus(this.offset);

				case "tr":
					return new kr3m.math.Vector3d(refAABB.x + refAABB.w, refAABB.y, refAABB.z).plus(this.offset);
			}
		}



		public getConstraints():{left?:number, top?:number, right?:number, bottom?:number}
		{
			var refPos = this.getRefPosition();
			var constraints:{left?:number, top?:number, right?:number, bottom?:number} = {};
			switch (this.point)
			{
				case "b":
					constraints.bottom = refPos.y;
					break;

				case "bl":
					constraints.bottom = refPos.y;
					constraints.left = refPos.x;
					break;

				case "br":
					constraints.bottom = refPos.y;
					constraints.right = refPos.x;
					break;

				case "c":
					var aabb = this.frame.getWorldAABB();
					constraints.left = refPos.x - aabb.w / 2;
					constraints.top = refPos.y - aabb.h / 2;
					constraints.right = constraints.left + aabb.w;
					constraints.bottom = constraints.top + aabb.h;
					break;

				case "l":
					constraints.left = refPos.x;
					break;

				case "r":
					constraints.right = refPos.x;
					break;

				case "t":
					constraints.top = refPos.y;
					break;

				case "tl":
					constraints.top = refPos.y;
					constraints.left = refPos.x;
					break;

				case "tr":
					constraints.top = refPos.y;
					constraints.right = refPos.x;
					break;
			}

			if (Anchor.roundFractions)
			{
				for (var id in constraints)
					constraints[id] = Math.round(constraints[id]);
			}

			return constraints;
		}
	}
}

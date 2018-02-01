/// <reference path="../geom/point2d.ts"/>
/// <reference path="../images/color.ts"/>
/// <reference path="../ui2/canvas.ts"/>
/// <reference path="../ui2/img.ts"/>



module kr3m.ui2
{
	export class Canvas2d extends Canvas
	{
		protected context:CanvasRenderingContext2D;



		constructor(parentNode:ParentTypes, options?:CanvasOptions)
		{
			super(parentNode, options);

			this.context = this.dom.getContext("2d");
		}



		public clipCircle(
			x:number,
			y:number,
			r:number):this
		{
			this.context.beginPath();
			this.context.arc(x, y, r, 0, 2 * Math.PI, false);
			this.context.clip();
			return this;
		}



		public saveState():this
		{
			this.context.save();
			return this;
		}



		public restoreState():this
		{
			this.context.restore();
			return this;
		}



		public getImageData(
			x = 0,
			y = 0,
			w = this.width,
			h = this.height):ImageData
		{
			return this.context.getImageData(x, y, w, h);
		}



		public drawImage(
			source:string|HTMLImageElement|HTMLCanvasElement|ImageBitmap|Img|Canvas,
			x = 0,
			y = 0,
			w?:number,
			h?:number):this
		{
			if (!source)
				return this;

			if (typeof source == "string")
				this.context.drawImage(<any> document.getElementById(source), x, y, w, h);
			else if (source instanceof Canvas)
				this.context.drawImage((<any> source).dom, x, y, w, h);
			else if (source instanceof Img)
				this.context.drawImage((<any> source).dom, x, y, w, h);
			else
				this.context.drawImage(source, x, y);

			return this;
		}



		public drawPath(
			points:number[]|kr3m.geom.Point2d[],
			color:string|kr3m.images.Color = "black",
			lineWidth = 1):this
		{
			if (points.length < 2)
				return;

			this.context.beginPath();
			this.context.lineWidth = lineWidth;
			this.context.strokeStyle = color.toString();

			if (typeof points[0] == "number")
			{
				let p = <number[]> points;
				this.context.moveTo(p[0], p[1]);
				for (var i = 2; i < p.length; i += 2)
					this.context.lineTo(p[i], p[i + 1]);
				this.context.lineTo(p[0], p[1]);
			}
			else
			{
				let p = <kr3m.geom.Point2d[]> points;
				this.context.moveTo(p[0].x, p[0].y);
				for (var i = 1; i < p.length; ++i)
					this.context.lineTo(p[i].x, p[i].y);
				this.context.lineTo(p[0].x, p[0].y);
			}

			this.context.stroke();

			return this;
		}



		public drawLine(
			x1:number,
			y1:number,
			x2:number,
			y2:number,
			color:string|kr3m.images.Color = "black",
			lineWidth = 1):this
		{
			return this.drawPath([x1, y1, x2, y2], color, lineWidth);
		}



		public fillPath(
			points:number[]|kr3m.geom.Point2d[],
			fillColor:string|kr3m.images.Color = "black",
			lineColor:string|kr3m.images.Color = "black",
			lineWidth = 1):this
		{
			this.context.fillStyle = fillColor.toString();
			this.drawPath(points, lineColor, lineWidth);
			this.context.fill();
			return this;
		}



		public fillRect(
			x:number,
			y:number,
			w:number,
			h:number,
			fillColor:string|kr3m.images.Color = "black"):this
		{
			this.context.fillStyle = fillColor.toString();
			this.context.fillRect(x, y, w, h);
			return this;
		}
	}
}

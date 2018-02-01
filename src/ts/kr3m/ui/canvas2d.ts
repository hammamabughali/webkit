/// <reference path="../geom/axisalignedrectangle2d.ts"/>
/// <reference path="../geom/point2d.ts"/>
/// <reference path="../images/color.ts"/>
/// <reference path="../math/matrix2x3.ts"/>
/// <reference path="../ui/canvas.ts"/>
/// <reference path="../ui/image.ts"/>



module kr3m.ui
{
	export class Canvas2d extends kr3m.ui.Canvas
	{
		private context:any;
		private pixelHelper:any;
		private lineHelper:any;



		constructor(parent:kr3m.ui.Element, width = 640, height = 480, attributes:any = {})
		{
			super(parent, width, height, attributes);

			this.context = this.canvas.getContext("2d");
			this.pixelHelper = this.context.createImageData(1, 1);
			if (width > 0)
				this.lineHelper = this.context.createImageData(width, 1);
		}



		protected onCanvasSize():void
		{
			super.onCanvasSize();
			if (this.context)
				this.lineHelper = this.context.createImageData(this.width, 1);
		}



		public drawPath(
			points:kr3m.geom.Point2d[],
			color:string|kr3m.images.Color = "black",
			lineWidth = 1):this
		{
			if (points.length < 2)
				return;

			this.context.beginPath();
			this.context.lineWidth = lineWidth;
			this.context.strokeStyle = color.toString();
			this.context.moveTo(points[0].x, points[0].y);
			for (var i = 1; i < points.length; ++i)
				this.context.lineTo(points[i].x, points[i].y);
			this.context.stroke();
			return this;
		}



		public drawLine(
			fromX:number,
			fromY:number,
			toX:number,
			toY:number,
			color:string|kr3m.images.Color = "black",
			lineWidth = 1):this
		{
			this.context.beginPath();
			this.context.lineWidth = lineWidth;
			this.context.strokeStyle = color.toString();
			this.context.moveTo(fromX, fromY);
			this.context.lineTo(toX, toY);
			this.context.stroke();
			return this;
		}



		public rotate(angle:number):this
		{
			this.context.rotate(angle * 0.01745329251994329576923690768489);
			return this;
		}



		public resetTransform():this
		{
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			return this;
		}



		public setTransform(
			a:number,
			b:number,
			c:number,
			d:number,
			e:number,
			f:number):this
		{
			this.context.setTransform(a, b, c, d, e, f);
			return this;
		}



		public setTransformMatrix(
			matrix:kr3m.math.Matrix2x3):this
		{
			return this.setTransform(matrix.v[0], matrix.v[1], matrix.v[2], matrix.v[3], matrix.v[4], matrix.v[5]);
		}



		public transform(
			a:number,
			b:number,
			c:number,
			d:number,
			e:number,
			f:number):this
		{
			this.context.transform(a, b, c, d, e, f);
			return this;
		}



		public fillRectangle(
			x:number,
			y:number,
			w:number,
			h:number,
			color:string|kr3m.images.Color = "black"):this
		{
			this.context.fillStyle = color.toString();
			this.context.fillRect(x, y, w, h);
			return this;
		}



		public fill(
			color:string|kr3m.images.Color = "white"):this
		{
			return this.fillRectangle(0, 0, this.width, this.height, color);
		}



		public drawArc(
			x:number,
			y:number,
			r:number,
			a1:number,
			a2:number,
			color:string|kr3m.images.Color = "black",
			lineWidth:number = 1):this
		{
			a1 *= kr3m.math.DEG_2_RAD;
			a2 *= kr3m.math.DEG_2_RAD;
			this.context.beginPath();
			this.context.lineWidth = lineWidth;
			this.context.strokeStyle = color.toString();
			this.context.arc(x, y, r, a1, a2, false);
			this.context.stroke();
			this.context.closePath();
			return this;
		}



		public fillCircle(
			x:number,
			y:number,
			r:number,
			color:string|kr3m.images.Color = "black"):this
		{
			this.context.beginPath();
			this.context.arc(x, y, r, 0, 2 * Math.PI, false);
			this.context.fillStyle = color.toString();
			this.context.fill();
			this.context.closePath();
			return this;
		}



		public text(
			text:string,
			x:number,
			y:number,
			color:string|kr3m.images.Color = "black"):this
		{
			this.context.fillStyle = color.toString();
			this.context.fillText(text, x, y);
			return this;
		}



		public fillRect(
			rect:kr3m.geom.AxisAlignedRectangle2d,
			color:string|kr3m.images.Color = "black"):this
		{
			this.context.fillStyle = color.toString();
			this.context.fillRect(rect.x, rect.y, rect.w, rect.h);
			return this;
		}



		public clear():this
		{
			this.context.clearRect(0, 0, this.width, this.height);
			return this;
		}



		public clearRect(
			rect:kr3m.geom.AxisAlignedRectangle2d):this
		{
			this.context.clearRect(rect.x, rect.y, rect.w, rect.h);
			return this;
		}



		public drawRect(
			rect:kr3m.geom.AxisAlignedRectangle2d,
			color:string|kr3m.images.Color = "black",
			lineWidth:number = 1):this
		{
			this.context.beginPath();
			this.context.lineWidth = lineWidth;
			this.context.strokeStyle = color.toString();
			this.context.rect(rect.x, rect.y, rect.w, rect.h);
			this.context.stroke();
			return this;
		}



		public drawImage(source:any, x:number = 0, y:number = 0):this
		{
			if (!source)
				return this;

			if (typeof source == "string")
				source = document.getElementById(source);
			else if (source instanceof kr3m.ui.Canvas2d)
				source = source.canvas;
			else if (source instanceof kr3m.ui.Image)
				source = source.dom.get(0);

			this.context.drawImage(source, x, y);
			return this;
		}



		public drawImageRect(
			source:any,
			sourceRect:kr3m.geom.AxisAlignedRectangle2d,
			targetRect:kr3m.geom.AxisAlignedRectangle2d = sourceRect):this
		{
			if (!source)
				return this;

			if (typeof source == "string")
				source = document.getElementById(source);
			else if (source instanceof kr3m.ui.Canvas2d)
				source = source.canvas;
			else if (source instanceof kr3m.ui.Image)
				source = source.dom.get(0);

			try
			{
				this.context.drawImage(source, sourceRect.x, sourceRect.y, sourceRect.w, sourceRect.h, targetRect.x, targetRect.y, targetRect.w, targetRect.h);
			}
			catch(e)
			{
				logError(sourceRect);
				logError(targetRect);
				kr3m.util.Log.logStackTrace();
			}
			return this;
		}



		public getImageData(
			x:number = 0,
			y:number = 0,
			w:number = 0,
			h:number = 0):any
		{
			w = w || this.canvas.width;
			h = h || this.canvas.height;
			return this.context.getImageData(x, y, w, h);
		}



		public putPixel(
			x:number,
			y:number,
			color:kr3m.images.Color = kr3m.images.COLOR_BLACK):this
		{
			this.pixelHelper.data[0] = color.r;
			this.pixelHelper.data[1] = color.g;
			this.pixelHelper.data[2] = color.b;
			this.pixelHelper.data[3] = color.a;
			this.context.putImageData(this.pixelHelper, x, y);
			return this;
		}



		public putLine(y:number, colors:kr3m.images.Color[]):this
		{
			for (var i = 0; i < this.width; ++i)
			{
				this.lineHelper.data[i * 4 + 0] = colors[i].r;
				this.lineHelper.data[i * 4 + 1] = colors[i].g;
				this.lineHelper.data[i * 4 + 2] = colors[i].b;
				this.lineHelper.data[i * 4 + 3] = colors[i].a;
			}
			this.context.putImageData(this.lineHelper, 0, y);
			return this;
		}



		public getPixel(x:number, y:number):kr3m.images.Color
		{
			this.pixelHelper = this.context.getImageData(x, y, 1, 1);
			var color = new kr3m.images.Color();
			color.r = this.pixelHelper.data[0];
			color.g = this.pixelHelper.data[1];
			color.b = this.pixelHelper.data[2];
			color.a = this.pixelHelper.data[3];
			return color;
		}



		public getLine(y:number):kr3m.images.Color[]
		{
			this.lineHelper = this.context.getImageData(0, y, this.width, 1);
			var result:kr3m.images.Color[] = [];
			for (var i = 0; i < this.width; ++i)
			{
				var color = new kr3m.images.Color();
				color.r = this.lineHelper.data[i * 4 + 0];
				color.g = this.lineHelper.data[i * 4 + 1];
				color.b = this.lineHelper.data[i * 4 + 2];
				color.a = this.lineHelper.data[i * 4 + 3];
				result.push(color);
			}
			return result;
		}



		public setImageData(
			imageData:any,
			x:number = 0,
			y:number = 0):this
		{
			this.context.putImageData(imageData, x, y);
			return this;
		}



		public fromDataUrl(dataUrl:string):void
		{
			var img = new Image();
			img.on("load", () => this.context.drawImage(img, 0, 0));
			img.setUrl(dataUrl);
		}
	}
}

/// <reference path="../../ui/canvas2d.ts"/>
/// <reference path="../../ui/image.ts"/>



module kr3m.ui.ex
{
	export abstract class ImageTransformerAbstract extends kr3m.ui.Element
	{
		protected source:kr3m.ui.Image;
		protected canvas:kr3m.ui.Canvas2d;

		protected matrix = new kr3m.math.Matrix2x3();



		constructor(
			parent:kr3m.ui.Element,
			width:number, height:number)
		{
			super(parent);
			this.addClass("imageTransformer");
			this.canvas = new kr3m.ui.Canvas2d(this, width, height);
		}



		public setSize(width:number, height:number):void
		{
			this.canvas.setSize(width, height);
		}



		public getSize():[number, number]
		{
			return this.canvas.getSize();
		}



		public setSource(sourceUrl:string):void
		{
			this.source = new kr3m.ui.Image();
			this.source.on("load", () => this.reset());
			this.source.setUrl(sourceUrl);
		}



		protected draw(
			matrix?:kr3m.math.Matrix2x3,
			initiatedByUser:boolean = true):void
		{
			matrix = matrix || this.matrix;

			this.canvas.resetTransform();
			this.canvas.clear();
			this.canvas.setTransformMatrix(matrix);
			this.canvas.drawImage(this.source);

			if (initiatedByUser)
				this.dom.trigger("change");
		}



		public getDataUrl(mimeType:string = "image/png"):string
		{
			return this.canvas.getDataUrl(mimeType);
		}



		public reset():void
		{
			this.matrix.setIdentity();

			var width = this.canvas.getNaturalWidth();
			var height = this.canvas.getNaturalHeight();
			var imageWidth = this.source.getNaturalWidth();
			var imageHeight = this.source.getNaturalHeight();

			var sx = width / imageWidth;
			var sy = height / imageHeight;
			var s = Math.min(sx, sy);
			this.matrix.scale(s);

			var ox = (width - imageWidth * s) / 2;
			var oy = (height - imageHeight * s) / 2;
			this.matrix.translate(ox, oy);

			this.draw(this.matrix, false);
		}
	}
}

/// <reference path="../util/childprocess.ts"/>



module kr3m.images
{
	export class ImageMagick
	{
		public static convertPath = "convert";

		private args:string[] = [];



		public image(path:string):ImageMagick
		{
			this.args.push(path);
			return this;
		}



		public usePalette():ImageMagick
		{
			this.args.push("-type", "Palette");
			return this;
		}



		public backgroundColor(color:string):ImageMagick
		{
			this.args.push("-background", color);
			return this;
		}



		public scale(
			width:number,
			height:number):ImageMagick
		{
			this.args.push("-scale", width + "x" + height);
			return this;
		}



		public extent(
			width:number,
			height:number):ImageMagick
		{
			this.args.push("-gravity", "center", "-extent", width + "x" + height);
			return this;
		}



		public crop(
			width:number,
			height:number,
			offsetX = 0,
			offsetY = 0):ImageMagick
		{
			this.args.push("-crop", width + "x" + height + "+" + offsetX + "+" + offsetY);
			return this;
		}



		public applyMatrix(matrix:number[]):ImageMagick
		{
			this.args.push("-virtual-pixel", "background", "-distort", "AffineProjection", matrix.join(","));
			return this;
		}



		public adjustToFit(
			width:number,
			height:number):ImageMagick
		{
			return this.scale(width, height).extent(width, height);
		}


		public resize(
			width:number,
			height:number,
			flag:string = null):void
		{
			let size = width + 'x' + height;
			if (typeof flag == 'string' && flag.length > 0)
				size += flag;
			this.args.push("-resize", size);
		}



		public flush(
			outputPath:string,
			callback?:SuccessCallback):void
		{
			this.args.push(outputPath);
			var process = new kr3m.util.ChildProcess(ImageMagick.convertPath, this.args);
			process.exec((status) =>
			{
				this.args.pop();
				if (status != kr3m.SUCCESS)
				{
//# DEBUG
					logError("ImageMagic failed:");
					logError(ImageMagick.convertPath, ...this.args);
					logError(process.getErrorString());
//# /DEBUG
				}
				callback && callback(status == kr3m.SUCCESS);
			});
		}
	}
}

/// <reference path="../async/flags.ts"/>
/// <reference path="../loading/loader2.ts"/>
/// <reference path="../webgl/canvas.ts"/>



module kr3m.webgl
{
	export interface TextureOptions
	{
		url?:string;
	}



	export class Texture
	{
		public flags = new kr3m.async.Flags();

		protected options:TextureOptions;
		protected texObj:any;



		constructor(
			protected canvas:kr3m.webgl.Canvas,
			options?:TextureOptions)
		{
			this.options = options || {};
			if (this.options.url)
				this.setImageUrl(this.options.url);
		}



		public setImageUrl(url:string):void
		{
			this.flags.clear("ready");
			var loader = kr3m.loading.Loader2.getInstance();
			loader.loadFile(url, 0, (img:HTMLImageElement) => this.setImage(img), () =>
			{
				logError("could not load texture image", url);
			});
		}



		private isPowerOfTwo(value:number):boolean
		{
			for (var i = 2; i < value; i *= 2)
			{}
			return i == value;
		}



		public setImage(
			image:HTMLImageElement|ImageData|HTMLCanvasElement|HTMLVideoElement|ImageBitmap):void
		{
			if (!this.isPowerOfTwo(image.width) || !this.isPowerOfTwo(image.height))
				return logError("texture dimensions must be powers of two but are", image.width, "x", image.height);

			var gl = this.canvas.getGL();
			this.texObj = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, this.texObj);

			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);

			this.flags.set("ready");
		}



		public use(textureUnit = 0):void
		{
			var gl = this.canvas.getGL();
			gl.activeTexture(gl.TEXTURE0 + textureUnit);
			gl.bindTexture(gl.TEXTURE_2D, this.texObj);
		}



		public getObject(callback:(texObj:any) => void):void
		{
			this.flags.onceSet("ready", () => callback(this.texObj));
		}
	}
}

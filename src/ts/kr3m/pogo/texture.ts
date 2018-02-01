/// <reference path="../pogo/constants.ts"/>
/// <reference path="../webgl/texture.ts"/>



module pogo
{
	export interface TextureOptions extends kr3m.webgl.TextureOptions
	{
		priority?:number;
	}



	export class Texture extends kr3m.webgl.Texture
	{
		protected options:TextureOptions;



		constructor(
			canvas:Canvas,
			options?:TextureOptions)
		{
			super(canvas, options);
		}



		public setImageUrl(url:string):void
		{
			this.flags.clear("ready");
			pogo.assets.get(url, img => this.setImage(img), this.options.priority || 0);
		}
	}
}

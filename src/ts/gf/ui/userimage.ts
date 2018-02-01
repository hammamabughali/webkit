/// <reference path="../display/sprite.ts"/>



module gf.ui
{
	export class UserImage extends gf.display.Sprite
	{
		protected url:string;



		constructor(game: gf.core.Game, key?:string|PIXI.Texture|PIXI.RenderTexture, frameName?:string)
		{
			super(game, key, frameName);
		}



		protected onImageLoaded():void
		{
			let defaultWidth:number = this.width;
			let defaultHeight:number = this.height;

			this.updateKeyAndFrameName(this.url, null);

			this.width = defaultWidth;
			this.height = defaultHeight;
		}



		public set imageUrl(value:string)
		{
			if (value && value.length > 0)
			{
				this.url = value;

				try
				{
					let loader: gf.core.Loader = new gf.core.Loader(this.game);
					loader.crossOrigin = "Anonymous";
					loader.image(this.url, this.url);
					loader.onLoadComplete.addOnce(this.onImageLoaded, this);
					loader.start();
				}
				catch (e)
				{
				}
			}
		}
	}
}

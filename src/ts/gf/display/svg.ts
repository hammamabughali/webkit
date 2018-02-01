/// <reference path="sprite.ts"/>



module gf.display
{
	export class SVG extends gf.display.Sprite
	{
		protected _key:string;
		protected _maxScale:number;
		protected _rendered:boolean;
		protected _sizeX:number;
		protected _sizeY:number;

		public onRender: gf.utils.Signal;



		/*
			The SVG object transforms a SVG image into a pixel image with a given width or height.
			Since the image still needs to be rendered, it is not immediately available.
			Listen to the onRender Signal or check the rendered variable to be sure it is full available.
			@param game
			@param key
			@param sizeX The target width of the image
			@param sizeY The target height of the image
		*/
		constructor(game: gf.core.Game, key?:string, sizeX?:number, sizeY?:number)
		{
			super(game, key);

			this.onRender = new gf.utils.Signal();

			this._maxScale = 1;
			this._sizeX = sizeX;
			this._sizeY = sizeY;
			this.updateTexture();
		}



		public updateTexture():void
		{
			if (!this._key || !this._maxScale) return;

			const svg = this.game.cache.getSVG(this._key);

			if (this._sizeX) this._maxScale = this._sizeX / svg.data.width;
			if (this._sizeY) this._maxScale = this._sizeY / svg.data.height;

			this.texture = PIXI.Texture.fromImage(svg.url, undefined, undefined, this._maxScale);
			this.texture.once("update", () =>
			{
				this._rendered = true;
				this.onRender.dispatch();
			});
		}



		public updateKeyAndFrameName(key:string, frameName:string):void
		{
		}



		public get frameName():string
		{
			return null;
		}



		public set frameName(value:string)
		{
		}



		public get key():string | PIXI.Texture | PIXI.RenderTexture
		{
			return this._key;
		}



		public set key(value:string | PIXI.Texture | PIXI.RenderTexture)
		{
			if (typeof value != "string") return;
			this._key = <string>value;
			this._rendered = false;
			this.updateTexture();
		}



		public get sizeX():number
		{
			return this._sizeX;
		}



		public set sizeX(value:number)
		{
			if (this._sizeX == value) return;
			this._sizeX = value;
			this._sizeY = null;
			this.updateTexture();
		}



		public get sizeY():number
		{
			return this._sizeY;
		}



		public set sizeY(value:number)
		{
			if (this._sizeY == value) return;
			this._sizeX = null;
			this._sizeY = value;
			this.updateTexture();
		}



		public get rendered():boolean
		{
			return this._rendered;
		}
	}
}

/// <reference path="../display/idisplay.ts"/>
/// <reference path="../utils/align.ts"/>
/// <reference path="../utils/aligndata.ts"/>
/// <reference path="../utils/angle.ts"/>
/// <reference path="../utils/scale.ts"/>
/// <reference path="../utils/texture.ts"/>



module gf.display
{
	export class Slice9 extends PIXI.mesh.NineSlicePlane implements gf.display.IDisplay
	{
		protected _frameName:string;
		protected _key:string | PIXI.Texture;
		protected _maxWidth:number;

		public alignData: gf.utils.AlignData;
		public frame: gf.utils.Frame;
		public game: gf.core.Game;
		public userData: any;

		//I am not sure why it is implemented that texture is extracted in 1x resolution for OpenGL
		//and why renderer.resolution is used instead of texture.resolution.
		//I need full resolution for cripsness.
		public static EXTRACT_FULL_RESOLUTION_TEXTURE_FROM_ATLAS:boolean = false;

		/*
			The Slice9 allows you to stretch a texture using 9-slice scaling.
			The corners will remain unscaled (useful for buttons with rounded
			corners for example) and the other areas will be scaled horizontally
			and or vertically:
				A                          B
			+---+----------------------+---+
			C | 1 |          2           | 3 |
			+---+----------------------+---+
			|   |                      |   |
			| 4 |          5           | 6 |
			|   |                      |   |
			+---+----------------------+---+
			D | 7 |          8           | 9 |
			+---+----------------------+---+

			When changing this objects width and/or height:
			areas 1 3 7 and 9 will remain unscaled.
			areas 2 and 8 will be stretched horizontally
			areas 4 and 6 will be stretched vertically
			area 5 will be stretched both horizontally and vertically
				@param game
			@param leftWidth Size of the left vertical bar
			@param topHeight Size of the top horizontal bar
			@param rightWidth Size of the right vertical bar
			@param bottomHeight Size of the bottom horizontal bar
			@param key
			@param frameName
		*/
		constructor(game: gf.core.Game, leftWidth:number, topHeight:number, rightWidth:number, bottomHeight:number, key:string | PIXI.Texture, frameName?:string)
		{
			super(game.cache.getTexture("__default"), leftWidth / game.client.config.assetsResolution, topHeight / game.client.config.assetsResolution, rightWidth / game.client.config.assetsResolution, bottomHeight / game.client.config.assetsResolution);

			this.game = game;
			this.name = "";
			this.alignData = new gf.utils.AlignData();
			this.userData = {};

			this._key = key;
			this._frameName = frameName;

			this.updateTexture();
		}



		public updateRegions(
			leftWidth:number,
			topHeight:number,
			rightWidth:number,
			bottomHeight:number):void
		{
			let w:number = this.width;
			let h:number = this.height;

			this.leftWidth = leftWidth / this.game.client.config.assetsResolution;
			this.topHeight = topHeight / this.game.client.config.assetsResolution;
			this.rightWidth = rightWidth / this.game.client.config.assetsResolution;
			this.bottomHeight = bottomHeight / this.game.client.config.assetsResolution;

			this.updateTexture();

			this.width = w;
			this.height = h;
		}



		public updateTexture():void
		{
			let resolution:number = 1;
			if (Slice9.EXTRACT_FULL_RESOLUTION_TEXTURE_FROM_ATLAS == true)
			{
				if (this.key instanceof PIXI.Texture)
				{
					resolution = (this.key as PIXI.Texture).baseTexture.resolution;
				}
				else
				{
					resolution = PIXI.utils.TextureCache[this.key.toString()].baseTexture.resolution;
				}
			}
			else
			{
				resolution = (this.game.renderer instanceof PIXI.WebGLRenderer) ? 1 : this.game.renderer.resolution;
			}

			if (this._frameName)
			{
				if (!PIXI.utils.TextureCache[this.key + "-" + this._frameName])
				{
					let sprite: gf.display.Sprite = new gf.display.Sprite(this.game, this.key, this._frameName);

					//NOTE:Slice9.EXTRACT_FULL_RESOLUTION_TEXTURE_FROM_ATLAS == false:
					//this case will work badly for texture.resolution=2 and renderer.resolution=1
					//because sprite with even dimensions will get size f.e. 106.5x56.5
					let brt = new PIXI.BaseRenderTexture(sprite.width * resolution, sprite.height * resolution, PIXI.SCALE_MODES.LINEAR, resolution);
					let rt = new PIXI.RenderTexture(brt);

					if (Slice9.EXTRACT_FULL_RESOLUTION_TEXTURE_FROM_ATLAS == true)
					{
						if (this.game.renderer instanceof PIXI.WebGLRenderer)
						{
							sprite.scaleX = resolution;
							sprite.scaleY = resolution;
						}
					}

					this.game.renderer.render(sprite, rt);
					PIXI.Texture.addTextureToCache(rt, this.key + "-" + this._frameName);
				}

				this.texture = PIXI.Texture.fromFrame(this.key + "-" + this._frameName);
			}
			else
			{
				this.texture = PIXI.Texture.fromFrame(<string>this.key);
			}

			this._origWidth = this.texture.width / resolution;
			this._origHeight = this.texture.height / resolution;

			this._uvw = 1 / this._origWidth;
			this._uvh = 1 / this._origHeight;

			this._width = this._width > 1 ? this._width : this._origWidth;
			this._height = this._height > 1 ? this._height : this._origHeight;

			let uvs = this.uvs;
			uvs[2] = uvs[10] = uvs[18] = uvs[26] = this._uvw * this.leftWidth;
			uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - this._uvw * this.rightWidth;
			uvs[9] = uvs[11] = uvs[13] = uvs[15] = this._uvh * this.topHeight;
			uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - this._uvh * this.bottomHeight;

			this.updateHorizontalVertices();
			this.updateVerticalVertices();
			this.onResize();
		}



		public get maxWidth():number
		{
			return this._maxWidth;
		}



		public set maxWidth(value:number)
		{
			this._maxWidth = value;
			this.width = Math.min(this.width, this._maxWidth);
		}



		/*
			The width of the Slice9, setting this will actually modify the vertices and UV's of this plane
		*/
		public get width():number
		{
			return this._width;
		}



		public set width(value:number)
		{
			if (value == this._width) return;
			this._width = (this._maxWidth) ? Math.min(value, this._maxWidth) : value;
			this.updateVerticalVertices();
			if (this.game && this.alignData) this.onResize();
		}



		/*
			The height of the Slice9, setting this will actually modify the vertices and UV's of this plane
		*/
		public get height():number
		{
			return this._height;
		}



		public set height(value:number)
		{
			if (value == this._height) return;
			this._height = Math.max(value, this.topHeight + this.bottomHeight);
			this.updateHorizontalVertices();
			if (this.game && this.alignData) this.onResize();
		}



		public get origWidth():number
		{
			return this._origWidth;
		}



		public get origHeight():number
		{
			return this._origHeight;
		}



		public hAlign(
			align:string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			gf.utils.Align.hAlign(this, align, alignTo, offset);
		}



		public vAlign(
			align:string,
			alignTo?: IDisplay | gf.core.Game | number,
			offset:number = 0):void
		{
			gf.utils.Align.vAlign(this, align, alignTo, offset);
		}



		public onResize():void
		{
			gf.utils.Align.onResize(this);
		}



		public on(events:string, fn: Function, context?:any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e:string) => super.on(e, fn, context));
			return this;
		}



		public off(events:string, fn: Function, once?:boolean): this
		{
			if (!events) return this;
			events.split(" ").forEach((e:string) => super.off(e, fn, once));
			return this;
		}



		public once(events:string, fn: Function, context?:any): this
		{
			if (!events) return this;
			events.split(" ").forEach((e:string) => super.once(e, fn, context));
			return this;
		}



		public removeAllListeners(events:string): this
		{
			if (!events) return this;
			events.split(" ").forEach((e: PIXI.interaction.InteractionEventTypes) => super.removeAllListeners(e));
			return this;
		}



		public get angle():number
		{
			return gf.utils.Angle.getAngle(this);
		}



		public set angle(value:number)
		{
			gf.utils.Angle.setAngle(this, value);
		}



		public get scaleX():number
		{
			return gf.utils.Scale.getScaleX(this);
		}



		public set scaleX(value:number)
		{
			gf.utils.Scale.setScaleX(this, value);
		}



		public get scaleY():number
		{
			return gf.utils.Scale.getScaleY(this);
		}



		public set scaleY(value:number)
		{
			gf.utils.Scale.setScaleY(this, value);
		}



		public set scaleXY(value:number)
		{
			gf.utils.Scale.setScaleXY(this, value);
		}



		public get left():number
		{
			return gf.utils.Align.left(this);
		}



		public get right():number
		{
			return gf.utils.Align.right(this);
		}



		public get top():number
		{
			return gf.utils.Align.top(this);
		}



		public get bottom():number
		{
			return gf.utils.Align.bottom(this);
		}



		public get key():string | PIXI.Texture
		{
			return this._key;
		}



		public set key(value:string | PIXI.Texture)
		{
			if (this._key == value) return;

			this._key = value;
			this.updateTexture();
		}



		public get frameName():string
		{
			return this._frameName;
		}



		public set frameName(value:string)
		{
			if (this._frameName == value) return;

			this._frameName = value;
			this.updateTexture();
		}
	}
}

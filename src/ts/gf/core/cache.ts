/// <reference path="../core/game.ts"/>
/// <reference path="../utils/frame.ts"/>
/// <reference path="../utils/framedata.ts"/>
/// <reference path="../utils/parser.ts"/>



module gf.core
{
	export class Cache
	{
		protected _images: { [key: string]: any };
		protected _textures: { [key: string]: any };
		protected _sounds: { [key: string]: any };
		protected _videos: { [key: string]: any };
		protected _json: { [key: string]: any };
		protected _svg: { [key: string]: any };
		protected _xml: { [key: string]: any };
		protected _bitmapFont: { [key: string]: any };
		protected _renderTextures: { [key: string]: any };

		public game: gf.core.Game;



		constructor(game: gf.core.Game)
		{
			this.game = game;

			this._images = {};
			this._textures = {};
			this._sounds = {};
			this._videos = {};
			this._json = {};
			this._svg = {};
			this._xml = {};
			this._bitmapFont = {};
			this._renderTextures = {};

			this.addDefaultImage();
		}



		/*
			Adds a default image to be used in special cases such as WebGL Filters. Is mapped to the key __default.
		*/
		private addDefaultImage(): void
		{
			let img = new Image();
			img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

			this._images["__default"] = {url: null, data: img};
			this._images["__default"].frame = new gf.utils.Frame(0,
				{
					frame: {x: 0, y: 0, w: 1, h: 1},
					sourceSize: {w: 1, h: 1}
				}, "__default", PIXI.utils.uid(), 1);
			this._images["__default"].frameData = new gf.utils.FrameData();
			this._images["__default"].frameData.addFrame(this._images["__default"].frame);

			PIXI.utils.BaseTextureCache["__default"] = new PIXI.BaseTexture(img, PIXI.SCALE_MODES.LINEAR);
			PIXI.utils.TextureCache["__default"] = new PIXI.Texture(PIXI.utils.BaseTextureCache["__default"]);

			this._textures["__default"] = PIXI.utils.TextureCache["__default"];
		}



		public addTextureAtlas(key: string, url: string, data: any, atlasData: any): void
		{
			this._images[key] = {url: url, data: data};

			PIXI.utils.BaseTextureCache[key] = new PIXI.BaseTexture(data, PIXI.SCALE_MODES.LINEAR, this.game.client.config.assetsResolution);
			PIXI.utils.TextureCache[key] = new PIXI.Texture(PIXI.utils.BaseTextureCache[key]);

			this._images[key].frameData = gf.utils.Parser.JSONDataHash(this.game, atlasData);
		}



		public addFrameData(key: string, data: any): void
		{
			if (!this._images[key]) return;

			this._images[key].frameData = gf.utils.Parser.JSONDataHash(this.game, data);
		}



		public addBitmapFont(key: string, url: string, data: any, xmlData: XMLDocument): void
		{
			this._images[key] = {url: url, data: data};

			PIXI.utils.BaseTextureCache[key] = new PIXI.BaseTexture(data, PIXI.SCALE_MODES.LINEAR, this.game.client.config.assetsResolution);
			PIXI.utils.TextureCache[key] = new PIXI.Texture(PIXI.utils.BaseTextureCache[key]);

			PIXI.extras.BitmapText.fonts[key] = gf.utils.Parser.BitmapFont(xmlData, key);

			this._bitmapFont[key] = PIXI.extras.BitmapText.fonts[key];
		}



		public addTexture(key: string, texture: PIXI.Texture): void
		{
			this._textures[key] = texture;
		}



		public addRenderTexture(key: string, texture: PIXI.RenderTexture): void
		{
			this._renderTextures[key] = texture;
		}



		public addJSON(key: string, url: string, data: any): void
		{
			this._json[key] = {url: url, data: data};
		}



		public addXML(key: string, url: string, data: any): void
		{
			this._xml[key] = {url: url, data: data};
		}



		public addSVG(key: string, url: string, data: any): void
		{
			this._svg[key] = {url: url, data: data};
		}



		public addImage(key: string, url: string, data: any): void
		{
			this._images[key] = {url: url, data: data};
			this._images[key].frame = new gf.utils.Frame(0,
				{
					frame: {x: 0, y: 0, w: data.width, h: data.height},
					sourceSize: {w: data.width, h: data.height}
				}, key, PIXI.utils.uid(), this.game.client.config.assetsResolution);
			this._images[key].frameData = new gf.utils.FrameData();
			this._images[key].frameData.addFrame(this._images[key].frame);

			PIXI.utils.BaseTextureCache[key] = new PIXI.BaseTexture(data, PIXI.SCALE_MODES.LINEAR, this.game.client.config.assetsResolution);
			PIXI.utils.TextureCache[key] = new PIXI.Texture(PIXI.utils.BaseTextureCache[key]);
		}



		public addSound(key: string, url: string, data: any, json?: any): void
		{
			this._sounds[key] =
				{
					url: url,
					data: data,
					json: json
				};
		}



		public addVideo(key: string, url: string): void
		{
			this._videos[key] = url;
		}



		public getSound(key: string): any
		{
			if (this._sounds[key])
			{
				return this._sounds[key];
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.cache.getSound: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getVideo(key: string): PIXI.Texture
		{
			if (this._videos[key])
			{
				return this._videos[key];
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.cache.getVideo: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getRenderTexture(key: string): PIXI.RenderTexture
		{
			if (this._renderTextures[key])
			{
				return this._renderTextures[key];
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getRenderTexture: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getImage(key: string): any
		{
			if (this._images[key])
			{
				return this._images[key].data;
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getImage: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getImageUrl(key: string): any
		{
			if (this._images[key])
			{
				return this._images[key].url;
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getImageUrl: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getSVG(key: string): any
		{
			if (this._svg[key])
			{
				return this._svg[key];
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getSVG: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getFrameData(key: string): gf.utils.FrameData
		{
			if (this._images[key])
			{
				return this._images[key].frameData;
			}

			return null;
		}



		public updateFrameData(key: string, frameData: gf.utils.FrameData): void
		{
			if (this._images[key])
			{
				this._images[key].frameData = frameData;
			}
		}



		public getFrameByIndex(key: string, frame: number): gf.utils.Frame
		{
			if (this._images[key])
			{
				return this._images[key].frameData.getFrame(frame);
			}

			return null;
		}



		public getFrameByName(key: string, frame: string): gf.utils.Frame
		{
			if (this._images[key])
			{
				return this._images[key].frameData.getFrameByName(frame);
			}

			return null;
		}



		public getFrame(key: string): gf.utils.Frame
		{
			if (this._images[key])
			{
				return this._images[key].frame;
			}

			return null;
		}



		public getTextureByFrameName(key: string, frame: string): PIXI.Texture
		{
			if (this._images[key] && this._images[key][frame])
			{
				let rect: PIXI.Rectangle = this.getFrameData(<string>key).getFrameByName(frame).frame;
				return new PIXI.Texture(PIXI.utils.TextureCache[<string>key], rect, rect.clone());
			}

			return null;
		}



		public getTextureFrame(key: string): gf.utils.Frame
		{
			if (this._textures[key])
			{
				return this._textures[key].frame;
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getTextureFrame: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getTexture(key: string): PIXI.Texture
		{
			if (this._textures[key])
			{
				return this._textures[key];
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getTexture: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getFrameCount(key: string): number
		{
			if (this._images[key])
			{
				return this._images[key].frameData.total;
			}

			return 0;
		}



		public checkJSON(key: string): boolean
		{
			return (this._json[key]) ? true : false;
		}



		public getJSON(key: string): any
		{
			if (this._json[key])
			{
				return this._json[key].data;
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getJSON: Invalid key: \"" + key + "\"");
				return null;
			}
		}



		public getXML(key: string): XMLDocument
		{
			if (this._xml[key])
			{
				return this._xml[key].data;
			}
			else
			{
				if (this.game.client.config.debug)
					logWarning("gf.core.Cache.getXML: Invalid key: \"" + key + "\"");
				return null;
			}
		}
	}
}

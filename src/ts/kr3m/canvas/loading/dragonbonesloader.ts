/// <reference path="../../canvas/animation/dragonbones.ts"/>
/// <reference path="../../canvas/loading/iloader.ts"/>
/// <reference path="../../canvas/loading/imageloader.ts"/>
/// <reference path="../../canvas/util/texturecachemap.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.loading
{
	export class DragonBonesLoader extends PIXI.AssetLoader implements kr3m.canvas.loading.ILoader
	{
		public atlas:any;
		public skeleton:any;
		public texture:PIXI.BaseTexture;

		public baseUrlAtlas:string;
		public baseUrlSkeleton:string;

		private key:string;
		private buildVersion:string;

		private textureUrl:string;



		constructor(
			key:string, skeletonJsonUrl:string, textureJsonUrl:string,
			buildVersion:string = "1.0", crossorigin:boolean = false)
		{
			super([skeletonJsonUrl, textureJsonUrl], !!crossorigin);

			this.key = key;
			this.buildVersion = buildVersion;

			this.baseUrlAtlas = textureJsonUrl.replace(/[^\/]*$/, '');
			this.baseUrlSkeleton = skeletonJsonUrl.replace(/[^\/]*$/, '');

			this.on("onProgress", (e:PIXI.Event) =>
			{
				var json:any = e.data.loader.json;
				if (e.data.loader.url == textureJsonUrl)
					this.atlas = this.isAtlasJson(json) ? this.prepareAtlas(json) : this.parseTextureJson(json);
				else
					this.skeleton = json;
			});


			this.on("onComplete", (e:PIXI.Event) =>
			{
				if (!this.texture.hasLoaded)
				{
					this.texture.addEventListener('loaded', () =>
					{
						this.atlas.meta.size = {w: this.texture.width, h: this.texture.height};
						this.emit('loaded', {loader: this});
					});
				}
				else
				{
					this.emit('loaded', {loader: this});
				}
			});

			kr3m.canvas.animation.DragonBones.data[this.key] = this;
		}



		private prepareAtlas(json:any):void
		{
			var texture:PIXI.Texture, baseTextureCached:boolean, id:string;
			var rAtlas:any = { frames: {}, meta: json.meta };
			var extReg:RegExp = /\.png|\.jpeg|\.jpg|\.gif/i;

			this.textureUrl = this.baseUrlAtlas + json.meta.image;

			for (var i in json.frames)
			{
				if (i.match(extReg) !== null)
				{
					id = i.replace(extReg, '');
					if (PIXI.TextureCache[i])
					{
						baseTextureCached = !!PIXI.BaseTextureCache[i];
						texture = PIXI.Texture.removeTextureFromCache(i);
						PIXI.TextureCache[id] = texture;
						if (baseTextureCached)
							PIXI.BaseTextureCache[id] = texture.baseTexture;
					}
					rAtlas.frames[id] = json.frames[i];
				}
				else
				{
					rAtlas.frames[i] = json.frames[i];
				}
			}

			return rAtlas;
		}



		private isAtlasJson(json:any):boolean
		{
			return json.frames && json.meta && json.meta.image;
		}



		private parseTextureJson(json:any):any
		{
			var atlasJson:any = {};
			var frames:any = {};
			var meta:any =
			{
				image: json.imagePath,
				scale: "1",
				format: "RGBA8888"
			};

			this.textureUrl = this.baseUrlAtlas + meta.image;
			this.texture = PIXI.BaseTexture.fromImage(this.baseUrlAtlas + meta.image);
			/*var textureUrl:string = this.baseUrlAtlas + meta.image;
			var image:PIXI.ImageLoader = new PIXI.ImageLoader(textureUrl, this.crossorigin);

			this.texture = image.texture.baseTexture;
			image.addEventListener('loaded', () =>
			{
				meta.size = {w: this.texture.width, h: this.texture.height};
				//this.emit('loaded', { content: image });
			});
			image.load();*/

			var subTextures:any[] = json.SubTexture;
			var subTexture:any, frame:any, rect:PIXI.Rectangle, name:string;
			for (var i:number = 0; i < subTextures.length; i++)
			{
				subTexture = subTextures[i];
				name = String(subTexture.name).trim();
				rect = new PIXI.Rectangle(subTexture.x, subTexture.y, subTexture.width, subTexture.height);
				frame =
				{
					filename: name,
					frame: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
					rotated: false,
					trimmed: false,
					spriteSourceSize: { x: 0, y: 0, w: rect.width, h: rect.height },
					sourceSize: { w: rect.width, h: rect.height }
				};
				PIXI.TextureCache[name] = new PIXI.Texture(this.texture, rect, rect.clone(), null);
				frames[name] = frame;
			}

			atlasJson.frames = frames;
			atlasJson.meta = meta;

			return atlasJson;
		}
	}
}

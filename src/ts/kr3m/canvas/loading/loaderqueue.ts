/// <reference path="../../canvas/loading/atlasloader.ts"/>
/// <reference path="../../canvas/loading/bitmapfontloader.ts"/>
/// <reference path="../../canvas/loading/dragonbonesloader.ts"/>
/// <reference path="../../canvas/loading/iloadable.ts"/>
/// <reference path="../../canvas/loading/iloader.ts"/>
/// <reference path="../../canvas/loading/imageloader.ts"/>
/// <reference path="../../canvas/loading/jsonloader.ts"/>
/// <reference path="../../canvas/loading/spritesheetloader.ts"/>



module kr3m.canvas.loading
{
	export class LoaderQueue implements kr3m.canvas.loading.ILoader
	{
		public buildVersion:string;

		private loaders:kr3m.canvas.loading.ILoader[];
		private numAssetsStarted:number;
		private numAssetsLoaded:number;



		constructor(buildVersion:string = '1.0')
		{
			this.buildVersion = buildVersion;
			this.loaders = [];
			this.numAssetsStarted = 0;
			this.numAssetsLoaded = 0;

			PIXI.EventTarget.mixin(this);
		}



		public assets(loadables:kr3m.canvas.loading.ILoadable[]):void
		{
			for (var i:number = 0; i < loadables.length; i++)
			{
				if (typeof this[loadables[i].type] == 'function')
					(<Function>this[loadables[i].type]).apply(this, [loadables[i].key].concat(loadables[i].urls));
			}
		}



		public atlas(
			key:string,
			url:string,
			crossorigin:boolean = false):kr3m.canvas.loading.AtlasLoader
		{
			var loader:kr3m.canvas.loading.AtlasLoader =
				new kr3m.canvas.loading.AtlasLoader(key, url, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public bitmapFont(
			key:string,
			url:string,
			crossorigin:boolean = false):kr3m.canvas.loading.BitmapFontLoader
		{
			var loader:kr3m.canvas.loading.BitmapFontLoader =
				new kr3m.canvas.loading.BitmapFontLoader(key, url, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public dragonBones(
			key:string,
			skeletonJsonUrl:string,
			atlasJsonUrl:string,
			crossorigin:boolean = false):kr3m.canvas.loading.DragonBonesLoader
		{
			var loader:kr3m.canvas.loading.DragonBonesLoader =
				new kr3m.canvas.loading.DragonBonesLoader(key, skeletonJsonUrl, atlasJsonUrl, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public image(
			key:string,
			url:string,
			crossorigin:boolean = false):kr3m.canvas.loading.ImageLoader
		{
			var loader:kr3m.canvas.loading.ImageLoader =
				new kr3m.canvas.loading.ImageLoader(key, url, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public json(
			key:string,
			url:string,
			crossorigin:boolean = false):kr3m.canvas.loading.JsonLoader
		{
			var loader:kr3m.canvas.loading.JsonLoader =
				new kr3m.canvas.loading.JsonLoader(key, url, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public spriteSheet(
			key:string,
			url:string,
			crossorigin:boolean = false):kr3m.canvas.loading.SpriteSheetLoader
		{
			var loader:kr3m.canvas.loading.SpriteSheetLoader =
				new kr3m.canvas.loading.SpriteSheetLoader(key, url, this.buildVersion, crossorigin);

			this.loaders.push(loader);

			return loader;
		}



		public load():void
		{
			if (this.hasLoaded())
				return;

			for (var i:number = this.numAssetsStarted; i < this.loaders.length; i++)
			{
				this.loaders[i].on('loaded', (e:PIXI.Event) =>
				{
					this.progress(e);
				});
				this.loaders[i].load();
				this.numAssetsStarted++;
			}
		}



		public hasLoaded():boolean
		{
			return this.numAssetsLoaded >= this.loaders.length;
		}



		private progress(e:PIXI.Event):void
		{
			this.numAssetsLoaded++;
			var total:number = this.loaders.length;
			this.dispatchEvent('progress',
			{
				loader: e.data.loader,
				loaded: this.numAssetsLoaded,
				total: total
			});

			if (this.numAssetsLoaded >= total)
				this.dispatchEvent('loaded', { loader: this });
		}



		public listeners:(eventName:string) => Function[];
		public emit:(eventName:string, data?:any) => boolean;
		public dispatchEvent:(eventName:string, data?:any) => boolean;
		public on:(eventName:string, fn: Function) => Function;
		public addEventListener:(eventName:string, fn: Function) => Function;
		public once:(eventName:string, fn: Function) => Function;
		public off:(eventName:string, fn: Function) => Function;
		public removeAllEventListeners:(eventName:string) => void;
	}
}

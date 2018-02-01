/// <reference path="../../canvas/loading/loaderqueue.ts"/>
/// <reference path="../../canvas/util/texturecachemap.ts"/>
/// <reference path="../../lib/pixi.ts"/>



module kr3m.canvas.app
{
	export class Application extends PIXI.Stage
	{
		public renderer:PIXI.PixiRenderer;
		public load:kr3m.canvas.loading.LoaderQueue;

		private buildVersion:string;
		private prevFrameTime:number;

		private firstRun:boolean;

		private paused:boolean;



		constructor(
			parentDomId:string, width:number, height:number,
			color:number = 0x0, buildVersion:string = "1.0",
			noWebGL:boolean = false, renderOptions:PIXI.PixiRendererOptions = null)
		{
			PIXI.dontSayHello = true;

			super(color);

			this.buildVersion = buildVersion;
			this.paused = false;
			this.firstRun = true;

			this.load = new kr3m.canvas.loading.LoaderQueue(this.buildVersion);

			this.renderer = (!noWebGL) ? PIXI.autoDetectRenderer(width, height, renderOptions) : new PIXI.CanvasRenderer(width, height, renderOptions);

			document.getElementById(parentDomId).appendChild(this.renderer.view);

			this.modifyPixi();
		}



		public pause():void
		{
			this.paused = true;
		}



		public resume():void
		{
			this.paused = false;
		}



		public getBuildVersion():string
		{
			return this.buildVersion;
		}



		public setBuildVersion(value:string):void
		{
			this.load.buildVersion = this.buildVersion = value;
		}



		private runAtFirst():void
		{
			this.prevFrameTime = Date.now();
			requestAnimFrame(() => { this.tick(); });
			this.firstRun = false;
		}



		public run():void
		{
			if (this.firstRun)
				this.runAtFirst();
		}



		private tick():void
		{
			requestAnimFrame(() => { this.tick(); });

			var now = Date.now();
			if (!this.paused)
			{
				dragonBones.animation.WorldClock.clock.advanceTime((now - this.prevFrameTime) / 1000);
				this.update();
				this.renderer.render(this);
			}
			this.prevFrameTime = now;
		}



		public update():void {}



		private modifyPixi():void
		{
			var textureFromImageFn:Function = PIXI.Texture.fromImage;

			PIXI.Texture.fromImage = (imageUrl:string, crossorigin?:boolean, scaleMode?:PIXI.scaleModes) =>
			{
				var hasExtension:boolean = imageUrl.match(/.png|.jpeg|.jpg|.gif/i) !== null;
				if (hasExtension) imageUrl += '?_=' + this.buildVersion;

				var texture:PIXI.Texture = textureFromImageFn(imageUrl, crossorigin, scaleMode);

				var key:string = kr3m.canvas.util.TextureCacheMap.getKeyByUrl(imageUrl);
				if (key && !texture.baseTexture.hasLoaded) PIXI.Texture.addTextureToCache(texture, key);

				return texture;
			};
		}
	}
}

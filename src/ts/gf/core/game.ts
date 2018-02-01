/// <reference path="../constants.ts"/>
/// <reference path="../core/cache.ts"/>
/// <reference path="../core/config.ts"/>
/// <reference path="../core/loader.ts"/>
/// <reference path="../core/overlays.ts"/>
/// <reference path="../core/scale.ts"/>
/// <reference path="../core/screens.ts"/>
/// <reference path="../core/sounds.ts"/>
/// <reference path="../core/stage.ts"/>
/// <reference path="../display/container.ts"/>
/// <reference path="../display/idisplay.ts"/>
/// <reference path="../display/sprite.ts"/>
/// <reference path="../display/text.ts"/>
/// <reference path="../model/episodes.ts"/>
/// <reference path="../model/levels.ts"/>
/// <reference path="../model/lives.ts"/>
/// <reference path="../model/user.ts"/>
/// <reference path="../utils/render.ts"/>
/// <reference path="../utils/resolution.ts"/>
/// <reference path="../utils/storage.ts"/>



module gf.core
{
	export class Game extends PIXI.utils.EventEmitter
	{
		private _client: Client;
		private _isFocused: boolean;

		public canvas: HTMLCanvasElement;
		public cache: gf.core.Cache;
		public episodes: gf.model.Episodes;
		public levels: gf.model.Levels;
		public loader: gf.core.Loader;
		public overlays: gf.core.Overlays;
		public renderer: PIXI.CanvasRenderer | PIXI.WebGLRenderer;
		public renderState: number;
		public scale: gf.core.Scale;
		public screens: gf.core.Screens;
		public sounds: gf.core.Sounds;
		public stage: gf.core.Stage;
		public storage: gf.utils.Storage;
		public ticker: PIXI.ticker.Ticker;
		public user: gf.model.User;



		constructor(client: Client)
		{
			super();

			this._client = client;
			this._isFocused = true;

			this.setCanvas();
			this.setRenderer();

			this.user = new gf.model.User(this);
			this.cache = new gf.core.Cache(this);
			this.loader = new gf.core.Loader(this);
			this.scale = new gf.core.Scale(this);
			this.stage = new gf.core.Stage(this);
			this.storage = new gf.utils.Storage(this);
			this.episodes = new gf.model.Episodes(this);
			this.levels = new gf.model.Levels(this);

			this.screens = new gf.core.Screens(this);
			this.overlays = new gf.core.Overlays(this);
			this.sounds = new gf.core.Sounds(this);

			this.ticker = PIXI.ticker.shared;
		}



		protected run(): void
		{
			this.user.progress = new gf.model.Progress(this);
			this.user.lives = new gf.model.Lives(this);

			this.screens.init();
			this.stage.addFooter();
			this.stage.addHeader();
			this.overlays.init();
			this.scale.init();
			this.episodes.init();

			this.levels.init();

			this.storage.getData();
			this.client.config.onRun(this);

			this.emit(gf.RUNNING);
		}



		protected setCanvas(): void
		{
			if (document.hidden !== undefined)	//	IE10 | FF20+
				document.addEventListener("visibilitychange", (e: Event) => this.onVisibilityChange(e));
			else if (document["mozHidden"] !== undefined)	//	Older FF Versions (?)
				document.addEventListener("mozvisibilitychange", (e: Event) => this.onVisibilityChange(e));
			else if (document["webkitHidden"] !== undefined)	//	Chrome
				document.addEventListener("webkitvisibilitychange", (e: Event) => this.onVisibilityChange(e));
			else if (document["msHidden"] !== undefined)	//	IE 4-6
				document.addEventListener("msvisibilitychange", (e: Event) => this.onVisibilityChange(e));
			else if (document["onfocusin"] !== undefined)	//	IE7-9
				document["onfocusin"] = document["onfocusout"] = (e: Event) => this.onVisibilityChange(e);
			else	//	All others:
				window.onpageshow = window.onpagehide = window.onfocus = window.onblur = (e: Event) => this.onVisibilityChange(e);

			this.canvas = <HTMLCanvasElement>document.getElementById(this.client.config.canvasDomId);

			setInterval(() => this.onVisibilityChange(), 1000);
		}



		protected onVisibilityChange(e: Event = null): void
		{
			if (e && e.type && (e.type === "pagehide" || e.type === "blur" || e.type === "pageshow" || e.type === "focus"))
			{
				if (e.type === "pagehide" || e.type === "blur")
				{
					this.blur();
				}
				else if (e.type === "pageshow" || event.type === "focus")
				{
					this.focus();
				}

				return;
			}

			if (document.hidden || document["mozHidden"] || document["msHidden"] || document["webkitHidden"])
				this.blur();
			else
				this.focus();
		}



		protected blur(): void
		{
			if (this._isFocused)
			{
				this._isFocused = false;
				this.emit(gf.BLUR);
			}
		}



		protected focus(): void
		{
			if (!this._isFocused)
			{
				this._isFocused = true;
				this.emit(gf.FOCUS);
				this.emit(gf.RESIZE);
			}
		}



		protected setRenderer(): void
		{
			PIXI.utils.skipHello();

			let options: PIXI.RendererOptions = {};
			options.antialias = false;
			options.autoResize = true;
			options.resolution = this.client.config.resolution;
			options.roundPixels = this.client.config.roundPixels;
			options.transparent = this.client.config.transparent;
			options.view = this.canvas;
			options.clearBeforeRender = true;

			PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
			PIXI.settings.CAN_UPLOAD_SAME_BUFFER = false;
			PIXI.settings.SPRITE_MAX_TEXTURES = 2;

			if (this.client.config.forceWebGL)
				this.renderer = new PIXI.WebGLRenderer(300, 200, options);
			else if (this.client.config.forceCanvas)
				this.renderer = new PIXI.CanvasRenderer(300, 200, options);
			else
				this.renderer = PIXI.autoDetectRenderer(300, 200, options);

			if (this.client.config.renderType === gf.RENDER_TYPE_ON_CHANGE)
				gf.utils.Render.onChange(this);

			PIXI.ticker.shared.add(this.update, this);
		}



		public start(): void
		{
			if (this.client.config.useCAS)
			{
				this.user.getLoginStatus(() => this.run());
			}
			else
			{
				this.run();
			}
		}



		public resize(): void
		{
			this.emit(gf.RESIZE);
		}



		public update(): void
		{
			if (gf.utils.Render.type === gf.RENDER_TYPE_ON_CHANGE)
			{
				if (this.renderState != 1)
				{
					this.renderer.render(this.stage);
					this.renderState = 1;
				}
			}
			else
			{
				this.renderer.render(this.stage);
			}
		}



		public get height(): number
		{
			return this.scale.height;
		}



		public get width(): number
		{
			return this.scale.width;
		}



		public get scaleX(): number
		{
			return this.stage.scaleX;
		}



		public get scaleY(): number
		{
			return this.stage.scaleY;
		}



		public get client(): Client
		{
			return this._client;
		}



		public get landscape(): boolean
		{
			return this.scale.isLandscape;
		}



		public get portrait(): boolean
		{
			return !this.landscape;
		}



		public get isFocused(): boolean
		{
			return this._isFocused;
		}
	}
}

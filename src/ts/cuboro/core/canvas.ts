module cuboro.core
{
	export class Canvas
	{
		private static instance: cuboro.core.Canvas;

		private _isPaused: boolean;
		private _isRunning: boolean;
		private _onUpdate: (elapsed: number) => void;

		public game: gf.core.Game;
		public renderer: THREE.WebGLRenderer;
		public view: HTMLCanvasElement;



		constructor(game: gf.core.Game, onUpdate: (elapsed: number) => void)
		{
			this.game = game;
			this._onUpdate = onUpdate;
			this._isRunning = false;

			this.view = <HTMLCanvasElement>document.getElementById("playground");

			if ((PIXI.utils.isMobile.tablet || PIXI.utils.isMobile.phone) && !navigator["isCocoonJS"])
			{
				$(window).on("focus", () =>
				{
					$(this.view).hide();
					setTimeout(() =>
					{
						$(this.view).show();
					}, 100);
				});
			}

			PIXI.ticker.shared.add(() => this.onTick(), this);

			let rendererParamaters: THREE.WebGLRendererParameters = {};
			rendererParamaters.canvas = this.view;
			rendererParamaters.alpha = true;
			rendererParamaters.antialias = this.game.client.config.useAntiAlias;
			rendererParamaters.preserveDrawingBuffer = true;

			this.renderer = new THREE.WebGLRenderer(rendererParamaters);
			this.renderer.autoClear = true;
		}



		public static getInstance(game: gf.core.Game, onUpdate: (elapsed: number) => void): cuboro.core.Canvas
		{
			if (!this.instance)
			{
				this.instance = new cuboro.core.Canvas(game, onUpdate);
			}
			else
			{
				this.instance._onUpdate = onUpdate;
			}

			return this.instance;
		}



		protected onTick(): void
		{
			if (!this._isRunning || this._isPaused)
				return;
			this._onUpdate(PIXI.ticker.shared.elapsedMS);
		}



		public pause(): void
		{
			this._isPaused = true;
		}



		public resume(): void
		{
			this._isPaused = false;
		}



		public start(): void
		{
			if (this._isRunning)
				return;

			this._isRunning = true;
			this.resume();
			this.onResize();
		}



		public stop(): void
		{
			if (!this._isRunning)
				return;

			this._isRunning = false;
			this.pause();
			this.renderer.clear();
		}



		public onResize(): void
		{
			let resolution: number = 1;

			if (this.game.renderer.resolution > 1)
				resolution = this.game.client.config.assetsResolution;

			this.renderer.setSize(this.game.scale.parentWidth * resolution, this.game.scale.parentHeight * resolution);
			this.view.style.width = this.game.scale.styleSize.x + 'px';
			this.view.style.height = this.game.scale.styleSize.y + 'px';
		}
	}
}

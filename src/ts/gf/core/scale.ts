/// <reference path="game.ts"/>



module gf.core
{
	export class Scale extends PIXI.utils.EventEmitter
	{
		private _lastMaxHeight: number = 0;
		private _orientation: number = 0;
		private _wasLandscape: boolean;

		public game: gf.core.Game;



		constructor(game: gf.core.Game)
		{
			super();

			this.game = game;

			this._orientation = 0;
		}



		public init(): void
		{
			$(window).on("orientationchange resize", () =>
			{
				setTimeout(() =>
				{
					// delayed call, so it is blocked in background
					// see https://bugs.webkit.org/show_bug.cgi?id=154819
					// further delay to prevent some timing issues
					this.checkOrientation();

					if ((PIXI.utils.isMobile.tablet || PIXI.utils.isMobile.phone) && !navigator["isCocoonJS"])
						this.setMaxHeight(0);
				}, 500);

				this.checkOrientation();
			});

			let isIframe = false;
			try
			{
				if (top.location.href != window.location.href)
				{
					isIframe = true;
				}
			}
			catch (e)
			{
			}

			if ((PIXI.utils.isMobile.tablet || PIXI.utils.isMobile.phone) && !navigator["isCocoonJS"] && !isIframe)
			{
				$(window).on("focus", () =>
				{
					$(this.game.canvas).hide();

					setTimeout(() =>
					{
						$(this.game.canvas).show();
						this.checkOrientation();
						this.setMaxHeight(0);
					}, 100);
				});

				this.setMaxHeight(0);
			}

			this.checkOrientation();
		}



		private getScreenOrientation(): number
		{
			let screen: Screen = window.screen;
			let orientation = screen["orientation"] || screen["mozOrientation"] || screen["msOrientation"];

			if (orientation && typeof orientation.type === "string")
			{
				return (orientation.type.indexOf("portrait") != -1) ? 0 : 90
			}
			else if (typeof orientation === "string")
			{
				return (orientation.indexOf("portrait") != -1) ? 0 : 90
			}

			if (window.matchMedia)
			{
				if (window.matchMedia("(orientation: portrait)").matches)
				{
					return 0;
				}
				else if (window.matchMedia("(orientation: landscape)").matches)
				{
					return 90;
				}
				else
				{
					return (this.height > this.width) ? 0 : 90;
				}
			}

			return (this.height > this.width) ? 0 : 90;
		}



		private checkOrientation(): void
		{
			this._orientation = this.getScreenOrientation();

			if (this._wasLandscape && this.isPortrait)
			{
				this.emit(gf.PORTRAIT, this._orientation, false, true);
			}
			else if (!this._wasLandscape && this.isLandscape)
			{
				this.emit(gf.LANDSCAPE, this._orientation, true, false);
			}

			this._wasLandscape = this.isLandscape;

			this.updateSize();
		}



		private updateSize(): void
		{
			this.game.renderer.resize(this.parentWidth, this.parentHeight);
			this.game.resize();

			// Fix for iOS bug CR-428
			window.scrollTo(window.scrollX, 0);
		}



		/*
			height:100% does not work in mobile safary because div is resizsed without
			taking url bar into account.
			fix this by setting "max-height" to window.innherHeight
			@param count
		*/
		public setMaxHeight(count: number): void
		{
			if (window.innerHeight)
			{
				if (this._lastMaxHeight != window.innerHeight)
				{
					this._lastMaxHeight = window.innerHeight;
					let element: HTMLElement = document.getElementById("kr3m");

					if (element)
					{
						element.style.maxHeight = "" + this._lastMaxHeight + "px";
						this.updateSize();
					}
				}

				if (count < 10)
				{
					setTimeout(() =>
						{
							//continue checking for 2 seonds becase window.innerHeight may change later
							this.setMaxHeight(count + 1);
						},
						200);
				}
			}
		}



		public get styleSize(): PIXI.Point
		{
			return new PIXI.Point(this.parentWidth, this.parentHeight);
		}



		public get isPortrait(): boolean
		{
			return this.width < this.height;
		}



		public get isLandscape(): boolean
		{
			return !this.isPortrait;
		}



		public get parentWidth(): number
		{
			if (navigator["isCocoonJS"]) return window.innerWidth;
			return $(this.game.canvas.parentElement).width();
		}



		public get parentHeight(): number
		{
			if (navigator["isCocoonJS"]) return window.innerHeight * window.devicePixelRatio;
			return $(this.game.canvas.parentElement).height();
		}



		public get width(): number
		{
			let isPortrait: boolean = this.parentWidth < this.parentHeight;
			if (!isPortrait && this.parentHeight < 321 || (isPortrait && this.parentWidth < 321))
			{
				this.game.stage.scaleX = this.game.stage.scaleY = 1 / 1.5;
				return this.parentWidth * 1.5;
			}

			this.game.stage.scaleX = this.game.stage.scaleY = 1;
			return this.parentWidth;
		}



		public get height(): number
		{
			let isPortrait: boolean = this.parentWidth < this.parentHeight;
			if (!isPortrait && this.parentHeight < 321 || (isPortrait && this.parentWidth < 321))
			{
				this.game.stage.scaleX = this.game.stage.scaleY = 1 / 1.5;
				return this.parentHeight * 1.5;
			}

			this.game.stage.scaleX = this.game.stage.scaleY = 1;
			return this.parentHeight;
		}
	}
}

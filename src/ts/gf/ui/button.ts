/// <reference path="../display/container.ts"/>



module gf.ui
{
	export class Button extends gf.display.Container
	{
		protected _isEnabled: boolean;
		protected _isOver: boolean;
		protected _currentState: string;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.addListeners();

			this.buttonMode = true;
			this.interactive = true;

			this._currentState = gf.OUT;
			this._isEnabled = true;
		}



		protected addListeners(): void
		{
			// @see: https://github.com/pixijs/pixi.js/pull/3963
			const usePointer = parseInt(PIXI.VERSION.split(".").join("")) < 452;

			this.on(usePointer ? "mouseover pointerover" : "mouseover", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._isOver = true;
				this._currentState = gf.OVER;
				this.setState(this._currentState);
				this.over(e);
				this.emit(gf.OVER, e);
			});

			this.on(usePointer ? "mouseout pointerout" : "mouseout", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._isOver = false;
				this._currentState = gf.OUT;
				this.setState(this._currentState);
				this.out(e);
				this.emit(gf.OUT, e);
			});

			this.on(usePointer ? "mousedown pointerdown touchstart" : "mousedown touchstart", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._isOver = true;
				this._currentState = gf.DOWN;
				this.setState(this._currentState);
				this.down(e);
				this.emit(gf.DOWN, e);
			});

			this.on(usePointer ? "mouseup pointerup" : "mouseup", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._currentState = this._isOver ? gf.OVER : gf.UP;
				this.setState(this._currentState);
				this.up(e);
				this.emit(gf.UP, e);
			});

			//touchend is processed differently then mouseUp.
			//on PC, we want button to keep "over" state on mouseup.
			//on mobile, we get back to "up" state on touchend.
			this.on("touchend", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._currentState = gf.UP;
				this.setState(this._currentState);
				this.up(e);
				this.emit(gf.UP, e);
			});

			this.on(usePointer ? "mouseupoutside pointerupoutside touchendoutside" : "mouseupoutside touchendoutside", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._isOver = false;
				this._currentState = gf.UP;
				this.setState(this._currentState);
				this.upOutside(e);
				this.emit(gf.UP, e);
			});

			this.on("click", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this.click(e);
				this.emit(gf.CLICK, e);
			});

			//tap is processed differently then click.
			//on PC, we want button to keep "over" state on click.
			//on mobile, we get back to "up" state on tap.
			this.on("tap", (e: PIXI.interaction.InteractionEvent) =>
			{
				if (!this._isEnabled) return;
				this._isOver = false;
				this._currentState = gf.UP;
				this.setState(this._currentState);
				this.click(e);
				this.emit(gf.CLICK, e);
			});
		}



		protected setState(state: string): void
		{
		}



		protected over(e: PIXI.interaction.InteractionEvent): void
		{
		}



		protected out(e: PIXI.interaction.InteractionEvent): void
		{
		}



		protected down(e: PIXI.interaction.InteractionEvent): void
		{
		}



		protected up(e: PIXI.interaction.InteractionEvent): void
		{
		}



		protected upOutside(e: PIXI.interaction.InteractionEvent): void
		{
		}



		protected click(e: PIXI.interaction.InteractionEvent): void
		{
		}



		public enable(): void
		{
			this.interactive = true;
			this.buttonMode = true;
			this._isEnabled = true;
			this.emit(gf.ENABLE);
		}



		public disable(): void
		{
			this.interactive = false;
			this.buttonMode = false;
			this._isEnabled = false;
			this.emit(gf.DISABLE);
		}



		public get currentState(): string
		{
			return this._currentState;
		}



		public get isOver(): boolean
		{
			return this._isOver;
		}



		public get isEnabled(): boolean
		{
			return this._isEnabled;
		}



		public set isEnabled(value: boolean)
		{
			(value) ? this.enable() : this.disable();
		}
	}
}

/// <reference path="../display/container.ts"/>



module gf.screens
{
	export class Screen extends gf.display.Container
	{
		protected _isActive: boolean;
		protected _isInitialized: boolean;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.visible = false;

			this._isActive = false;
			this._isInitialized = false;
		}



		protected init(): void
		{
		}



		public transitionIn(): void
		{
			if (!this._isInitialized)
			{
				this.init();
				this._isInitialized = true;
				this.emit(gf.INITIALIZED);
			}

			this._isActive = true;

			this.alpha = 0;
			this.visible = true;

			TweenMax.to(this, 0.15, {alpha: 1, onComplete: () => this.transitionInComplete()});

			this.emit(gf.TRANSITION_IN);

			this.onResize();
		}



		public transitionOut(): void
		{
			this.emit(gf.TRANSITION_OUT);

			this._isActive = false;
			this.interactive = false;

			TweenMax.to(this, 0.15, {alpha: 0, onComplete: () => this.transitionOutComplete()});
		}



		public transitionInComplete(): void
		{
			this.emit(gf.TRANSITION_IN_COMPLETE);
			this.interactive = true;
		}



		public transitionOutComplete(): void
		{
			this.visible = false;
			this.emit(gf.TRANSITION_OUT_COMPLETE);
		}



		public get isActive(): boolean
		{
			return this._isActive;
		}



		public get isInitialized(): boolean
		{
			return this._isInitialized;
		}
	}
}

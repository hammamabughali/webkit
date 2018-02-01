module gf.utils
{
	export class Timer extends PIXI.utils.EventEmitter
	{
		private _duration: number;
		private _elapsed: number;
		private _isRunning: boolean;
		private _paused: boolean;
		private _timerId: number;

		public game: gf.core.Game;



		constructor(game: gf.core.Game)
		{
			super();

			this.game = game;

			this._duration = 0;
			this._elapsed = 0;
			this._paused = false;
		}



		private tick(): void
		{
			this._elapsed += 100;

			if (this._duration - this._elapsed <= 0)
			{
				this.stop();
				this.emit(gf.TIMER);
				this.emit(gf.TIMER_COMPLETE);
				return;
			}

			if (this._elapsed % 1000 == 0)
				this.emit(gf.TIMER);

			this._timerId = setTimeout(() => this.tick(), 100);
		}



		private round(value: number): number
		{
			return parseInt(value.toString(), 10);
		}



		public pause(): gf.utils.Timer
		{
			if (this._paused) return;

			clearTimeout(this._timerId);

			this._paused = true;

			return this;
		}



		public resume(): gf.utils.Timer
		{
			if (!this._paused) return;

			this.start((this._duration - this._elapsed) / 1000);

			this._paused = false;

			return this;
		}



		//resume, keep elapsed and duration
		public resumeEx(): gf.utils.Timer
		{
			if (!this._paused) return;

			var e: number = this._elapsed;

			this.start(this._duration / 1000);

			this._elapsed = e;

			this._paused = false;

			this.emit(gf.TIMER, this.round(this._duration));

			return this;
		}



		public stop(): gf.utils.Timer
		{
			this._isRunning = false;
			this._paused = false;

			if (this._timerId)
				clearTimeout(this._timerId);

			return this;
		}



		public restart(): gf.utils.Timer
		{
			this.stop().start(this._duration * 0.001);

			return this;
		}



		/*
			Stars the timer
			@param duration Duration of the time in seconds
		*/
		public start(duration: number): gf.utils.Timer
		{
			if (this._isRunning) this.stop();
			this._isRunning = true;
			this._duration = duration * 1000;
			this._elapsed = 0;
			this._timerId = setTimeout(() => this.tick(), 100);
			this.emit(gf.TIMER, this.round(duration));

			return this;
		}



		/**
		* Get the duration in seconds
		* @returns {number}
		*/
		public get duration():number
		{
			return this._duration;
		}



		/*
			Get the elapsed seconds
			@returns {number}
		*/
		public get elapsed(): number
		{
			return this.round(this._elapsed * 0.001);
		}



		/*
			Get the elapsed seconds, including frational part
			@returns {number}
		*/
		public get elapsedEx(): number
		{
			return this._elapsed * 0.001;
		}



		/*
			Set the elapsed seconds
		*/
		public set elapsed(value: number)
		{
			this._elapsed = value * 1000;
		}



		/*
			Get the seconds left
			@returns {number}
		*/
		public get left(): number
		{
			return this.round(this._duration * 0.001 - this.elapsed);
		}



		public get paused(): boolean
		{
			return this._paused;
		}



		public get isRunning(): boolean
		{
			return this._isRunning;
		}
	}
}

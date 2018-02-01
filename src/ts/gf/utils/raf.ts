module gf.utils
{
	export class RAF
	{
		private _isRunning:boolean;
		private _isSetTimeout:boolean;
		private _onLoop:(time:number) => void;
		private _onUpdate:() => void;
		private _timeOutID:number;



		constructor(onUpdate:() => void)
		{
			this._onUpdate = onUpdate;

			if (!window.requestAnimationFrame)
			{
				gf.VENDORS.forEach((value:string) =>
				{
					window.requestAnimationFrame = window[value + "RequestAnimationFrame"];
					window.cancelAnimationFrame = window[value + "CancelAnimationFrame"];
				});
			}

			this._isRunning = false;
			this._isSetTimeout = false;
			this._onLoop = null;
			this._timeOutID = null;
		}



		/*
			Update Funktion der requestAnimationFrame-Methode.
		*/
		private updateRAF():void
		{
			this._onUpdate();

			this._timeOutID = window.requestAnimationFrame(<FrameRequestCallback>this._onLoop);
		}



		/*
			Update Funktion der setTimeout-Methode
		*/
		private updateSetTimeout():void
		{
			this._onUpdate();

			this._timeOutID = window.setTimeout(this._onLoop, 0);
		}



		/*
			Startet die requestAnimationFrame- bzw., wenn nicht verfügbar,
			die setTimeout-Methode.
		*/
		public start():void
		{
			if (this._isRunning) return;

			this._isRunning = true;

			if (!window.requestAnimationFrame)
			{
				this._isSetTimeout = true;

				this._onLoop = () =>
				{
					return this.updateSetTimeout();
				};

				this._timeOutID = window.setTimeout(this._onLoop, 0);
			}
			else
			{
				this._isSetTimeout = false;

				this._onLoop = () =>
				{
					return this.updateRAF();
				};

				this._timeOutID = window.requestAnimationFrame(<FrameRequestCallback>this._onLoop);
			}
		}



		/*
			Stoppt die requestAnimationFrame- bzw. die setTimeout-Methode.
		*/
		public stop():void
		{
			if (!this._isRunning) return;

			if (this._isSetTimeout)
			{
				clearTimeout(this._timeOutID);
			}
			else
			{
				window.cancelAnimationFrame(this._timeOutID);
			}

			this._isRunning = false;
		}
	}
}

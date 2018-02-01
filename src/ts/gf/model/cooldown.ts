module gf.model
{
	export const COOLDOWN_CHANGE: string = "cooldownChange";
	export const COOLDOWN_COMPLETE: string = "cooldownComplete";



	export class Cooldown extends PIXI.utils.EventEmitter
	{
		protected cooldown: TimelineMax;
		protected cooldownRunning:boolean;
		protected currentValue:number;
		protected defaultValue:number;
		protected duration:number;
		protected maxValue:number;
		protected storageToken:string;
		protected timeLeft:number;
		protected timestamp:number;

		public game: gf.core.Game;



		constructor(game: gf.core.Game, duration:number, maxValue:number, storageToken:string, defaultValue?:number)
		{
			super();

			this.game = game;
			this.duration = duration;
			this.currentValue = maxValue;
			this.maxValue = maxValue;
			this.defaultValue = defaultValue ? defaultValue : maxValue;
			this.storageToken = storageToken;
		}



		public onStorageData(data?:any):void
		{
			this.timeLeft = 0;

			this.currentValue = data ? data[this.storageToken] : this.game.storage.getItem(this.storageToken);

			if (typeof this.currentValue == "undefined")
			{
				this.currentValue = this.defaultValue;
			}

			this.timestamp = data ? data[this.storageToken + "Timestamp"] : this.game.storage.getItem(this.storageToken + "Timestamp");

			if (typeof this.timestamp == "undefined" && this.currentValue < this.maxValue)
			{
				this.timestamp = this.currentTime;
				this.store();
			}

			if (this.currentValue < this.maxValue)
			{
				let toAdd:number = ((this.currentTime - this.timestamp) / this.duration) >> 0;

				this.currentValue += toAdd;

				if (toAdd > 0)
				{
					this.update();
					this.store();
				}
				this.timeLeft = this.duration - (this.currentTime - this.timestamp - toAdd * this.duration);
			}

			this.update();

			this.game.on(gf.BLUR, this.onBlur, this);
			this.game.on(gf.FOCUS, this.onFocus, this);
		}



		protected store():void
		{
			if (this.currentValue == this.maxValue - 1)
				this.timestamp = this.currentTime;

			this.game.storage.setItem([this.storageToken, this.storageToken + "Timestamp"], [this.currentValue, this.timestamp]);
		}



		protected onFocus():void
		{
			this.game.removeListener(gf.BLUR, this.onBlur, this);
			this.game.removeListener(gf.FOCUS, this.onFocus, this);

			this.game.storage.getData(false, (data:any) => this.onStorageData(data));
		}



		protected onBlur():void
		{
			this.stopCountdown();
		}



		protected startCountdown():void
		{
			if (this.cooldownRunning) return;

			this.cooldownRunning = true;
			this.cooldown = new TimelineMax({repeat: -1}).addCallback(() =>
			{
				this.timeLeft -= 1000;
				this.updateCountdown();
			}, 1);

			this.updateCountdown();
		}



		protected stopCountdown():void
		{
			if (this.cooldownRunning)
			{
				this.cooldown.clear();
				this.cooldown.kill();
				this.cooldownRunning = false;
			}
		}



		protected updateCountdown():void
		{
			if (this.timeLeft <= 0)
			{
				this.timeLeft = 0;
				this.add();
			}

			this.emit(gf.model.COOLDOWN_CHANGE);
		}



		protected update():void
		{
			this.currentValue = Math.max(Math.min(this.currentValue, this.maxValue), 0);

			if (this.currentValue == this.maxValue)
			{
				this.emit(gf.model.COOLDOWN_CHANGE);
				this.emit(gf.model.COOLDOWN_COMPLETE);
				this.stopCountdown();
			}
			else
			{
				if (this.timeLeft == 0) this.timeLeft = this.duration;
				this.startCountdown();
				this.emit(gf.model.COOLDOWN_CHANGE);
			}
		}



		public add():void
		{
			this.game.storage.getData(false, () =>
			{
				this.currentValue++;
				this.store();
				this.update();
			});
		}



		public remove():void
		{
			this.game.storage.getData(false, () =>
			{
				this.currentValue--;
				this.store();
				this.update();
			});
		}



		public get currentTime():number
		{
			return new Date().getTime();
		}
	}
}

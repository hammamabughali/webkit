/// <reference path="../util/trysafe.ts"/>



module kr3m.async
{
	/*
		Etwas etwas umfangreichere Version von setInterval().
		Die Hauptunterschiede sind dass die Zeitdauern
		in Sekunden statt in Millisekunden angegeben
		werden (Nachkommastellen sind erlaubt) und dass,
		wo möglich, die Timer dereferenziert werden.
	*/
	export class Polling
	{
		private timer:any;
		private func:(delta?:number) => void;
		private interval:number;
		private lastRunTime:number;
		private boundTick:Function;



		/*
			Startet ein Polling, welches alle interval Sekunden die Funktion
			func ausführt. Die Funktion erhält optional einen Parameter delta
			übergeben, der angibt, wie viele Sekunden seit dem letzten Aufruf
			vergangen sind.
		*/
		constructor(interval:number, func:(delta?:number) => void, autoStart:boolean = true)
		{
			this.interval = interval * 1000;
			this.func = func;
			this.boundTick = this.tick.bind(this);

			if (autoStart)
				this.start();
		}



		private tick():void
		{
			var now = Date.now();
			var delta = (now - this.lastRunTime) / 1000;
			this.lastRunTime = now;

			kr3m.util.trySafe(this.func, delta);

			now = Date.now();
			var remaining = Math.max(0, this.interval - (now - this.lastRunTime));
			this.timer = setTimeout(this.boundTick, remaining);
			if (this.timer.unref)
				this.timer.unref();
		}



		public setInterval(interval:number):void
		{
			this.interval = interval * 1000;
			this.resetInterval();
		}



		public resetInterval():void
		{
			if (this.timer)
			{
				clearTimeout(this.timer);
				this.timer = setTimeout(this.boundTick, this.interval);
				if (this.timer.unref)
					this.timer.unref();
			}
		}



		public start():void
		{
			if (!this.timer)
			{
				this.lastRunTime = Date.now();
				this.timer = setTimeout(this.boundTick, this.interval);
				if (this.timer.unref)
					this.timer.unref();
			}
		}



		public stop():void
		{
			if (this.timer)
			{
				clearTimeout(this.timer);
				this.timer = null;
			}
		}
	}
}

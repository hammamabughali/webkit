/// <reference path="../async/slowdown.ts"/>



module kr3m.async
{
	export class SlowDownSpreadOut extends SlowDown
	{
		private lastCall = 0;
		private timeout:any;



		protected step():void
		{
			if (this.timeout)
			{
				clearTimeout(this.timeout);
				this.timeout = null;
			}

			if (this.queue.length == 0)
				return;

			var now = Date.now();
			var nextCall = this.lastCall + Math.ceil(this.interval / this.times);
			if (nextCall > now)
			{
				this.timeout = setTimeout(() => this.step(), nextCall - now);
				return;
			}

			var func = this.queue.shift();
			func();
			this.lastCall = now;

			if (this.queue.length > 0)
				this.timeout = setTimeout(() => this.step(), Math.ceil(this.interval / this.times));
		}
	}
}

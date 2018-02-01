/// <reference path="../async/slowdown.ts"/>



module kr3m.async
{
	export class SlowDownBurst extends SlowDown
	{
		private lastCalls:number[] = [];
		private current = 0;
		private timeout:any;



		constructor(protected times:number, protected interval:number)
		{
			super(times, interval);
			for (var i = 0; i < times; ++i)
				this.lastCalls.push(0);
		}



		protected step():void
		{
			if (this.timeout)
			{
				clearTimeout(this.timeout);
				this.timeout = null;
			}

			var now = Date.now();
			while (this.queue.length > 0)
			{
				if (now - this.lastCalls[this.current] <= this.interval)
					break;

				this.lastCalls[this.current] = now;
				this.current = (this.current + 1) % this.lastCalls.length;

				var func = this.queue.shift();
				func();
			}

			if (this.queue.length > 0)
			{
				var waitTime = this.lastCalls[this.current] + this.interval - now;
				this.timeout = setTimeout(() => this.step(), waitTime);
			}
		}
	}
}

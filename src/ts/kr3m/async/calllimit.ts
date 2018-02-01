/// <reference path="../model/eventdispatcher.ts"/>
/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		This class is similiar to a regular queue with a few subtle but
		important differences:
			- added calls may be performed simultaneously
			- later calls may be delay so there are never more than limit
			calls during the given period

		A typical usage example is external APIs that only allow a fixed
		number of requests in a given time frame to prevent flooding.
	*/
	export class CallLimit extends kr3m.model.EventDispatcher
	{
		// dispatched each time the flood threshold is reached
		public static readonly EVENT_FLOOD = "flood";

		// dispatched each time a call has finished and there are no pending calls remaining
		public static readonly EVENT_EMPTY = "empty";



		private timestamps:number[] = [];
		private pending:Callback[] = [];
		private timer:any;



		/**
			@param limit how many calls may be made during the timeframe
			@param periodDuration how long is the timeframe (in ms)
			@param floodThreshold if set this method will trigger a "flood"
				event each time the number of pending calls is equal or
				greater than floodThreshold
		*/
		constructor(
			private limit:number,
			private periodDuration:number,
			private floodThreshold = 0)
		{
			super();
		}



		private step():void
		{
			var now = Date.now();
			var threshold = now - this.periodDuration;
			this.timestamps = this.timestamps.filter(ts => ts >= threshold);
			while (this.timestamps.length < this.limit && this.pending.length > 0)
			{
				this.timestamps.push(now);
				this.pending.shift()();
			}

			if (this.floodThreshold && this.pending.length >= this.floodThreshold)
				this.dispatch(CallLimit.EVENT_FLOOD);

			if (this.pending.length == 0)
			{
				this.dispatch(CallLimit.EVENT_EMPTY);
			}
			else if (!this.timer)
			{
				var waitTime = this.periodDuration - (now - this.timestamps[0]) + 1;
				this.timer = setTimeout(() =>
				{
					this.timer = null;
					this.step();
				}, waitTime);
			}
		}



		public call(func:Callback):void
		{
			this.pending.push(func);
			this.step();
		}
	}
}

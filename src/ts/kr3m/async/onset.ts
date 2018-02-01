/// <reference path="../model/eventdispatcher.ts"/>
/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		This class waits for its trigger function to be
		callled. Then it waits for a given duration. If
		the trigger function is called again during that
		waiting duration, the wait time is reset. Only once
		the wait time has passed without the trigger function
		executing, the given listener functions are called.
		Optionally a maximum waiting time can be given.

		This class can be used to delay event triggered
		execution of code until the event dispatcher has
		settled into a stable state. For example, when an
		editbox' content changes Onset can be used to wait
		until the user stops typing.

		The listener functions are called with the data
		value of the most recent dispatch call for that
		event name.
	*/
	export class Onset extends kr3m.model.EventDispatcher
	{
		protected pending:{[eventName:string]:{initial:number, timer:any, data:any}} = {};



		/*
			delay is the waiting duration in ms. maxDelay
			is the maximum time (in ms) to wait before calling
			listener functions (set to 0 to disable it).
		*/
		constructor(
			public delay = 500,
			public maxDelay = 5000)
		{
			super();
		}



		private dispatchHelper(eventName:string):void
		{
			super.dispatch(eventName, this.pending[eventName].data);
			delete this.pending[eventName];
		}



		public dispatch(
			eventName:string, data?:any):void
		{
			if (!this.pending[eventName])
			{
				this.pending[eventName] =
				{
					initial : Date.now(),
					timer : setTimeout(this.dispatchHelper.bind(this, eventName), this.delay),
					data : data
				};
			}
			else
			{
				var delay = this.delay;
				if (this.maxDelay > 0)
					delay = Math.max(0, Math.min(delay, this.maxDelay - (Date.now() - this.pending[eventName].initial)));

				clearTimeout(this.pending[eventName].timer);
				this.pending[eventName].timer = setTimeout(this.dispatchHelper.bind(this, eventName), delay);
				this.pending[eventName].data = data;
			}
		}
	}
}

/// <reference path="../util/util.ts"/>



module kr3m.model
{
	export type EventListener = (data?:any) => void;



	export class EventDispatcher
	{
		private onListeners:{[eventName:string]:{context:any, listeners: EventListener[]}[]} = {};
		private onceListeners:{[eventName:string]:{context:any, listeners: EventListener[]}[]} = {};



		public on(
			eventName:string,
			listener:EventListener,
			context?:any):void
		{
			if (!this.onListeners[eventName])
				this.onListeners[eventName] = [];

			var meta = kr3m.util.Util.getBy(this.onListeners[eventName], "context", context, 0, true);
			if (meta)
			{
				meta.listeners.push(listener);
				return;
			}

			this.onListeners[eventName].push({context : context, listeners : [listener]});
		}



		public once(
			eventName:string,
			listener:EventListener,
			context?:any):void
		{
			if (!this.onceListeners[eventName])
				this.onceListeners[eventName] = [];

			var meta = kr3m.util.Util.getBy(this.onceListeners[eventName], "context", context, 0, true);
			if (meta)
			{
				meta.listeners.push(listener);
				return;
			}

			this.onceListeners[eventName].push({context : context, listeners : [listener]});
		}



		public off(eventName:string, listener:EventListener, context:object):void;

		public off(eventName:string, listener:EventListener):void;
		public off(eventName:string, context:object):void;
		public off(listener:EventListener, context:object):void;

		public off(eventName:string):void;
		public off(listener:EventListener):void;
		public off(context:object):void;

		public off():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var eventName = <string> first("string");
			var listener = <EventListener> first("function");
			var context = <object> first("object");

			var listenerTypes = [this.onListeners, this.onceListeners];
			var eventNames = eventName ? [eventName] : kr3m.util.Util.merge(Object.keys(this.onListeners), Object.keys(this.onceListeners));

			for (var i = 0; i < listenerTypes.length; ++i)
			{
				for (var j = 0; j < eventNames.length; ++j)
				{
					var metas = listenerTypes[i][eventNames[j]];
					if (!metas)
						continue;

					for (var k = 0; k < metas.length; ++k)
					{
						if (context && context !== metas[k].context)
							continue;

						if (listener)
							kr3m.util.Util.remove(metas[k].listeners, listener, true);
						else
							metas[k].listeners = [];
					}
				}
			}
		}



		public dispatch(
			eventName:string,
			data?:any,
			context?:object):void
		{
			if (this.onListeners[eventName])
			{
				for (var i = 0; i < this.onListeners[eventName].length; ++i)
				{
					for (var j = 0; j < this.onListeners[eventName][i].listeners.length; ++j)
						this.onListeners[eventName][i].listeners[j].call(context || this.onListeners[eventName][i].context || this, data);
				}
			}

			if (this.onceListeners[eventName])
			{
				for (var i = 0; i < this.onceListeners[eventName].length; ++i)
				{
					for (var j = 0; j < this.onceListeners[eventName][i].listeners.length; ++j)
						this.onceListeners[eventName][i].listeners[j].call(context || this.onceListeners[eventName][i].context || this, data);
				}
				this.onceListeners[eventName] = [];
			}
		}
	}
}

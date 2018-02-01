/// <reference path="../math/accumulable.ts"/>
/// <reference path="../math/interpolatable.ts"/>
/// <reference path="../pogo/easing.ts"/>

//# !ES5
//# ERROR: ES5 wird benötigt
//# /!ES5



module pogo
{
	export type TweenValues = {[field:string]:any};



	export class Tween<T>
	{
		protected target:T;

		private queue:Array<(delta:number) => number> = [];

		public easing = Easing.INOUTQUAD;



		constructor(target:T)
		{
			this.target = target;
		}



		public update(delta:number):void
		{
			while (this.queue.length > 0)
			{
				var func = this.queue[0];
				var remaining = func(delta);
				delta -= remaining;

				if (remaining <= 0)
					this.queue.shift();

				if (delta < 0)
					return;
			}
		}



		public call(func:() => void):Tween<T>
		{
			this.queue.push((delta:number) =>
			{
				func();
				return 0;
			});
			return this;
		}



		public stop():Tween<T>
		{
			this.queue = [];
			return this;
		}



		public wait(duration:number):Tween<T>
		{
			return this.to(duration, {});
		}



		public instant(values:TweenValues):Tween<T>
		{
			return this.to(0, values);
		}



		private snapshot(values:TweenValues):any
		{
			var from:TweenValues = {};
			for (var i in values)
			{
				from[i] = this.target[i];
//# DEBUG
				if (from[i] === undefined)
				{
					kr3m.util.Log.logError("target value", i, "is undefined");
					delete from[i];
					delete values[i];
				}
//# /DEBUG
			}
			return from;
		}



		private accumulate(from:TweenValues, values:TweenValues):void
		{
			for (var i in values)
			{
				if (from[i].accumulate)
				{
					if (!values[i].accumulate)
						values[i] = from[i].fromRaw(values[i]);
					values[i].accumulate(from[i]);
				}
				else
				{
					values[i] += from[i];
				}
			}
		}



		private trim(from:TweenValues, values:TweenValues):void
		{
			for (var i in values)
			{
				if (from[i] == values[i])
					delete values[i];
			}
		}



		public begin(
			duration:number,
			values:TweenValues,
			relative:boolean):Tween<T>
		{
			var from:TweenValues;
			var f = 0;
			this.queue.push((delta:number) =>
			{
				if (!from)
				{
					from = this.snapshot(values);
					if (relative)
						this.accumulate(from, values);
					this.trim(from, values);
				}

				f += duration ? delta / duration : 1;
				var f2 = this.easing(f);
				if (f > 0)
				{
					for (var i in values)
					{
						if (from[i].interpolated)
						{
							if (!values[i].interpolated)
								values[i] = from[i].fromRaw(values[i]);

							this.target[i] = from[i].interpolated(f2, values[i]);
						}
						else
						{
							this.target[i] = (values[i] - from[i]) * f2 + from[i];
						}
					}
				}
				return (1 - f) * duration;
			});
			this.update(0);
			return this;
		}



		public to(duration:number, values:TweenValues):Tween<T>
		{
			return this.begin(duration, values, false);
		}



		public delta(duration:number, values:TweenValues):Tween<T>
		{
			return this.begin(duration, values, true);
		}
	}
}

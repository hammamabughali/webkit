/// <reference path="../async/queue.ts"/>
/// <reference path="../lib/greensock.ts"/>
/// <reference path="../math/mathex.ts"/>



module kr3m.anim
{
	/*
		Wrapperklasse zum einfacheren / schöneren Arbeiten
		mit Greensock TweenMax.
	*/
	export class Tween
	{
		private target:Object;
		private queue = new kr3m.async.Queue(true);



		constructor(target:Object)
		{
			this.target = target;
		}



		public to(
			duration:number, values:any,
			onComplete?:() => void):kr3m.anim.Tween
		{
			this.queue.add((callback:() => void) =>
			{
				values.onComplete = onComplete ? () => {onComplete(); callback();} : callback;
				TweenMax.to(this.target, duration, values);
			});
			return this;
		}



		public kill():void
		{
			TweenMax.killTweensOf(this.target);
		}
	}
}

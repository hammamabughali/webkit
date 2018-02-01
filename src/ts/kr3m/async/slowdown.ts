/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Diese Klasse bremst (asynchrone) Funktionsaufrufe um zu
		verhindern, dass etwas zu oft ausgeführt wird.
	*/
	export abstract class SlowDown
	{
		protected queue:Array<() => void> = [];



		/*
			Bremst Funktionsaufrufe so ab, dass sie nicht häufiger
			als times mal pro interval (in ms) aufgerufen werden.
		*/
		constructor(protected times:number, protected interval:number)
		{
		}



		protected abstract step():void;



		public call(func:Callback):void
		{
			this.queue.push(func);
			this.step();
		}
	}
}

/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Dieser Klasse können eine oder mehrere Funktionen
		übergeben werden, welche nacheinander ausgeführt werden.
		Jede Funktion erhält einen einzelnen Parameter und zwar
		eine callback-Funktion, die sie aufrufen muss, wenn sie
		ihre Arbeit abgeschlossen hat.
	*/
	export class Queue
	{
		private pending:Array<(callback:Callback) => void> = [];
		private callbacks:Callback[] = [];
		private parallelCount:number;
		private runningCount:number = 0;
		private autoRun:boolean;



		/*
			Der autoRun Parameter gibt an, ob die Queue sofort
			damit anfangen soll, Funktionen auszuführen, die
			ihr hinzugefügt werden, oder ob sie erst warten
			soll, bis run() ausgeführt wird. Der parallelCount
			Parameter gibt an, wie viele Verarbeitungsstränge
			parallel laufen dürfen.
		*/
		constructor(autoRun = false, parallelCount = 1)
		{
			this.autoRun = autoRun;
			this.parallelCount = parallelCount;
		}



		public setParallelCount(parallelCount:number):void
		{
			this.parallelCount = parallelCount;
		}



		public getLength():number
		{
			return this.pending.length;
		}



//# ES5
		public get length():number
		{
			return this.pending.length;
		}
//# /ES5



		/*
			Löscht alle noch ausstehenden Aufgaben aus der
			Warteschlange. Auf bereits gestartete Aufgaben
			hat clear keinen Einfluß mehr.
		*/
		public clear():void
		{
			this.pending = [];
		}



		public push(func:(callback:Callback) => void):void
		{
			this.pending.push(func);
			if (this.autoRun)
				this.start();
		}



		public add(func:(callback:Callback) => void):void
		{
			this.push(func);
		}



		public unshift(func:(callback:Callback) => void):void
		{
			this.pending.unshift(func);
			if (this.autoRun)
				this.start();
		}



		/*
			Tut praktisch das gleiche wie add, allerdings mit
			ein paar kleinen Unterschieden. Erst einmal werden
			alle callbacks synchron aufgerufen, es wird nicht
			darauf gewartet, dass ein callback fertig abgearbeitet
			wurde bevor der nächste gestartet wird.

			Dann werden die callbacks erst aufgerufen, wenn alle
			Funktionen in der Queue abgearbeitet wurden. Das macht
			einen Unterschied, wenn mehrere Funktionen in der Queue
			parallel laufen dürfen - wird keine Paralellität
			verwendet, macht das keinen Unterschied.
		*/
		public addCallback(callback:Callback):void
		{
			this.callbacks.push(callback);
		}



		private callCallbacks():void
		{
			for (var i = 0; i < this.callbacks.length; ++i)
				this.callbacks[i]();
			this.callbacks = [];
		}



		public isRunning():boolean
		{
			return this.runningCount > 0;
		}



		public run():void
		{
			this.start();
		}



		private start():void
		{
			if (this.runningCount < this.parallelCount)
			{
				var currentFunc:Function = this.pending.shift();
				if (currentFunc)
				{
					++this.runningCount;
					currentFunc(() =>
					{
						--this.runningCount;
						this.start();
					});
				}
				else
				{
					if (this.runningCount == 0)
						this.callCallbacks();
				}
			}
		}
	}
}

/// <reference path="../types.ts"/>
/// <reference path="../util/sortedlist.ts"/>



module kr3m.async
{
	/*
		Dieser Klasse können eine oder mehrere Funktionen
		übergeben werden, welche nacheinander ausgeführt werden.
		Jede Funktion erhält einen einzelnen Parameter und zwar
		eine callback-Funktion, die sie aufrufen muss, wenn sie
		ihre Arbeit abgeschlossen hat.

		Im Gegensatz zur Queue kann jeder übergebenen Funktion
		eine Priorität mit übergeben werden.
	*/
	export class PriorityQueue
	{
		private pending = new kr3m.util.SortedList<{p:number, f:(callback:Callback) => void}>((a, b) => a.p - b.p);
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
		constructor(autoRun:boolean = false, parallelCount:number = 1)
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
			return this.pending.getLength();
		}



		public getItem(offset:number):{p:number, f:(callback:Callback) => void}
		{
			return this.pending.getItem(offset);
		}



//# ES5
		public get length():number
		{
			return this.pending.getLength();
		}
//# /ES5



		/*
			Löscht alle noch ausstehenden Aufgaben aus der
			Warteschlange. Auf bereits gestartete Aufgaben
			hat clear keinen Einfluß mehr.
		*/
		public clear():void
		{
			this.pending.clear();
		}



		/*
			Je höher der Wert priority, um so später wird die
			Funktion relativ zu anderen übergebenen Funktionen
			ausgeführt. Die Reihenfolge zweier Funktionen mit dem
			gleichen priority-Wert ist nicht deterministisch.
		*/
		public insert(func:(callback:Callback) => void, priority:number = 0):void
		{
			this.pending.insert({p:priority, f:func});
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
				var current = this.pending.shift();
				if (current)
				{
					++this.runningCount;
					current.f(() =>
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

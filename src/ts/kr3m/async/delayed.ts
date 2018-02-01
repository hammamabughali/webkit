/// <reference path="../types.ts"/>
/// <reference path="../util/trysafe.ts"/>



module kr3m.async
{
	/*
		Hilfsklasse, um Funktionsaufrufe zu verzögern, bis ein
		bestimmtes Ereignis eintritt. Die Funktionsaufrufe werden
		intern in einem Array gespeichert und bei Eintritt des
		Ereignisses, was durch einen Aufruf von execute() ausgelöst
		wird, der Reihe nach ausgeführt.
	*/
	export class Delayed
	{
		private done:boolean = false;
		private pendingCalls:{func:Callback, key:string, priority:number}[] = [];



		/*
			Führt alle verzögerten Funktionen tatsächlich aus
			und sort dafür, dass alle zukünftigen Funktionsaufrufe
			sofort passieren und nicht mehr verzögert werden.
		*/
		public execute():void
		{
			for (var i = 0; i < this.pendingCalls.length; ++i)
				kr3m.util.trySafe(this.pendingCalls[i].func);

			this.pendingCalls = [];
			this.done = true;
		}



		/*
			Ruft func sofort auf, wenn execute() bereits ausgeführt
			wurde oder stellt func in die Warteschlange bis execute()
			ausgeführt wird.

			Wenn ein (optionaler) exclusiveKey angegeben wird, wird
			automatisch sichergestellt, dass nur eine Funktion in der
			Warteschlange landen kann, die genau diesen exclusiveKey
			beim Aufruf von call() mitgegeben bekommen hat. Welche
			genau das sein wird, entscheidet exclusivePriority - je höher
			um so wahrscheinlicher, dass diese Funktion aufgerufen wird.
		*/
		public call(
			func:Callback,
			exclusiveKey?:string,
			exclusivePriority:number = 0):void
		{
			if (this.done)
			{
				func();
				return;
			}

			if (exclusiveKey)
			{
				for (var i = 0; i < this.pendingCalls.length; ++i)
				{
					if (this.pendingCalls[i].key == exclusiveKey)
					{
						if (this.pendingCalls[i].priority >= exclusivePriority)
							return;
						else
							this.pendingCalls.splice(i--, 1);
					}
				}
			}

			this.pendingCalls.push({func : func, key : exclusiveKey, priority : exclusivePriority});
		}



		/*
			Gibt true zurück, wenn execute() berreits ausgeführt
			wurde und die Funktionsaufrufe direkt ausgeführt werden
			oder false falls nicht.
		*/
		public isDone():boolean
		{
			return this.done;
		}



		/*
			Für den (selten benötigten) Fall, dass execute() bereits
			ausgeführt wurde aber man die Funktionsaufrufe wieder in
			die Warteschlange einreihen möchte, kann man reset()
			verwenden. Es muss dann ein weiterer Aufruf von execute()
			folgen, damit die Funktionen tatsächlich ausgeführt werden.
			Ist flush true, werden außerdem alle Funktionsaufrufe aus
			der Warteschlange gelöscht.
		*/
		public reset(flush:boolean = false):void
		{
			this.done = false;
			if (flush)
				this.pendingCalls = [];
		}
	}
}

/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.async
{
	/*
		Klasse um Bereiche im Code oder den Zugriff auf
		Resourcen zu beschränken. Es können immer nur
		eine begrenzte Anzahl von Funktionen gleichzeitig
		in einer CriticalSection sein. Alle weiteren
		müssen warten, bis eine der laufenden Funktionen
		die CriticalSection verlässt.

		Vorsicht: Gefahr durch Deadlocks, falls die Funktionen
		die CriticalSection niemals verlassen. Alle Funktionen
		in CriticalSections müssen auf jeden Fall genau einmal
		ihre exit-Funktion aufrufen, welche sie als Parameter
		erhalten haben.

		Das limit, wie viele Funktionen gleichzeitig in der
		CriticalSection sein können kann auch auf 0 gesetzt
		werden, dann ist es unbegrenzt. Dann kann die
		CriticalSection benutzt werden um zu prüfen, ob
		Funktionen sich noch darin befinden oder nicht, egal
		wie viele es sind.
	*/
	export class CriticalSection
	{
		private limit:number;
		private current:number = 0;
		private pending:Array<(exit:Callback) => void> = [];



		constructor(limit:number = 1)
		{
			this.limit = limit;
		}



		public setConcurrentLimit(limit:number):void
		{
			this.limit = limit;
		}



		private check():void
		{
			if (!this.isFull() && this.pending.length > 0)
			{
				++this.current;
				var func = this.pending.shift();
				func(this.exit.bind(this));
			}
		}



		/*
			Diese Funktion kann nicht direkt von anderen Klassen
			aufgerufen werden, sondern muss über den Parameter,
			den die Funktionen beim Aufruf von enter() bekommen
			ausgeführt werden.

			Das dient in erster Linie dazu, später stabilere
			Versionen von CriticalSection zu bauen, die Deadlocks
			minimieren und auch allgemein weniger fehleranfällig
			sind.
		*/
		private exit():void
		{
			--this.current;
			this.check();
		}



		/*
			Versucht die CriticalSection zu betreten. Falls
			sich bereits zu viele Funktionen in dieser
			befinden, wird statt dessen gewartet, bis eine andere
			Funktion die CriticalSection wieder verlässt. Dabei
			wird außerdem eine Warteschlange für alle Funktionen
			verwendet, die versuchen die CriticalSection zu
			betreten, während diese voll ist.

			callback wird aufgerufen sobald sie die CriticalSection
			betreten hat und erhält eine weitere Funktion exit als
			Parameter. Diese MUSS aufgerufen werden, wenn callback die
			CriticalSection verlässt, sonst kommt es zu Deadlocks.
		*/
		public enter(
			callback:(exit:Callback) => void):void
		{
			this.pending.push(callback);
			this.check();
		}



		/*
			Verhält sich genau so wie enter() mit dem Unterschied,
			dass der Versuch, die CriticalSection zu betreten
			abgebrochen wird, wenn er nach timeout Millisekunden
			nicht erfolgreich war. Statt callback wird dann timeoutCallback
			aufgerufen.
		*/
		public enterTimeout(
			callback:(exit:Callback) => void,
			timeout:number,
			timeoutCallback:Callback):void
		{
			if (timeout <= 0 && this.isFull())
				return timeoutCallback();

			if (!this.isFull())
				return this.enter(callback);

			var timerId:any = null;

			var helper = (exit:Callback) =>
			{
				clearTimeout(timerId);
				callback(exit);
			};
			this.pending.push(helper);

			timerId = setTimeout(() =>
			{
				kr3m.util.Util.remove(this.pending, helper);
				timeoutCallback();
			}, timeout);

			this.check();
		}



		/*
			Gibt true zurück, wenn bereits Funktionen "vor"
			der Critical-Section darauf warten, ausgeführt
			zu werden.
		*/
		public hasPending():boolean
		{
			return this.pending.length > 0;
		}



		/*
			Gibt true zurück, wenn sich aktuell überhaupt keine
			Funktion in der CriticalSection befindet und false
			sonst.
		*/
		public isEmpty():boolean
		{
			return this.current <= 0;
		}



		/*
			Gibt true zurück, wenn sich aktuell genug Funktionen
			in der CriticalSection befinden um diese zu voll
			auszufüllen und false sonst. Ist kein limit angegeben,
			gibt isFull niemals true zurück.
		*/
		public isFull():boolean
		{
			return this.limit > 0 && this.current >= this.limit;
		}



		public getCurrentCount():number
		{
			return this.current;
		}



		public getPendingCount():number
		{
			return this.pending.length;
		}



		public getLimit():number
		{
			return this.limit;
		}
	}
}

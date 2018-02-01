/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Die Join-Klasse stellt ein Hilfsmittel dar, um das Ende
		mehrerer asynchronen Vorgänge miteinander zu synchronisieren.
		Es gibt zwei prinzipielle Arten, join zu benutzen:

		1) Es wird zuerst die fork Methode aufgerufen, die dem join-
		Objekt mitteilt, daß ein neuer Teilvorgang begonnen hat. Sobald
		dieser beendet ist, wird die done Methode aufgerufen. Diese
		Methode ist fehleranfälliger, wenn z.B. nicht aufgerufen wird.
		Dafür kann sie an Stellen ohne Funktionsaufrufe verwendet werden,
		z.B. in Schleifen.

		2) Es wird eine asynchrone Funktion aufgerufen, welcher mit
		getCallback eine callback-Funktion übergeben wird. In diesem
		Fall werden fork und join implizit aufgerufen.

		Es können eine oder mehrere Callback-Methoden übergeben werden,
		welche aufgerufen werden, alle Teilvorgänge, die der join-Klasse
		bekannt sind, beendet wurden.
	*/
	export class Join
	{
		private counter:number = 0;
		private callbacks:Function[] = [];
		private results:{[resultName:string]:any} = {};



		/*
			Gibt den ersten Wert des gespeicherten Ergebnisses
			resultName zurück falls vorhanden, ansonsten undefined.
			Siehe auch kr3m.async.Join.getCallback
		*/
		public getResult(resultName:string|number):any
		{
			var results = this.results[resultName];
			if (results && results.length > 0)
				return results[0];
			return undefined;
		}



		/*
			Gibt alle Parameter des gespeicherten Ergebnisses
			resultName zurück falls vorhanden, ansonsten undefined.
			Siehe auch kr3m.async.Join.getCallback
		*/
		public getResults(resultName:string|number):any[]
		{
			return this.results[resultName] ? this.results[resultName] : undefined;
		}



		public getAllResults():{[resultName:string]:any}
		{
			return this.results;
		}



		public clearCallbacks(runBeforeRemove:boolean = false):void
		{
			if (runBeforeRemove)
			{
				for (var i = 0; i < this.callbacks.length; ++i)
					this.callbacks[i]();
			}
			this.callbacks = [];
		}



		private terminator(saveResultName:string|number, ...results:any[]):void
		{
			if (saveResultName !== undefined)
				this.results[saveResultName] = results;

			--this.counter;
			if (this.counter <= 0)
			{
				this.counter = 0;
				for (var i = 0; i < this.callbacks.length; ++i)
					this.callbacks[i]();
				this.callbacks = [];
			}
		}



		/*
			This method tells the Join that one (or count) new
			sub-process has been started. Once it has completed
			done() has to be called (for each started sub-process).
		*/
		public fork(count = 1):void
		{
			this.counter += count;
		}



		/*
			This method tells the Join that one of the previously
			started (with fork) sub-processes has completed.
			saveResultName can be used to store the results of that
			sub-process for later use.
		*/
		public done(saveResultName?:string|number, ...results:any[]):void
		{
			this.terminator(saveResultName, ...results);
		}



		/*
			Liefert eine callback Funktion zurück, welche an
			asynchrone Operationen übergeben werden kann und
			dem Join mitteilt, wenn diese asynchronen Funktionen
			abgeschlossen sind. Stellt praktisch eine Kombination
			aus fork und done dar.

			Wird ein Wert für saveResultName angegeben, dann wird
			das Ergebnis, welches die callback-Funktion erhält,
			gespeichert und kann kann mit getResult oder getResults
			abgefragt werden.
		*/
		public getCallback(
			saveResultName?:string|number):Callback
		{
			this.fork();
			return this.terminator.bind(this, saveResultName);
		}



		/*
			Mit dieser Methode kann eine callback Methode dem
			join übergeben werden, welche ausgeführt wird, wenn
			alle Teilvorgänge abgeschlossen sind. Wenn der join
			zum Zeitpunkt des Aufrufes von addCallback keine
			laufenden Vorgänge kennt, ruft er die übergebene
			callback-Funktion sofort auf.
		*/
		public addCallback(callback:Callback):void
		{
			if (this.counter > 0)
				this.callbacks.push(callback);
			else
				callback();
		}
	}
}

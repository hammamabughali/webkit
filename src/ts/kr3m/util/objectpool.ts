/// <reference path="../util/class.ts"/>



module kr3m.util
{
	/*
		Ein Pool von Objekten der gleichen Klasse. Soll verhindern,
		dass Instanzen der Klasse häufig erstellt und wieder gelöscht
		werden. Statt Objekte zu löschen werden sie in einem Array
		gespeichert und wenn das nächste Mal eine Instanz gebraucht
		wird, wird eines der gespeicherten Objekte zurück gegeben.
	*/
	export class ObjectPool<T>
	{
		private freeObjects:T[] = [];
		private objects:T[] = [];
		private params:any[];



		/*
			cls ist die Klasse von der neue Objekte bei Bedarf erzeugt
			werden sollen. rerunConstructor gibt an, ob der Contructor
			der Objekte erneut(!) ausgeführt werden soll, wenn das Objekt
			aus dem Pool genommen wird. Falls rerunConstructor false ist,
			wird der Constructor nur einmalig beim Erstellen des Objektes
			aufgerufen. Die optionalen params werden beim Aufruf des
			Constructors jedes Objektes des Pools mit übergeben.
		*/
		constructor(
			private cls:any,
			private rerunConstructor = false,
			...params:any[])
		{
			this.params = params;
		}



		/*
			Holt ein Objekt der Klasse T aus dem Pool und führt
			falls ObjectPool.rerunConstructor true ist den Constructor
			des Objektes neu aus wobei an die Parameterliste params
			angehängt wird.
		*/
		public acquire(...params:any[]):T
		{
			if (this.freeObjects.length == 0)
			{
				var obj = <T> Class.createInstanceOfClass(this.cls, this.params.concat(params));
				this.objects.push(obj);
				return obj;
			}
			else
			{
				var obj = this.freeObjects.pop();
				if (this.rerunConstructor)
					this.cls.apply(obj, this.params.concat(params));
				return obj;
			}
		}



		/*
			Gibt ein Objekt wieder frei, so dass es wo anders
			wiederverwendet werden kann.
		*/
		public release(obj:T):void
		{
			for (var i = 0; i < this.freeObjects.length; ++i)
			{
				if (this.freeObjects[i] == obj)
					return;
			}
			this.freeObjects.push(obj);
		}



		/*
			Eine Mischung aus acquire und release. Das zurück-
			gegebene Objekt wird im nächsten Ausführungsframe
			der Javascript-VM wieder freigegeben, d.h. es darf
			nirgends weiterverwendet werden - u.A. darf es auch
			nicht in asynchronen Funktionen und Callbacks benutzt
			werden. Ausschließlich in synchronen Funktionen sind
			mit temp() erhaltene Objekte sicher einsetzbar.
		*/
		public temp(...params:any[]):T
		{
			var obj = this.acquire(...params);
			setTimeout(() => this.release(obj), 0);
			return obj;
		}



		public getSize():number
		{
			return this.objects.length;
		}
	}
}

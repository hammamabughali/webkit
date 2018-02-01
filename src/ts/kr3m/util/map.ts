/// <reference path="../util/json.ts"/>



module kr3m.util
{
//# DEPRECATED kr3m.util.Map ist veraltet, bitte statt dessen die nativen Typescripttypen verwenden
	/*
		Bequemlichkeitsklasse zum Arbeiten mit assoziativen Arrays

		Bitte nicht mehr benutzen, diese Klasse wird demnächst auf
		deprecated gestellt.
	*/
	export class Map<T>
	{
		private items:any = {};



		/*
			Gibt das Element mit dem Schlüssel key zurück oder null,
			falls kein Element mit diesem Schlüssel gespeichert ist.
		*/
		public get(key:any):T
		{
			return this.contains(key) ? this.items[key] : null;
		}



		/*
			Gibt den Schlüssel des gegebenen Elementes zurück, falls
			vorhanden. Andernfalls wird null zurück gegeben. Vorsicht,
			diese Methode ist bei größeren Datenmengen sehr langsam.
		*/
		public getKeyByValue(value:T):any
		{
			for (var i in this.items)
				if (this.items[i] == value)
					return i;
			return null;
		}



		/*
			Speichert das Element value mit dem Schlüssel key.
		*/
		public set(key:any, value:T):void
		{
			this.items[key] = value;
		}



		/*
			Löscht das Element mit dem Schlüssel key.
		*/
		public unset(key:any):void
		{
			if (this.contains(key))
				delete this.items[key];
		}



		/*
			Gibt true zurück wenn keine Elemente enthalten sind
			und false falls mindestens ein Element enthalten ist.
		*/
		public isEmpty():boolean
		{
			for (var i in this.items)
				return false;
			return true;
		}



		/*
			Gibt das erste Element im Array zurück. Es werden
			keine Versprechen gemacht, welches Element das ist
			und / oder ob es jedes Mal das gleiche Element ist.
		*/
		public getFirstValue():T
		{
			for (var i in this.items)
				return this.items[i];
			return null;
		}



		/*
			Gibt den Schlüssel des ersten Elementes im Array zurück.
			Es werden keine Versprechen gemacht, welches Element das
			ist und / oder ob es jedes Mal das gleiche Element ist.
		*/
		public getFirstKey():any
		{
			for (var i in this.items)
				return i;
			return null;
		}



		/*
			Überprüft ob ein Element mit unter dem gegebenen
			Schlüssel enthalten ist.
		*/
		public contains(key:any):boolean
		{
			return typeof this.items[key] !== "undefined";
		}



		/*
			Führt die gegebene callback Funktion für jedes
			enthaltene Element aus. Das Element selbst wird
			dabei als erster Parameter, der Schlüssel des
			Elements als zweiter Paramter der callback Funktion
			übergeben.
		*/
		public forEach(callback:(item:T, key?:any) => void):void
		{
			for (var i in this.items)
				callback(this.items[i], i);
		}



		/*
			Erzeugt eine Kopie der Map, die die selben
			Elemente enthält aber nicht nur eine Referenz
			darstellt.
		*/
		public clone():Map<T>
		{
			var result = new Map<T>();
			for (var i in this.items)
				result.items[i] = this.items[i];
			return result;
		}



		/*
			Gibt einen Array mit den Schlüsseln aller
			Elemente der Map zurück.
		*/
		public getKeys():string[]
		{
			return Object.keys(this.items);
		}



		/*
			Löscht alle Elemente aus der Map.
		*/
		public reset():void
		{
			this.items = {};
		}



		/*
			Löscht alle Elemente aus der Map.
		*/
		public clear():void
		{
			this.items = {};
		}



		public toJson():string
		{
			return Json.encode(this.items);
		}



		public fromJson(json:string):void
		{
			this.items = Json.decode(json) || {};
		}
	}
}

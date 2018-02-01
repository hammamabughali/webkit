module kr3m.util
{
	/*
		Bequemlichkeitsklasse zum Arbeiten mit Mengen
	*/
	export class Set<T>
	{
		private items:any = {};



		constructor(items?:T[])
		{
			if (items)
			{
				for (var i = 0; i < items.length; ++i)
					this.add(items[i]);
			}
		}



		public toArray():T[]
		{
			var result:T[] = [];
			for (var i in this.items)
				result.push(this.items[i]);
			return result;
		}



		public getSize():number
		{
			var size = 0;
			for (var i in this.items)
				++size;
			return size;
		}



		public join(seperator:string = ","):string
		{
			return Object.keys(this.items).join(seperator);
		}



		public merge(s:Set<T>):void
		{
			for (var i in s.items)
				this.items[i] = s.items[i];
		}



		public isEmpty():boolean
		{
			for (var i in this.items)
				return false;
			return true;
		}



		public add(item:T):void
		{
			this.items[item.toString()] = item;
		}



		public remove(item:T):void
		{
			if (typeof this.items[item.toString()] !== "undefined")
				delete this.items[item.toString()];
		}



		public contains(item:T):boolean
		{
			return typeof this.items[item.toString()] !== "undefined";
		}



		/*
			Gibt die Vereinigungsmenge zweier Mengen
			zurück (alle Elemente, die in mindestens
			einer der Mengen enthalten sind).
		*/
		public union(s:Set<T>):Set<T>
		{
			var result = this.clone();
			for (var i in s.items)
				result.items[i] = s.items[i];
			return result;
		}



		/*
			Gibt die Differenz zweier Mengen zurück
			(alle Elemente, die in der ersten Menge
			aber nicht in der zweiten Menge enthalten
			sind).
		*/
		public difference(s:Set<T>):Set<T>
		{
			var result = new Set<T>();
			var i:any;
			for (i in this.items)
				if (!s.contains(i))
					result.items[i] = this.items[i];
			return result;
		}



		/*
			Gibt die Schnittmenge zweier Mengen zurück
			(alle Elemente, die in beiden Mengen enthalten
			sind).
		*/
		public intersection(s:Set<T>):Set<T>
		{
			var result = new Set<T>();
			var i:any;
			for (i in this.items)
				if (s.contains(i))
					result.items[i] = s.items[i];
			return result;
		}



		public forEach(callback:(item:T) => void):void
		{
			for (var i in this.items)
				callback(this.items[i]);
		}



		public getFirst():T
		{
			for (var i in this.items)
				return this.items[i];
			return undefined;
		}



		public clone():Set<T>
		{
			var result = new Set<T>();
			for (var i in this.items)
				result.items[i] = this.items[i];
			return result;
		}
	}
}

/// <reference path="../cache/abstractcache.ts"/>



module kr3m.cache
{
	class TimedCacheItem<T>
	{
		public created:number;
		public lastModified:number;
		public value:T;
	}



	/*
		Der TimedCache ist ein assoziatives Array, das beliebige
		Datensätze für einen bestimmten Zeitraum enthält. Daten,
		die länger als dieser Zeitraum nicht verwendet werden,
		werden gelöscht. ttl (Time-To-Live) gibt an, wie lange
		Einträge im Cache "leben" dürfen bevor sie als ungültig
		angesehen werden (in Millisekunden).

		Vorsicht: aus der ttl lässt sich nicht direkt die
		Lebensdauer der Einträge ablesen. Beispiel: wenn man
		will, dass die Einträge einmal täglich aktualisiert
		werden, dann funktioniert das nicht indem man die ttl
		auf 24h setzt. Weil die ttl bei jedem Zugriff wieder
		zurückgesetzt wird ist es bei einer ttl von 24h
		unwahrscheinlich, dass überhaupt irgendwann die ttl
		ausläuft so lange mindestens ein Zugriff pro Tag
		stattfindet. Eine solche absolute maximale Lebensdauer
		lässt sich über maxTtl setzen.
	*/
	export class TimedCache<T = any> extends AbstractCache<T>
	{
		private ttl:number;
		private data:{[id:string]:TimedCacheItem<T>} = {};
		private cleanTimerId:number;

		/*
			Wird die maxTtl (maximum-time-to-live) auf einen Wert
			größer 0 gesetzt, dann werden Einträge gelöscht, sobald
			sie älter sind als diese Zeit (in Millisekunden), egal
			wie oft auf sie zugegriffen wurde oder nicht.
		*/
		public maxTtl = 0;

		/*
			Wird clearOnDateChange auf true gesetzt, dann
			werden Einträge auch als veraltet angesehen,
			wenn sie am vorigen Kalendertag erstellt worden
			sind (nach UTC-Zeit).
		*/
		public clearOnDateChange = false;



		constructor(ttl = 3600000, options?:{maxTtl?:number, clearOnDateChange?:boolean})
		{
			super();
			this.ttl = ttl;
			var cleanInterval = Math.min(10000, ttl / 2);
			this.cleanTimerId = setInterval(this.onTick.bind(this), cleanInterval);

			if (options)
			{
				for (var i in options)
				{
					if (this[i] != undefined && typeof this[i] != "function")
						this[i] = options[i];
				}
			}
		}



		/*
			cleanInterval gibt an, in welchen Zeitabständen alle
			ungültigen Einträge aus dem Cache geleert werden
			(in Millisekunden). Je höher cleanInterval eingestellt
			ist um so niedriger die CPU-Last aber um so höher die
			Speicherlast des Caches, weil veraltete Einträge erst
			gelöscht werden, wenn sie aufgerufen werden und bemerkt
			wird, dass sie veraltet sind.
		*/
		public setClearInterval(cleanInterval:number):void
		{
			clearInterval(this.cleanTimerId);
			this.cleanTimerId = setInterval(this.onTick.bind(this), cleanInterval);
		}



		private onTick():void
		{
			for (var i in this.data)
			{
				if (this.isExpired(this.data[i]))
					delete this.data[i];
			}
		}



		private isExpired(item:TimedCacheItem<T>):boolean
		{
			var now = Date.now();
			if (item.lastModified < now - this.ttl)
				return true;

			if (this.maxTtl > 0
				&& item.created < now - this.maxTtl)
				return true;

			if (this.clearOnDateChange)
			{
				var midnight = new Date();
				midnight.setUTCHours(0, 0, 0, 0);
				if (item.created < midnight.getTime())
					return true;
			}

			return false;
		}



		public forEach(callback:(item:T, key:string) => void):void
		{
			for (var i in this.data)
				callback(this.data[i].value, i);
		}



		public clear():void
		{
			this.data = {};
		}



		public set(key:string, value:T):void
		{
			var item = this.data[key];
			if (!item)
			{
				item = new TimedCacheItem<T>();
				this.data[key] = item;
			}
			item.value = value;
			item.created = Date.now();
			item.lastModified = item.created;
		}



		public unset(key:string):void
		{
			delete this.data[key];
		}



		public get(key:string):T
		{
			var item = this.data[key];
			if (item)
			{
				if (this.isExpired(item))
				{
//# PROFILING
					this.countMiss();
//# /PROFILING
					delete this.data[key];
					return undefined;
				}
				else
				{
//# PROFILING
					this.countHit();
//# /PROFILING
					item.lastModified = Date.now();
					return item.value;
				}
			}
//# PROFILING
			this.countMiss();
//# /PROFILING
			return undefined;
		}



		public contains(key:string):boolean
		{
			return !!this.data[key];
		}



		public getSize():number
		{
			return Object.keys(this.data).length;
		}
	}
}

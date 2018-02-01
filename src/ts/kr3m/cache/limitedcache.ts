/// <reference path="../cache/abstractcache.ts"/>



module kr3m.cache
{
	class LimitedCacheItem<T>
	{
		public lastModified:number;
		public value:T;
	}



	/*
		LimitedCache ist ein assoziatives Array, das eine
		maximale Menge beliebiger Datensätze enthält. Werden
		mehr Datensätze in das Array gesteckt als es enthalten
		darf, werden so lange Datensätze gelöscht, bis wieder
		genug Platz für die neuen Datensätze ist (Cache auf
		Prinzip von least-recently-used).
	*/
	export class LimitedCache<T> extends AbstractCache<T>
	{
		private limit:number;
		private count:number = 0;
		private data:{[id:string]:LimitedCacheItem<T>} = {};



		constructor(limit:number = 1000)
		{
			super();
			this.limit = limit;
		}



		public forEach(callback:(item:T, key:any) => void):void
		{
			for (var i in this.data)
				callback(this.data[i].value, i);
		}



		private enforceLimit():void
		{
			while (this.count > this.limit)
			{
				var oldestKey = Object.keys(this.data)[0];
				var oldestModified = this.data[oldestKey].lastModified;
				for (var i in this.data)
				{
					if (this.data[i].lastModified < oldestModified)
					{
						oldestKey = i;
						oldestModified = this.data[i].lastModified;
					}
				});
				delete this.data[oldestKey];
				--this.count;
			}
		}



		public set(key:any, value:T):void
		{
			var item = this.data[key];
			if (!item)
			{
				item = new LimitedCacheItem<T>();
				this.data[key] = item;
				++this.count;
			}
			item.lastModified = Date.now();
			item.value = value;

			this.enforceLimit();
		}



		public unset(key:any):void
		{
			delete this.data[key];
		}



		public get(key:any):T
		{
			var item = this.data[key];
			if (item)
			{
				item.lastModified = Date.now();
//# PROFILING
				this.countHit();
//# /PROFILING
				return item.value;
			}
//# PROFILING
			this.countMiss();
//# /PROFILING
			return null;
		}
	}
}

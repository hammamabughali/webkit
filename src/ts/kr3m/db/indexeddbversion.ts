/// <reference path="../async/join.ts"/>



module kr3m.db
{
	type IndexedDbVersionIndex =
	{
		name:string,
		keyPath:string|string[],
		options:{unique?:boolean, multiEntry?:boolean}
	};

	type IndexedDbVersionStore =
	{
		name:string,
		options:{keyPath?:string, autoIncrement?:boolean},
		indexes:IndexedDbVersionIndex[]
	};



	export class IndexedDbVersion
	{
		private stores:IndexedDbVersionStore[] = [];



		public addStore(
			name:string,
			options?:{keyPath?:string,
			autoIncrement?:boolean}):IndexedDbVersion
		{
			this.stores.push({name : name, options : options || {}, indexes:[]});
			return this;
		}



		public addIndex(
			name:string,
			keyPath?:string|string[],
			options?:{unique?:boolean,
			multiEntry?:boolean}):IndexedDbVersion
		{
			var store = this.stores[this.stores.length - 1];
			store.indexes.push({name : name, keyPath : keyPath, options : options || {}});
			return this;
		}



		public flush(
			db:IDBDatabase,
			callback:() => void):void
		{
			var join = new kr3m.async.Join();
			for (var i = 0; i < this.stores.length; ++i)
			{
				var store = this.stores[i];
				var os = db.createObjectStore(store.name, store.options);
				for (var j = 0; j < store.indexes.length; ++j)
				{
					var index = store.indexes[j];
					os.createIndex(index.name, index.keyPath, index.options);
				}
				os.transaction.oncomplete = join.getCallback();
			}
			join.addCallback(callback);
		}
	}
}

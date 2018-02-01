/// <reference path="../async/loop.ts"/>



module kr3m.db
{
	export class MapReduceWorkset<MT>
	{
		private data:{[key:string]:{mappedItems:MT[], reducedItems:MT[]}} = {};
		private emitMap:(key:string, mappedItem:MT) => void;
		private emitReduce:(key:string, reducedItem:MT) => void;



		constructor()
		{
			this.emitMap = this.emitMapFunc.bind(this);
			this.emitReduce = this.emitReduceFunc.bind(this);
		}



		private emitMapFunc(key:string, item:MT):void
		{
			if (typeof this.data[key] == "undefined")
				this.data[key] = {mappedItems:[], reducedItems:[]};

			this.data[key].mappedItems.push(item);
		}



		private emitReduceFunc(key:string, item:MT):void
		{
			this.data[key].reducedItems.push(item);
		}



		public map(
			rawData:any[],
			mapFunc:(rawItem:any, emit:(key:string, mappedItem:MT) => void) => void):void
		{
			for (var i = 0; i < rawData.length; ++i)
				mapFunc(rawData[i], this.emitMap);
		}



		public mapSimple(
			rawData:any[],
			mapFunc:(rawItem:any) => [string, MT]):void
		{
			for (var i = 0; i < rawData.length; ++i)
			{
				var [key, mappedItem] = mapFunc(rawData[i]);

				if (typeof this.data[key] == "undefined")
					this.data[key] = {mappedItems:[], reducedItems:[]};

				this.data[key].mappedItems.push(mappedItem);
			}
		}



		public mapAsync(
			rawData:any[],
			mapFunc:(rawItem:any, emit:(key:string, mappedItem:MT) => void, mapCallback:() => void) => void,
			callback:() => void):void
		{
			kr3m.async.Loop.forEach(rawData, (rawItem:any, loopCallback:() => void) =>
			{
				mapFunc(rawItem, this.emitMap, loopCallback);
			}, callback);
		}



		public reduce(
			reduceFunc:(key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void) => void):void
		{
			for (var i in this.data)
			{
				if (this.data[i].mappedItems.length > 0)
				{
					reduceFunc(i, this.data[i].mappedItems, this.emitReduce);
					if (this.data[i].reducedItems.length > 1)
					{
						this.data[i].mappedItems = this.data[i].reducedItems;
						this.data[i].reducedItems = [];
						reduceFunc(i, this.data[i].mappedItems, this.emitReduce);
					}
					this.data[i].mappedItems = [];
				}
			}
		}



		public reduceSimple(
			reduceFunc:(key:string, mappedItems:MT[]) => MT):void
		{
			for (var i in this.data)
			{
				if (this.data[i].mappedItems.length > 0)
				{
					this.data[i].reducedItems.push(reduceFunc(i, this.data[i].mappedItems));
					if (this.data[i].reducedItems.length > 1)
					{
						this.data[i].mappedItems = this.data[i].reducedItems;
						this.data[i].reducedItems = [];
						this.data[i].reducedItems.push(reduceFunc(i, this.data[i].mappedItems));
					}
					this.data[i].mappedItems = [];
				}
			}
		}



		public reduceAsync(
			reduceFunc:(key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void, reduceCallback:() => void) => void,
			callback:() => void):void
		{
			kr3m.async.Loop.forEachAssoc(this.data, (rawKey:string, rawValue:any, loopCallback:() => void) =>
			{
				if (rawValue.mappedItems.length == 0)
					return loopCallback();

				reduceFunc(rawKey, rawValue.mappedItems, this.emitReduce, () =>
				{
					if (rawValue.reducedItems.length == 0)
					{
						rawValue.mappedItems = [];
						return loopCallback();
					}

					rawValue.mappedItems = rawValue.reducedItems;
					rawValue.reducedItems = [];
					reduceFunc(rawKey, rawValue.mappedItems, this.emitReduce, () =>
					{
						rawValue.mappedItems = [];
						loopCallback();
					});
				});
			}, callback);
		}



		public flushKeys(keys:string[]):MT[]
		{
			var result:MT[] = [];
			for (var i = 0; i < keys.length; ++i)
			{
				if (!this.data[keys[i]])
					continue;

				for (var j = 0; j < this.data[keys[i]].reducedItems.length; ++j)
					result.push(this.data[keys[i]].reducedItems[j]);

				delete this.data[keys[i]];
			}
			return result;
		}



		public flushArray():MT[]
		{
			var result:MT[] = [];
			for (var i in this.data)
			{
				for (var j = 0; j < this.data[i].reducedItems.length; ++j)
					result.push(this.data[i].reducedItems[j]);
			}
			return result;
		}



		public flushAssoc():{[key:string]:MT}
		{
			var result:{[key:string]:MT} = {};
			for (var i in this.data)
			{
				if (this.data[i].reducedItems.length > 0)
					result[i] = this.data[i].reducedItems[0];
			}
			return result;
		}
	}
}

//# SERVER
/// <reference path="../async/loop.ts"/>
//# /SERVER



module kr3m.dojo
{
	export class GridQueryResponse<T>
	{
		public items:T[];
		public identifier:string;
		public numRows:number;
		public label:string;
		public sort:string;



//# SERVER
		constructor(items:T[], identifier:string, numRows:number, label:string, sort:string)
		{
			this.items = items;
			this.identifier = identifier;
			this.numRows = numRows;
			this.label = label;
			this.sort = sort;
		}



		public map<U>(mapper:(t:T) => U):GridQueryResponse<U>
		{
			return new GridQueryResponse<U>(this.items.map(mapper), this.identifier, this.numRows, this.label, this.sort);
		}



		public mapAsync<U>(mapper:(t:T, cb:(u:U) => void) => void, callback:(result:GridQueryResponse<U>) => void):void
		{
			var items:U[] = [];
			kr3m.async.Loop.forEach(this.items, (value:T, next:() => void) =>
			{
				mapper(value, (u:U) =>
				{
					if (u)
						items.push(u);
					next();
				});
			}, () => callback(new GridQueryResponse<U>(items, this.identifier, this.numRows, this.label, this.sort)));
		}
//# /SERVER
	}
}

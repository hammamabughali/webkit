/// <reference path="../../util/util.ts"/>



module kr3m.algorithms.astar
{
	export class OpenList<T>
	{
		private items:any[] = [];
		private equals:(a:T, b:T) => boolean;



		constructor(equals:(a:T, b:T) => boolean)
		{
			this.equals = equals;
		}



		public add(value:T, cost:number = 0):void
		{
			var item = {value:value, cost:cost};
			for (var i = 0; i < this.items.length; ++i)
			{
				if (this.items[i].cost < item.cost)
				{
					this.items.splice(i, 0, item);
					return;
				}
			}
			this.items.push(item);
		}



		public update(value:T, cost:number):void
		{
			for (var i = 0; i < this.items.length; ++i)
			{
				if (this.equals(this.items[i].value, value))
				{
					this.items[i].cost = cost;
					kr3m.util.Util.sortBy(this.items, "cost", false);
					return;
				}
			}
			this.add(value, cost);
		}



		public contains(value:T):boolean
		{
			for (var i = 0; i < this.items.length; ++i)
			{
				if (this.equals(this.items[i].value, value))
					return true;
			}
			return false;
		}



		public popHighest():T
		{
			var item = this.items.shift();
			return item ? item.value : undefined;
		}



		public popLowest():T
		{
			var item = this.items.pop();
			return item ? item.value : undefined;
		}



		public isEmpty():boolean
		{
			return this.items.length == 0;
		}



		public getSize():number
		{
			return this.items.length;
		}
	}
}

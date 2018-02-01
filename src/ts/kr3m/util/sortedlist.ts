/// <reference path="../algorithms/search/bisect.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.util
{
	export class SortedList<T>
	{
		private items:T[] = [];



		constructor(private sortFunc:(a:T, b:T) => number)
		{
		}



		public useList(items:T[], isSorted = true):void
		{
			this.items = items;
			if (!isSorted)
				this.items.sort(this.sortFunc);
		}



		public clear():void
		{
			this.items = [];
		}



		public insertSortedValues(...values:T[]):void
		{
			var insertPositions = values.map(value => this.insertIndexOf(value));
			for (var i = 1; i < insertPositions.length; ++i)
				insertPositions[i] += i;

			this.items.push(...values);
			var l = insertPositions.length;
			for (var i = this.items.length - 1; i >= 0; --i)
			{
				if (i == insertPositions[l - 1])
				{
					this.items[i] = values.pop();
					--l;
				}
				else
				{
					this.items[i] = this.items[i - l];
				}
			}
		}



		public insert(...values:T[]):void
		{
			if (this.items.length == 0)
			{
				this.items = values.slice();
				this.items.sort(this.sortFunc);
				return;
			}

			if ((values.length / this.items.length) > 0.3)
			{
				this.items.push(...values);
				this.items.sort(this.sortFunc);
				return;
			}

			values.sort(this.sortFunc);
			this.insertSortedValues(...values);
		}



		public insertFrom(...lists:SortedList<T>[]):void
		{
			for (var i = 0; i < lists.length; ++i)
				this.insertSortedValues(...lists[i].items);
		}



		public pop():T
		{
			return this.items.pop();
		}



		public shift():T
		{
			return this.items.shift();
		}



		public getLength():number
		{
			return this.items.length;
		}



		public getItem(offset:number):T
		{
			return this.items[offset];
		}



		public findIndex(matchFunc:(item:T) => boolean):number
		{
			return (<any>this.items).findIndex(matchFunc);
		}



		public find(matchFunc:(item:T) => boolean):T
		{
			return (<any>this.items).find(matchFunc);
		}



		public toArray(start?:number, end?:number):T[]
		{
			return this.items.slice(start, end);
		}



		public slice(start?:number, end?:number):SortedList<T>
		{
			var newList = new SortedList<T>(this.sortFunc);
			newList.useList(this.items.slice(start, end));
			return newList;
		}



		public splice(offset:number, deleteCount:number, ...newElements:T[]):void
		{
			this.items.splice(offset, deleteCount);
			this.insert(...newElements);
		}



		public indexOf(value:T):number
		{
			return kr3m.algorithms.search.bisect(this.items, value, this.sortFunc);
		}



		public insertIndexOf(value:T):number
		{
			return kr3m.algorithms.search.bisectInsertPos(this.items, value, this.sortFunc);
		}



		public contains(value:T):boolean
		{
			return this.indexOf(value) >= 0;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var CS = kr3m.unittests.CaseSync;
	var SL = kr3m.util.SortedList;
	var comp = (a:number, b:number) => a - b;
	new kr3m.unittests.Suite("kr3m.util.SortedList")

	.add(new CS("indexOf I", () =>
	{
		var list = new SL(comp);
		return list.indexOf(42);
	}, -1))
	.add(new CS("indexOf II", () =>
	{
		var list = new SL(comp);
		list.useList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		return list.indexOf(42);
	}, -1))
	.add(new CS("indexOf III", () =>
	{
		var list = new SL(comp);
		list.useList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		return list.indexOf(6);
	}, 6))

	.add(new CS("insertIndexOf I", () =>
	{
		var list = new SL(comp);
		return list.insertIndexOf(42);
	}, 0))
	.add(new CS("insertIndexOf II", () =>
	{
		var list = new SL(comp);
		list.useList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		return list.insertIndexOf(42);
	}, 11))
	.add(new CS("insertIndexOf III", () =>
	{
		var list = new SL(comp);
		list.useList([0, 1, 2, 3, 4, 5, 7, 8, 9, 10]);
		return list.insertIndexOf(6);
	}, 6))

	.add(new CS("insert I", () =>
	{
		var list = new SL(comp);
		list.insert();
		return list.toArray();
	}, []))
	.add(new CS("insert II", () =>
	{
		var list = new SL(comp);
		list.insert(0);
		return list.toArray();
	}, [0]))
	.add(new CS("insert III", () =>
	{
		var list = new SL(comp);
		list.insert(3, 1, 0, 2);
		return list.toArray();
	}, [0, 1, 2, 3]))
	.add(new CS("insert IV", () =>
	{
		var list = new SL(comp);
		list.insert(3, 1, 0, 2);
		list.insert(3, 1, 0, 2);
		return list.toArray();
	}, [0, 0, 1, 1, 2, 2, 3, 3]))
	.add(new CS("insert V", () =>
	{
		var list = new SL(comp);
		list.insert(3, 1, 0, 2);
		list.insert();
		return list.toArray();
	}, [0, 1, 2, 3]))
	.add(new CS("insert VI", () =>
	{
		var list = new SL(comp);
		list.insert(3, 1, 2);
		list.insert(0, 4);
		return list.toArray();
	}, [0, 1, 2, 3, 4]))
	.add(new CS("insert VII", () =>
	{
		var list = new SL(comp);
		list.insert(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
		list.insert(3, 3, 3, 5, 5, 2, 2, 2);
		return list.toArray();
	}, [0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9, 10]))

	.add(new CS("insertSortedValues I", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues();
		return list.toArray();
	}, []))
	.add(new CS("insertSortedValues II", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(0);
		return list.toArray();
	}, [0]))
	.add(new CS("insertSortedValues III", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(0, 1, 2, 3);
		return list.toArray();
	}, [0, 1, 2, 3]))
	.add(new CS("insertSortedValues IV", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(0, 1, 2, 3);
		list.insertSortedValues(0, 1, 2, 3);
		return list.toArray();
	}, [0, 0, 1, 1, 2, 2, 3, 3]))
	.add(new CS("insertSortedValues V", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(0, 1, 2, 3);
		list.insertSortedValues();
		return list.toArray();
	}, [0, 1, 2, 3]))
	.add(new CS("insertSortedValues VI", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(1, 2, 3);
		list.insertSortedValues(0, 4);
		return list.toArray();
	}, [0, 1, 2, 3, 4]))
	.add(new CS("insertSortedValues VII", () =>
	{
		var list = new SL(comp);
		list.insertSortedValues(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
		list.insertSortedValues(2, 2, 2, 3, 3, 3, 5, 5);
		return list.toArray();
	}, [0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 5, 5, 6, 7, 8, 9, 10]))

	.run();
}, 1);
//# /UNITTESTS

/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.math
{
	export class GeneralDistribution<T>
	{
		protected items:{value:T, weight:number}[] = [];



		constructor(
			protected equalFunc:(a:T, b:T) => boolean = kr3m.util.Util.equal)
		{
		}



		public map<NT>(
			mapFunc:(value:T) => NT,
			newEqualFunc:(a:NT, b:NT) => boolean = kr3m.util.Util.equal):GeneralDistribution<NT>
		{
			var result = new GeneralDistribution<NT>(newEqualFunc);
			for (var i = 0; i < this.items.length; ++i)
				result.addValue(mapFunc(this.items[i].value), this.items[i].weight);
			return result;
		}



		public reduce<NT>(
			reduceFunc:(accumulated:NT, value:T, weight:number) => NT,
			initialValue?:NT):NT
		{
			var accumulated = initialValue;
			for (var i = 0; i < this.items.length; ++i)
				accumulated = reduceFunc(accumulated, this.items[i].value, this.items[i].weight);
			return accumulated;
		}



		private static incIndices(
			indices:number[],
			itemCounts:number[]):boolean
		{
			for (var i = 0; i < indices.length; ++i)
			{
				if (indices[i] < itemCounts[i] - 1)
				{
					++indices[i];
					for (var j = i - 1; j >= 0; --j)
						indices[j] = 0;
					return false;
				}
			}
			return true;
		}



		public static process<T, NT>(
			distributions:GeneralDistribution<T>[],
			mapFunc:(values:T[]) => NT,
			newEqualFunc:(a:NT, b:NT) => boolean = kr3m.util.Util.equal):GeneralDistribution<NT>
		{
			var result = new GeneralDistribution<NT>(newEqualFunc);
			var indices = kr3m.util.Util.fill(distributions.length, 0);
			var values = <T[]> kr3m.util.Util.fill(indices.length, null);
			var itemCounts = distributions.map(dist => dist.items.length);
			while (true)
			{
				var newWeight = 1;
				for (var i = 0; i < indices.length; ++i)
				{
					var item = distributions[i].items[indices[i]];
					values[i] = item.value;
					newWeight *= item.weight;
				}

				var newValue = mapFunc(values);
				result.addValue(newValue, newWeight);

				if (GeneralDistribution.incIndices(indices, itemCounts))
					break;
			}
			return result;
		}



		public addValue(value:T, weight = 1):void
		{
			var item = this.items["find"](i => this.equalFunc(i.value, value));
			if (item)
				item.weight += weight;
			else
				this.items.push({value : value, weight : weight});
		}



		public getTotalWeight():number
		{
			return this.items.reduce((t, i) => t + i.weight, 0);
		}



		/*
			Adjust all weights so that the sum of all weights
			equals 1 but the relative value of the weights stays
			the same.
		*/
		public normalizeWeights():void
		{
			var totalWeight = this.getTotalWeight();
			for (var i = 0; i < this.items.length; ++i)
				this.items[i].weight /= totalWeight;
		}



		public dumpPercentage(
			caption?:string,
			sortFunc?:(a:T, b:T) => number):void
		{
			if (sortFunc)
				this.items.sort((a, b) => sortFunc(a.value, b.value));
			else
				this.items.sort((a, b) => b.weight - a.weight);

			if (caption)
				log(caption);

			for (var i = 0; i < this.items.length; ++i)
			{
				var it = this.items[i];
				log(" ", kr3m.util.Json.encode(it.value) + " (" + (it.weight * 100).toFixed(2) + "%)");
			}
		}
	}
}

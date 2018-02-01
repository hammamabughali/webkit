module kr3m.math
{
	export class Distribution
	{
		private weights:{[id:number]:number} = {};



		public constructor(...values:number[])
		{
			for (var i = 0; i < values.length; ++i)
				this.weights[values[i]] = (this.weights[values[i]] || 0) + 1 / values.length;
		}



		public getValues():number[]
		{
			return Object.keys(this.weights).map(parseFloat);
		}



		public getWeights():number[]
		{
			var weights:number[] = [];
			for (var i in this.weights)
				weights.push(this.weights[i]);
			return weights;
		}



		public dump(prefix:string = "", precission:number = 2):void
		{
			var parts:string[] = [];
			if (prefix)
				parts.push(prefix);
			var values = Object.keys(this.weights).map(parseFloat);
			values.sort((a, b) => a - b);
			for (var i = 0; i < values.length; ++i)
				parts.push(values[i] + ":" + (100 * this.weights[values[i]]).toFixed(precission) + "%");
			console.log(parts.join(" "));
		}



		public setEqualDistribution(from:number, to:number):void
		{
			this.weights = {};
			var weight = 1 / (to - from + 1);
			for (var x = from; x <= to; ++x)
				this.weights[x] = weight;
		}



		public setNormalDistribution(from:number, to:number):void
		{
			this.weights = {};

			var m = (to + from) / 2;
			var o = (to - from) / 4;
			var o2 = o * o;
			var f = (1 / (Math.sqrt(2 * Math.PI * o2)));

			for (var x = from; x <= to; ++x)
				this.weights[x] = f * Math.exp(-(x - m) * (x - m) / (2 * o2));

			this.normalize();
		}



		public normalize():void
		{
			var total = 0;
			for (var i in this.weights)
				total += this.weights[i];

			if (Math.abs(total - 1) < 0.00001)
				return;

			for (var i in this.weights)
				this.weights[i] /= total;
		}



		public getTotalWeight():number
		{
			var weight = 0;
			for (var i in this.weights)
				weight += this.weights[i];
			return weight;
		}



		private static incIndices(
			indices:number[],
			values:number[][]):boolean
		{
			for (var i = 0; i < indices.length; ++i)
			{
				if (indices[i] < values[i].length - 1)
				{
					++indices[i];
					for (var j = i - 1; j >= 0; --j)
						indices[j] = 0;
					return false;
				}
			}
			return true;
		}



		public static exec(
			distributions:Array<Distribution|number>,
			opFunc:(values:number[]) => number):Distribution
		{
			var results:{[id:number]:number} = {};
			var values:number[][] = [];
			var weights:number[][] = [];
			var indices:number[] = [];

			for (var i = 0; i < distributions.length; ++i)
			{
				if (typeof distributions[i] == "number")
				{
					values.push([<number> distributions[i]]);
					weights.push([1]);
				}
				else
				{
					var d = <Distribution> distributions[i];
					values.push([]);
					weights.push([]);
					var j = indices.length;
					for (var k in d.weights)
					{
						values[j].push(parseFloat(k));
						weights[j].push(d.weights[k]);
					}
				}
				indices.push(0);
			}

			while (true)
			{
				var current:number[] = [];
				var weight = 1;
				for (var i = 0; i < indices.length; ++i)
				{
					current.push(values[i][indices[i]]);
					weight *= weights[i][indices[i]];
				}
				var value = opFunc(current);
				results[value] = (results[value] || 0) + weight;

				if (Distribution.incIndices(indices, values))
					break;
			}

			var result = new Distribution();
			result.weights = results;
			return result;
		}



		public threshold(threshold:number):Distribution
		{
			var result = new Distribution();
			for (var i in this.weights)
			{
				var weight = (parseFloat(i) >= threshold) ? 1 : 0;
				result.weights[weight] = (result.weights[weight] || 0) + this.weights[i];
			}
			return result;
		}



		public highPassWeight(threshold:number):Distribution
		{
			var result = new Distribution();
			for (var i in this.weights)
			{
				if (this.weights[i] >= threshold)
					result.weights[i] = this.weights[i];
			}
			result.normalize();
			return result;
		}



		public highPassValue(threshold:number):Distribution
		{
			var result = new Distribution();
			for (var i in this.weights)
			{
				if (parseFloat(i) >= threshold)
					result.weights[i] = this.weights[i];
			}
			result.normalize();
			return result;
		}



		public map(
			mapFunc:(value:number) => number):Distribution
		{
			return Distribution.exec([this], (v:number[]) => mapFunc(v[0]));
		}



		public combine(
			other:Distribution|number,
			opFunc:(values:number[]) => number):Distribution
		{
			return Distribution.exec([this, other], opFunc);
		}



		public plus(
			other:Distribution|number):Distribution
		{
			return Distribution.exec([this, other], (v:number[]) => v[0] + v[1]);
		}



		public minus(
			other:Distribution|number):Distribution
		{
			return Distribution.exec([this, other], (v:number[]) => v[0] - v[1]);
		}



		public times(
			other:Distribution|number):Distribution
		{
			return Distribution.exec([this, other], (v:number[]) => v[0] * v[1]);
		}



		public divided(
			other:Distribution|number):Distribution
		{
			return Distribution.exec([this, other], (v:number[]) => v[1] ? v[0] / v[1] : 0);
		}



		public modulo(
			other:Distribution|number):Distribution
		{
			return Distribution.exec([this, other], (v:number[]) => v[0] % v[1]);
		}



		public floor():Distribution
		{
			var result = new Distribution();
			for (var i in this.weights)
			{
				var v = Math.floor(parseFloat(i));
				result.weights[v] = (result.weights[v] || 0) + this.weights[i];
			}
			return result;
		}



		public max(
			...others:Array<Distribution|number>):Distribution
		{
			var all = others.slice();
			all.unshift(this);
			return Distribution.exec(all, (v:number[]) => Math.max(...v));
		}



		public min(
			...others:Array<Distribution|number>):Distribution
		{
			var all = others.slice();
			all.unshift(this);
			return Distribution.exec(all, (v:number[]) => Math.min(...v));
		}



		public getMax():[number, number]
		{
			var value = undefined;
			var weight = 0;
			for (var i in this.weights)
			{
				var f = parseFloat(i);
				if (weight == 0 || f > value)
				{
					value = f;
					weight = this.weights[i];
				}
			}
			return [value, weight];
		}



		public getHeaviest():[number, number]
		{
			var value = undefined;
			var weight = 0;
			for (var i in this.weights)
			{
				if (weight == 0 || this.weights[i] > weight)
				{
					value = parseFloat(i);
					weight = this.weights[i];
				}
			}
			return [value, weight];
		}



		public getAverage():number
		{
			var average = 0;
			for (var i in this.weights)
				average += this.weights[i] * <any> i;
			return average;
		}



		public rasterize(count:number, min?:number, max?:number):number[]
		{
			var raster:number[] = [];
			var values = Object.keys(this.weights).map(parseFloat);
			values.sort((a, b) => a - b);
			min = min !== undefined ? min : values[0];
			max = max !== undefined ? max : values[values.length - 1];
			var delta = (max - min) / count;
			var o = 0;
			for (var i = 0; i <= count; ++i)
			{
				var p = min + delta * i;
				var value = 0;
				//# TODO: NYI rasterize
				raster.push(value);
			}
			return raster;
		}
	}
}

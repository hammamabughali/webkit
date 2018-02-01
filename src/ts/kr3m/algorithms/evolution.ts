/// <reference path="../async/loop.ts"/>
/// <reference path="../util/rand.ts"/>



module kr3m.algorithms
{
	export type FitnessFunction<T> = (obj:T, callback:(fitness:number) => void) => void;



	export class Evolution<T>
	{
		private cls:{new():T};
		private fitnessFunc:FitnessFunction<T>;



		constructor(cls:{new():T}, fitnessFunc:FitnessFunction<T>)
		{
			this.cls = cls;
			this.fitnessFunc = fitnessFunc;
		}



		private crossover(child:T, seeds:T[], fitnesses:number[]):void
		{
			if (seeds.length < 2)
				return;

			var p1 = kr3m.util.Rand.getElementWeighted(seeds, fitnesses);
			var p2 = p1;
			while (p1 == p2)
				p2 = kr3m.util.Rand.getElementWeighted(seeds, fitnesses);

			for (var i in child)
			{
				if (typeof child[i] == "number")
					child[i] = kr3m.util.Rand.getFloat(p1[i], p2[i]);
			}
		}



		private mutate(obj:T):void
		{
			for (var i in obj)
			{
				if (kr3m.util.Rand.getInt(100) == 0)
					obj[i] = obj[i] * kr3m.util.Rand.getFloat(-2, 2) + kr3m.util.Rand.getFloat(-1, 1);
			}
		}



		private evolve(seeds:T[], fitnesses:number[]):T[]
		{
			var children:T[] = [];
			for (var i = 0; i < seeds.length; ++i)
			{
				var child = new this.cls();
				this.crossover(child, seeds, fitnesses);
				this.mutate(child);
				children.push(child);
			}
			return children;
		}



		private dump(seeds:T[], fitnesses:number[]):void
		{
			log("-------------------------");
			for (var i = 0; i < seeds.length; ++i)
				log(seeds[i], "=>", fitnesses[i]);
			log("-------------------------");
		}



		public runSeeded(
			seeds:T[],
			iterations:number,
			callback:(results:T[]) => void):void
		{
			var generation = 0;
			kr3m.async.Loop.loop((nextGeneration:(again:boolean) => void) =>
			{
				var fitnesses:number[] = [];
				kr3m.async.Loop.forEach(seeds, (seed:T, nextSeed:() => void) =>
				{
					this.fitnessFunc(seed, (fitness:number) =>
					{
						fitnesses.push(fitness);
						nextSeed();
					});
				}, () =>
				{
					this.dump(seeds, fitnesses);
					seeds = this.evolve(seeds, fitnesses);
					nextGeneration(++generation < iterations);
				});
			}, () =>
			{
				callback(seeds);
			});
		}
	}
}

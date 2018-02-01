/// <reference path="../../algorithms/astar/context.ts"/>
/// <reference path="../../algorithms/astar/datasource.ts"/>



module kr3m.algorithms.astar
{
	export class AStar<T>
	{
		private source:kr3m.algorithms.astar.DataSource<T>;



		constructor(source:kr3m.algorithms.astar.DataSource<T>)
		{
			this.source = source;
		}



		private expand(context:kr3m.algorithms.astar.Context<T>):void
		{
			var adjacent = this.source.getAdjacent(context.current);
			var currentCost = context.pathData.cost(context.current);
			for (var i = 0; i < adjacent.length; ++i)
			{
				if (context.closedSet.contains(adjacent[i]))
					continue;

				var cost = currentCost + this.source.getCost(context.current, adjacent[i]);
				if (context.openList.contains(adjacent[i]) && cost >= context.pathData.cost(adjacent[i]))
					continue;

				context.pathData.set(adjacent[i], cost, context.current);

				var estimate = cost + this.source.getHeuristic(adjacent[i], context.to);
				context.openList.update(adjacent[i], estimate);
			}
		}



		public begin(from:T, to:T):kr3m.algorithms.astar.Context<T>
		{
			var context = new kr3m.algorithms.astar.Context<T>(this.source.equals.bind(this.source));
			context.from = from;
			context.to = to;
			context.pathData.set(from);
			context.openList.add(from);
			return context;
		}



		public step(context:kr3m.algorithms.astar.Context<T>):boolean
		{
			if (context.done)
				return false;

			context.current = context.openList.popLowest();
			if (this.source.equals(context.current, context.to))
			{
				context.done = true;
				return false;
			}

			context.closedSet.add(context.current);
			this.expand(context);

			context.noPath = context.openList.isEmpty();
			context.done = context.done || context.noPath;
			return !context.noPath;
		}



		public isDone(context:kr3m.algorithms.astar.Context<T>):boolean
		{
			return context.done;
		}



		public getStats(context:kr3m.algorithms.astar.Context<T>):any
		{
			var stats:any = {};
			stats.pathLength = this.getPath(context).length;
			stats.closedSetSize = context.closedSet.getSize();
			stats.openListSize = context.openList.getSize();
			stats.efficiency = stats.pathLength / (stats.openListSize + stats.closedSetSize);
			stats.overhead = 1 / stats.efficiency;
			return stats;
		}



		public getPath(context:kr3m.algorithms.astar.Context<T>):T[]
		{
			if (context.noPath)
				return [];

			if (!context.current)
				return [];

			return context.pathData.getPath(context.current);
		}



		public findPath(from:T, to:T):T[]
		{
			var context = this.begin(from, to);
			while (this.step(context)){};
			return this.getPath(context);
		}
	}
}

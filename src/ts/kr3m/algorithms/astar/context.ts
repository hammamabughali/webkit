/// <reference path="../../algorithms/astar/closedlist.ts"/>
/// <reference path="../../algorithms/astar/openlist.ts"/>
/// <reference path="../../algorithms/astar/pathdata.ts"/>



module kr3m.algorithms.astar
{
	export class Context<T>
	{
		public openList:kr3m.algorithms.astar.OpenList<T>;
		public closedSet:kr3m.algorithms.astar.ClosedList<T>;
		public pathData:kr3m.algorithms.astar.PathData<T>;

		public equals:(a:T, b:T) => boolean;

		public from:T;
		public to:T;
		public current:T;

		public noPath = false;
		public done = false;



		constructor(equals:(a:T, b:T) => boolean)
		{
			this.openList = new kr3m.algorithms.astar.OpenList<T>(equals);
			this.closedSet = new kr3m.algorithms.astar.ClosedList<T>(equals);
			this.pathData = new kr3m.algorithms.astar.PathData<T>(equals);
		}
	}
}

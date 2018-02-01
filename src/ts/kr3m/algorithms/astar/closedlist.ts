/// <reference path="../../util/set.ts"/>



module kr3m.algorithms.astar
{
	export class ClosedList<T> extends kr3m.util.Set<T>
	{
		constructor(equals:(a:T, b:T) => boolean)
		{
			super();
			//# TODO: muss noch auf equals umgestellt werden
		}
	}
}

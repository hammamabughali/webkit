module kr3m.algorithms.astar
{
	export interface DataSource<T>
	{
		getAdjacent(field:T):T[];
		getCost(from:T, to:T):number;
		getHeuristic(from:T, to:T):number;
		equals(a:T, b:T):boolean;
	}
}

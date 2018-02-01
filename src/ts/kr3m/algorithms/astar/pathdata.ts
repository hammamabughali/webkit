module kr3m.algorithms.astar
{
	export class PathData<T>
	{
		private items:any = {};



		constructor(equals:(a:T, b:T) => boolean)
		{
			//# TODO: muss noch auf equals umgestellt werden
		}



		public set(node:T, cost:number = 0, pre:T = null):void
		{
			this.items[node.toString()] = {cost:cost, pre:pre};
		}



		public pre(node:T):T
		{
			return this.items[node.toString()].pre;
		}



		public cost(node:T):number
		{
			return this.items[node.toString()].cost;
		}



		public getPath(to:T):T[]
		{
			var path:T[] = [to];
			var pre = this.pre(to);
			while (pre)
			{
				path.unshift(pre);
				pre = this.pre(pre);
			}
			return path;
		}
	}
}

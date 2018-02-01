module kr3m.algorithms
{
	/*
		Implementation einer topologischen Suche nach Kahns Algorithmus.
		Sie kann verwendet werden um Graphen auf Zyklen zu untersuchen
		oder Elemente nach Abhängigkeiten voneinander zu sortieren.

		Siehe auch:
			https://en.wikipedia.org/wiki/Topological_sorting
	*/
	export abstract class TopologicalSearch<T>
	{
		protected abstract getNodes():T[];
		protected abstract getEdges(node:T):T[];



		public sort():T[]
		{
			var s:T[] = [];
			var r = this.getNodes().slice();
			var l:T[] = [];

			for (var i = 0; i < r.length; ++i)
			{
				if (this.getEdges(r[i]).length == 0)
				{
					s.push(r[i]);
					r.splice(i--, 1);
				}
			}

			while (s.length > 0)
			{
				var n = s.shift();
				l.push(n);
				for (var i = 0; i < r.length; ++i)
				{
					var edges = this.getEdges(r[i]);
					for (var j = 0; j < edges.length; ++j)
					{
						if (l.indexOf(edges[j]) < 0)
							break;
					}
					if (j >= edges.length)
					{
						s.push(r[i]);
						r.splice(i--, 1);
					}
				}
			}
//# DEBUG
			if (r.length > 0)
				console.log("cyclical graph found in topological search:", r);
//# /DEBUG
			return r.length > 0 ? null : l;
		}
	}
}

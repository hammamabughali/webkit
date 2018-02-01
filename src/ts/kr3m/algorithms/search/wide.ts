/// <reference path="../../util/util.ts"/>



//# EXPERIMENTAL
module kr3m.algorithms.search
{
	export class Wide
	{
		public static findAllPaths<T>(
			startValue:T,
			getChildren:(value:T) => T[]):Array<T[]>
		{
			var checked:T[] = [startValue];
			var completedPaths:Array<T[]> = [];
			var workset:Array<T[]> = [[startValue]];
			while (workset.length > 0)
			{
				var currentPath = workset.shift();
				var currentValue = currentPath[currentPath.length - 1];
				var children = getChildren(currentValue);
				children = kr3m.util.Util.difference(children, checked);
				if (children.length == 0)
				{
					completedPaths.push(currentPath);
					continue;
				}

				for (var i = 0; i < children.length; ++i)
				{
					var newPath = currentPath.slice();
					newPath.push(children[i]);
					workset.push(newPath);
				}
			}
			return completedPaths;
		}
	}
}
//# /EXPERIMENTAL

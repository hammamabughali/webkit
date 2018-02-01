/// <reference path="../../geom/axisalignedrectangle2d.ts"/>



module kr3m.algorithms.tree
{
	class Node<T>
	{
		public aaR:kr3m.geom.AxisAlignedRectangle2d;
		public items:{item:T, aaR:kr3m.geom.AxisAlignedRectangle2d}[] = [];
		public nodes:Node<T>[] = [];



		constructor(
			public depth:number,
			x:number, y:number, w:number, h:number)
		{
			this.aaR = new kr3m.geom.AxisAlignedRectangle2d(x, y, w, h);
		}
	}



	export class Quad<T>
	{
		protected root:Node<T>;

		public maxDepth = 8;



		constructor(
			x:number, y:number, w:number, h:number)
		{
			this.root = new Node<T>(0, x, y, w, h);
		}



		public insert(item:T, aaR:kr3m.geom.AxisAlignedRectangle2d):void
		{
			var node = this.root;
			while (node.depth < this.maxDepth)
			{
				var hx = node.aaR.x + node.aaR.w / 2;
				var hy = node.aaR.y + node.aaR.h / 2;

				if ((aaR.x <= hx && aaR.x + aaR.w >= hx) || aaR.x == hx || aaR.x + aaR.w == hx)
					break;

				if ((aaR.y <= hy && aaR.y + aaR.h >= hy) || aaR.y == hy || aaR.y + aaR.h == hy)
					break;

				if (node.nodes.length == 0)
				{
					var hw = node.aaR.w / 2;
					var hh = node.aaR.h / 2;
					var d = node.depth + 1;
					node.nodes.push(new Node<T>(d, node.aaR.x, node.aaR.y, hw, hh));
					node.nodes.push(new Node<T>(d, node.aaR.x + hw, node.aaR.y, hw, hh));
					node.nodes.push(new Node<T>(d, node.aaR.x, node.aaR.y + hh, hw, hh));
					node.nodes.push(new Node<T>(d, node.aaR.x + hw, node.aaR.y + hh, hw, hh));
				}

				var i = 0;
				if (aaR.y > hy)
					i += 2;
				if (aaR.x > hx)
					++i;

				node = node.nodes[i];
			}
			node.items.push({item : item, aaR : aaR});
			if (!node.aaR.contains(aaR))
			{
				logError(node.aaR);
				logError(aaR);
				throw new Error("FUCKED UP!");
			}
		}



		public getIntersecting(aaR:kr3m.geom.AxisAlignedRectangle2d):T[]
		{
			var workset = [this.root];
			var items:T[] = [];
			var stepCount = 0;
			var nodeCount = 0;
			var itemCount = 0;
			while (workset.length > 0)
			{
				var node = workset.pop();
				for (var i = 0; i < node.items.length; ++i)
				{
					++stepCount;
					++itemCount;
					if (node.items[i].aaR.intersects(aaR))
						items.push(node.items[i].item);
				}
				for (var i = 0; i < node.nodes.length; ++i)
				{
					++stepCount;
					++nodeCount;
					if (node.nodes[i].aaR.intersects(aaR))
						workset.push(node.nodes[i]);
				}
			}
			logProfilingLow("stepCount", stepCount);
			logProfilingLow("nodeCount", nodeCount);
			logProfilingLow("itemCount", itemCount);
			return items;
		}
	}
}

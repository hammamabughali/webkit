//# EXPERIMENTAL
module kr3m.algorithms.compression
{
	export class Huffman
	{
		public static buildCode(tokenWeights:{[token:string]:number}):{[token:string]:string}
		{
			type Node = {t?:string, w:number, p?:Node, l?:Node, r?:Node};
			var nodes:Node[] = [];
			for (var token in tokenWeights)
				nodes.push({t : token, w : tokenWeights[token]});

			if (nodes.length < 1)
				return {};

			var leafNodes = nodes.slice();

			nodes.sort((a, b) => b.w - a.w);

			while (nodes.length > 1)
			{
				var b = nodes.pop();
				var a = nodes.pop();
				var c = {l : a, r : b, w : a.w + b.w};
				a.p = c;
				b.p = c;
				for (var i = nodes.length; i > 0; --i)
				{
					if (nodes[i - 1].w >= c.w)
					{
						nodes.splice(i, 0, c);
						break;
					}
				}
				if (i <= 0)
					nodes.unshift(c);
			}

			var bits:{[token:string]:string} = {};
			for (var i = 0; i < leafNodes.length; ++i)
			{
				var bit = "1";
				var n = leafNodes[i];
				while (n.p)
				{
					bit = (n.p.l == n ? "0" : "1") + bit;
					n = n.p;
				}
				bits[leafNodes[i].t] = bit;
			}
			return bits;
		}
	}
}
//# /EXPERIMENTAL

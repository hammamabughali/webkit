module kr3m.algorithms.search
{
	class RadixTrieNode<T>
	{
		public data:T;
		public edges:{p:string, node:RadixTrieNode<T>}[] = [];
	}



	export class RadixTrie<T>
	{
		private root = new RadixTrieNode<T>();



		public dumpNode(node:RadixTrieNode<T>, padding:string):void
		{
			for (var i = 0; i < node.edges.length; ++i)
			{
				if (node.edges[i].node.data !== undefined)
					logDebug(padding + node.edges[i].p, "->", node.edges[i].node.data);
				else
					logDebug(padding + node.edges[i].p);

				this.dumpNode(node.edges[i].node, padding + node.edges[i].p.replace(/./g, " "));
			}
		}



		public dump():void
		{
			logDebug("[RadixTrie]");
			this.dumpNode(this.root, "");
			logDebug("[/RadixTrie]");
		}



		private prefix(a:string, b:string):string
		{
			for (var i = 0; i < a.length; ++i)
			{
				if (a.charAt(i) != b.charAt(i))
					return a.slice(0, i);
			}
			return a;
		}



		public set(word:string, data:T = null):void
		{
			var node = this.root;
			while (node.edges.length && word.length)
			{
				for (var i = 0; i < node.edges.length; ++i)
				{
					var p = this.prefix(word, node.edges[i].p);
					if (p)
						break;
				}
				if (i >= node.edges.length)
					break;

				if (node.edges[i].p != p)
				{
					var newNode = new RadixTrieNode<T>();
					newNode.edges.push({p:node.edges[i].p.slice(p.length), node:node.edges[i].node});
					node.edges[i].p = p;
					node.edges[i].node = newNode;
				}
				else
				{
					word = word.slice(p.length);
					node = node.edges[i].node;
				}
			}

			if (word)
			{
				var newNode = new RadixTrieNode<T>();
				newNode.data = data;
				node.edges.push({p:word, node:newNode});
			}
			else
			{
				node.data = data;
			}
		}



		public get(word:string):T
		{
			var node = this.root;
			while (node.edges.length)
			{
				for (var i = 0; i < node.edges.length; ++i)
				{
					if (word.slice(0, node.edges[i].p.length) == node.edges[i].p)
						break;
				}

				if (i >= node.edges.length)
					break;

				word = word.slice(node.edges[i].p.length);
				node = node.edges[i].node;
			}
			return word ? undefined : node.data;
		}



		private nodeSize(node:RadixTrieNode<T>):number
		{
			var res = 1;
			for (var i = 0; i < node.edges.length; ++i)
				res += this.nodeSize(node.edges[i].node);
			return res;
		}



		public size():number
		{
			return this.nodeSize(this.root);
		}



		public getByPrefix(word:string, limit?:number):{word:string, data:T}[]
		{
			if (!word)
				return [];

			word = word.toLowerCase();

			var prefix = "";
			var node = this.root;
			while (word && node.edges.length)
			{
				for (var i = 0; i < node.edges.length; ++i)
				{
					if (word.slice(0, node.edges[i].p.length) == node.edges[i].p.slice(0, word.length))
						break;
				}

				if (i >= node.edges.length)
					break;

				prefix += node.edges[i].p;
				word = word.slice(node.edges[i].p.length);
				node = node.edges[i].node;
			}
			if (word)
				return [];

			var results:{word:string, data:T}[] = [];
			if (node.data !== undefined)
				results.push({word : prefix, data:node.data});

			var nodeStack:RadixTrieNode<T>[] = [node];
			var edgeStack:number[] = [0];
			var prefixStack:string[] = [prefix];
			while (nodeStack.length)
			{
				if (limit && results.length >= limit)
					break;

				var lastNode = nodeStack[nodeStack.length - 1];
				var lastEdge = edgeStack[edgeStack.length - 1];
				if (lastEdge < lastNode.edges.length)
				{
					prefixStack.push(lastNode.edges[lastEdge].p);
					nodeStack.push(lastNode.edges[lastEdge].node);
					edgeStack.push(0);

					lastNode = nodeStack[nodeStack.length - 1];
					if (lastNode.data !== undefined)
						results.push({word : prefixStack.join(""), data:lastNode.data});
				}
				else
				{
					prefixStack.pop();
					nodeStack.pop();
					edgeStack.pop();
					++edgeStack[edgeStack.length - 1];
				}
			}
			return results;
		}



		public getWordsByPrefix(word:string, limit?:number):string[]
		{
			return this.getByPrefix(word, limit).map(item => item.word);
		}
	}
}

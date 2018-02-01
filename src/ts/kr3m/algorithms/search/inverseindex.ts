/// <reference path="../../util/util.ts"/>



module kr3m.algorithms.search
{
	export class InverseIndex
	{
		private words:{[word:string]:{[key:string]:number}} = {};



		constructor(private minWordLength:number = 3)
		{
		}



		/*
			Das gleiche wie find(), gibt aber außerdem noch mit, für
			welche Suchwöter keine Ergebnisse gefunden wurden. Gibt
			[Ergebnisse, Fehlschläge] zurück.
		*/
		public findWithMisses(
			query:string,
			limit:number = 5):[string[], string[]]
		{
			var keys:string[] = [];
			var misses:string[] = [];
			var re = new RegExp("\\b\\S{" + this.minWordLength + ",}\\b", "g");
			var matches = re.exec(query);
			while (matches)
			{
				var word = matches[0].toLowerCase();
				if (this.words[word])
				{
					for (var key in this.words[word])
						keys.push(key);
				}
				else
				{
					misses.push(word);
				}
				matches = re.exec(query);
			}
			keys = kr3m.util.Util.removeDuplicates(keys);
			if (limit > 0)
				keys = keys.slice(0, limit);
			return [keys, misses];
		}



		/*
			Gibt limit (unbegrenzt falls limit = 0) Einträge aus den
			Suchdaten zurück, die zu query passen. Wie gut die Einträge
			zu den Suchdaten passen wird nicht berücksichtigt.
		*/
		public find(query:string, limit:number = 5):string[]
		{
			var [keys, misses] = this.findWithMisses(query, limit);
			return keys;
		}



		/*
			Gibt limit Einträge und ihre Relevanz (0-1) aus den Suchdaten
			zurück, die zu query passen. Einträge, die sehr gut zu query
			passen (hohe Relevanz) werden vor nicht so gut passenden (niedrige
			Relevanz) zurückgegeben.
		*/
		public findRelevant(query:string, limit:number = 5):[string[], number]
		{
			var keyWeights:{[key:string]:number} = {};
			var re = new RegExp("\\b\\S{" + this.minWordLength + ",}\\b", "g");
			var matches = re.exec(query);
			while (matches)
			{
				var word = matches[0].toLowerCase();
				if (this.words[word])
				{
					for (var key in this.words[word])
						keyWeights[key] = Math.max(keyWeights[key], this.words[word][key]);
				}
				matches = re.exec(query);
			}
			var relevances:any[] = [];
			for (var key in keyWeights)
				relevances.push({key : key, relevance : keyWeights[key]});
			kr3m.util.Util.sortBy(relevances, "relevance", false);
			var results = kr3m.util.Util.gather(relevances.slice(0, limit), "key");
			return [results, relevances.length];
		}



		public insert(
			word:string, key:string):void
		{
			if (word.length < this.minWordLength)
				return;

			word = word.toLowerCase();

			if (!this.words[word])
				this.words[word] = {};

			this.words[word][key] = (this.words[word][key] || 0) + 1;
		}



		public parse(
			content:string, key?:string):void
		{
			key = key || "";
			var re = new RegExp("\\b\\S{" + this.minWordLength + ",}\\b", "g");
			var matches = re.exec(content);
			while (matches)
			{
				this.insert(matches[0], key);
				matches = re.exec(content);
			}
		}



		public normalizeWeights(
			countThreshold:number = 100):void
		{
			for (var word in this.words)
			{
				if (Object.keys(this.words[word]).length >= countThreshold)
				{
					delete this.words[word];
					continue;
				}

				var total = 0;
				for (var key in this.words[word])
					total += this.words[word][key];

				for (var key in this.words[word])
					this.words[word][key] /= total;
			}
		}
	}
}

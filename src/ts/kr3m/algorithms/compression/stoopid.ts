/// <reference path="bitstream.ts"/>
/// <reference path="huffman.ts"/>



//# EXPERIMENTAL
module kr3m.algorithms.compression
{
	/*
		Experimental and horribly naive text compression tool.

		Don't use this, its worse than uncompressed text right now!
	*/
	export class Stoopid
	{
		public static compress(input:string):string
		{
			//# FIXME: have to escape the seperator if it is contained in input
			var words = input.split(/\b/).filter(word => word);
			var wordCounts:{[word:string]:number} = {};
			for (var i = 0; i < words.length; ++i)
				wordCounts[words[i]] = (wordCounts[words[i]] || 0) + 1;

			var uniqueWords = Object.keys(wordCounts);
			uniqueWords.sort((a, b) => b.length * wordCounts[b] - a.length * wordCounts[a]);

			var wordBits = Huffman.buildCode(wordCounts);
			var bitStream = new BitStream();
			words.forEach(word => bitStream.pushBitString(wordBits[word]));

			var compressed = "0";
			compressed += "§" + uniqueWords.join("§");
			compressed += "§" + uniqueWords.map(uw => wordBits[uw]).join("§");
			compressed += "§" + bitStream.flushBase64();
			return compressed;
		}



		public static decompress(compressed:string):string
		{
			//# FIXME: have to unescape the seperator if it is contained in input
			var parts = compressed.split("§");
			var version = parseInt(parts[0], 10);
			if (version == 0)
			{
				if (parts.length < 3)
					return "";

				var words = parts.slice(1, -1);
				var bitStream = new BitStream();
				bitStream.pushBase64(parts[parts.length - 1]);

				var bits = bitStream.flushBitString();
				var output = "";
				//# FIXME: NYI decompress
				return output;
			}

			throw new Error("unknown Stoopid compression version: " + version);
		}
	}
}
//# /EXPERIMENTAL

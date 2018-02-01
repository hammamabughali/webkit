/// <reference path="../../util/json.ts"/>



//# EXPERIMENTAL
module kr3m.algorithms.compression
{
	export class LZW
	{
		private static generatePalette(
			input:string,
			callback:(palette:string[], compressed:number[]) => void):void
		{
			//# TODO: generatePalette should use kr3m.async.Burst
			var palette:string[] = [];
			var compressed:number[] = [];

			for (var i = 0; i < input.length; ++i)
			{
				if (palette.indexOf(input.charAt(i)) < 0)
					palette.push(input.charAt(i));
			}
			input += "\0";

			for (var i = 0; i < input.length; i += j - 1)
			{
				var j = 1;
				do
				{
					++j;
					var token = input.slice(i, i + j);
				}
				while (palette.indexOf(token) >= 0);
				compressed.push(palette.indexOf(token.slice(0, -1)));
				palette.push(token);
			}
			compressed = compressed.slice(0, -1);
			callback(palette, compressed);
		}



		private static stripUnused(palette:string[], compressed:number[]):void
		{
			//# TODO: stripUnused should use kr3m.async.Burst
			var used:any = {};
			for (var i = 0; i < palette.length; ++i)
				used[i] = false;
			for (var i = 0; i < compressed.length; ++i)
				used[compressed[i]] = true;
			var offset = 0;
			var offsets:number[] = [];
			for (var i = 0; i < palette.length; ++i)
			{
				offsets.push(offset);
				if (!used[i + offset])
				{
					palette.splice(i, 1);
					--i;
					++offset;
				}
			}
			for (var i = 0; i < compressed.length; ++i)
				compressed[i] -= offsets[compressed[i]];
		}



		public static compressText(
			input:string,
			callback:(palette:string[], compressed:number[]) => void):void
		{
			LZW.generatePalette(input, (palette:string[], compressed:number[]) =>
			{
				// TODO: replace shorter tokens through longer tokens where applicable
				LZW.stripUnused(palette, compressed);
				callback(palette, compressed);
			});
		}



		public static decompressText(
			palette:string[], compressed:number[],
			callback:(output:string) => void):void
		{
			//# TODO: decompressText should use kr3m.async.Burst
			var output = "";
			for (var i = 0; i < compressed.length; ++i)
				output += palette[compressed[i]];
			callback(output);
		}



		public static wrap(
			palette:string[],
			compressed:number[],
			callback:(wrapped:string) => void):void
		{
			//# TODO: need a more efficient wrapping method
			var wrapped = kr3m.util.Json.encode({p : palette, c : compressed});
			callback(wrapped);
		}



		public static unwrap(
			wrapped:string,
			callback:(palette:string[], compressed:number[]) => void):void
		{
			var data = kr3m.util.Json.decode(wrapped);
			callback(data.p, data.c);
		}
	}
}
//# /EXPERIMENTAL

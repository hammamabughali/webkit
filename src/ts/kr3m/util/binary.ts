/// <reference path="../lib/node.ts"/>



module kr3m.util
{
	export class Binary
	{
		/*
			Findet das Vorkommen des needle Buffers im haystack NodeBuffer und
			gibt die Position zurück, oder -1, falls needle nicht gefunden
			wird.

			Die aktuelle, naive Implementierung ist einfach aber langsam. Bei
			Bedarf sollte man was schnelleres Umsetzen.
		*/
		public static indexOf(
			needle:NodeBuffer,
			haystack:NodeBuffer,
			offset:number = 0):number
		{
			if (!needle || !haystack)
				return -1;

			while (offset + needle.length <= haystack.length)
			{
				for (var i = 0; i < needle.length; ++i)
				{
					if (needle[i] != haystack[offset + i])
						break;
				}

				if (i >= needle.length)
					return offset;

				++offset;
			}
			return -1;
		}



		public static getNextSplitPart(
			buffer:NodeBuffer,
			seperator:NodeBuffer,
			offset:number = 0):NodeBuffer
		{
			if (!buffer || buffer.length == 0 || !seperator || seperator.length == 0)
				return null;

			var pos = Binary.indexOf(seperator, buffer, offset);
			if (pos == -1)
			{
				if (offset < buffer.length)
					return buffer.slice(offset);
				else
					return null;
			}

			return buffer.slice(offset, pos);
		}



		public static split(buffer:NodeBuffer, seperator:NodeBuffer):NodeBuffer[]
		{
			var result:NodeBuffer[] = [];

			var offset:number = 0;
			var pos:number = offset;
			while (true)
			{
				pos = Binary.indexOf(seperator, buffer, offset);
				if (pos > -1)
				{
					if (pos > offset)
						result.push(buffer.slice(offset, pos));
					offset = pos + seperator.length;
					pos = offset;
				}
				else
				{
					break;
				}
			}
			if (offset < buffer.length)
				result.push(buffer.slice(offset));
			return result;
		}
	}
}

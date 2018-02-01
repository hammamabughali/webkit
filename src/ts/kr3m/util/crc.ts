/// <reference path="../lib/node.ts"/>



module kr3m.util
{
	export class Crc
	{
		private static CRC32_TABLE:number[] = null;



		public get32Bit(buffer:Buffer):number
		{
			if (!buffer || buffer.length == 0)
				return 0;

			var t = Crc.CRC32_TABLE;
			if (!t)
			{
				t = [];
				for (var i = 0; i < 256; ++i)
				{
					var c = i;
					for (var j = 0; j < 8; ++j)
						c = ((c & 1) ? (0xEdb88320 ^ (c >>> 1)) : (c >>> 1));
					t.push(c);
				}
				Crc.CRC32_TABLE = t;
			}

			var crc = 0 ^ -1; // 0 ^ -1 ist in allen anderen Programmiersprachen das gleiche wie -1, nur halt nicht in Javascript
			var len = buffer.length;
			for (var i = 0; i < len; ++i)
			{
				var p = (buffer[i] ^ crc) & 0xff;
				crc = crc >>> 8;
				crc = crc ^ t[p];
			}
			crc = (crc ^ -1) >>> 0; // und hier genau das gleiche Problem
			return crc;
		}
	}
}

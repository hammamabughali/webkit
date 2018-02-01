/// <reference path="../lib/node.ts"/>



//# EXPERIMENTAL
module kr3m.audio
{
	export class WavHeader
	{
		public fileSize:number;
		public numChannels:number;
		public sampleRate:number;
		public bitsPerSample:number;
		public dataSize:number;
		public dataOffset:number;
		public duration:number;
	}



	export class Wav
	{
		private readHeader(buffer:any):WavHeader
		{
			var mb = buffer.slice(0, 4).toString();
			if (mb != "RIFF")
				return null;

			var format = buffer.slice(8, 12).toString();
			if (format != "WAVE")
				return null;

			var header = new WavHeader();
			header.fileSize = buffer.readUInt32LE(4);
			var offset = 12;
			while (offset < header.fileSize)
			{
				var chunkType = buffer.slice(offset, offset + 4).toString();
				var chunkSize = buffer.readUInt32LE(offset + 4);
				if (chunkType == "fmt ")
				{
					header.numChannels = buffer.readUInt16LE(offset + 10);
					header.sampleRate = buffer.readUInt32LE(offset + 12);
					header.bitsPerSample = buffer.readUInt16LE(offset + 22);
				}
				else if (chunkType == "data")
				{
					header.dataSize = chunkSize;
					header.dataOffset = offset + 8;
				}
				offset += chunkSize + 8;
			}
			return header;
		}



		private readSamples(buffer, header:WavHeader):number[][]
		{
			var offset = header.dataOffset;
			var samples:number[][] = [];
			for (var i = 0; i < header.numChannels; ++i)
				samples.push([]);

			if (header.bitsPerSample == 24)
			{
				while (offset < header.dataSize)
				{
					//# ERROR: readSamples NYI
				}
			}
			else
			{
				logError("unsupported wav bits per sample", header.bitsPerSample);
			}
			return samples;
		}



		public loadFile(
			path:string,
			callback:(header:WavHeader, samples:number[][]) => void):void
		{
			fsLib.readFile(path, (err:Error, buffer:any) =>
			{
				if (err)
				{
					logError(err);
					return callback(null, null);
				}

				var header = this.readHeader(buffer);
				if (!header)
					return callback(null, null);

				var samples = this.readSamples(buffer, header);
				callback(header, samples);
			});
		}
	}
}
//# /EXPERIMENTAL

/// <reference path="../../images/files/abstract.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.images.files
{
	class TgaHeader
	{
		public imageIdLength:number;
		public colorMapType:number;
		public imageType:number;
		public width:number;
		public height:number;
		public colorDepth:number;
	}



	export class Tga extends Abstract
	{
		private readHeader(buffer:Buffer):TgaHeader
		{
			var header = new TgaHeader();
			header.imageIdLength = buffer.readUInt8(0);
			header.colorMapType = buffer.readUInt8(1);
			header.imageType = buffer.readUInt8(2);
			header.width = buffer.readUInt16LE(12);
			header.height = buffer.readUInt16LE(14);
			header.colorDepth = buffer.readUInt8(16) / 8;
			return header;
		}



		private decompress(header:TgaHeader, buffer:Buffer):void
		{
			if (header.imageType == 10 && this.colorDepth == 3)
			{
				//# TODO: compressed TGA funktioniert irgendwie noch nicht ganz
				var offsetWrite = 0;
				var offsetRead = 18 + header.imageIdLength;
				while (offsetWrite < this.pixelBuffer.length)
				{
					var packetHeader = buffer.readUInt8(offsetRead);
					if (packetHeader > 127)
					{
						//compressed data
						packetHeader -= 127;
						var blue = buffer.readUInt8(offsetRead++);
						var green = buffer.readUInt8(offsetRead++);
						var red = buffer.readUInt8(offsetRead++);
						while (packetHeader)
						{
							this.pixelBuffer.writeUInt8(red, offsetWrite++);
							this.pixelBuffer.writeUInt8(green, offsetWrite++);
							this.pixelBuffer.writeUInt8(blue, offsetWrite++);
							--packetHeader;
						}
					}
					else
					{
						//raw data
						++packetHeader;
						while (packetHeader)
						{
							var blue = buffer.readUInt8(offsetRead++);
							var green = buffer.readUInt8(offsetRead++);
							var red = buffer.readUInt8(offsetRead++);
							this.pixelBuffer.writeUInt8(red, offsetWrite++);
							this.pixelBuffer.writeUInt8(green, offsetWrite++);
							this.pixelBuffer.writeUInt8(blue, offsetWrite++);
							--packetHeader;
						}
					}
				}
			}
			else if (header.imageType == 10 && this.colorDepth == 4)
			{
				//# TODO: compressed TGA funktioniert irgendwie noch nicht ganz
				var offsetWrite = 0;
				var offsetRead = 18 + header.imageIdLength;
				while (offsetWrite < this.pixelBuffer.length)
				{
					var packetHeader = buffer.readUInt8(offsetRead);
					if (packetHeader > 127)
					{
						//compressed data
						packetHeader -= 127;
						var blue = buffer.readUInt8(offsetRead++);
						var green = buffer.readUInt8(offsetRead++);
						var red = buffer.readUInt8(offsetRead++);
						var alpha = buffer.readUInt8(offsetRead++);
						while (packetHeader)
						{
							this.pixelBuffer.writeUInt8(red, offsetWrite++);
							this.pixelBuffer.writeUInt8(green, offsetWrite++);
							this.pixelBuffer.writeUInt8(blue, offsetWrite++);
							this.pixelBuffer.writeUInt8(alpha, offsetWrite++);
							--packetHeader;
						}
					}
					else
					{
						//raw data
						++packetHeader;
						while (packetHeader)
						{
							var blue = buffer.readUInt8(offsetRead++);
							var green = buffer.readUInt8(offsetRead++);
							var red = buffer.readUInt8(offsetRead++);
							var alpha = buffer.readUInt8(offsetRead++);
							this.pixelBuffer.writeUInt8(red, offsetWrite++);
							this.pixelBuffer.writeUInt8(green, offsetWrite++);
							this.pixelBuffer.writeUInt8(blue, offsetWrite++);
							this.pixelBuffer.writeUInt8(alpha, offsetWrite++);
							--packetHeader;
						}
					}
				}
			}
			else if (header.imageType == 2 && this.colorDepth == 4)
			{
				var offsetWrite = 0;
				var offsetRead = 18 + header.imageIdLength;
				while (offsetWrite < this.pixelBuffer.length)
				{
					var blue = buffer.readUInt8(offsetRead++);
					var green = buffer.readUInt8(offsetRead++);
					var red = buffer.readUInt8(offsetRead++);
					var alpha = buffer.readUInt8(offsetRead++);
					this.pixelBuffer.writeUInt8(red, offsetWrite++);
					this.pixelBuffer.writeUInt8(green, offsetWrite++);
					this.pixelBuffer.writeUInt8(blue, offsetWrite++);
					this.pixelBuffer.writeUInt8(alpha, offsetWrite++);
				}
			}
			else
			{
				throw new Error("unsupported file specification");
			}
		}



		public loadLocal(
			filePath:string,
			callback:StatusCallback):void
		{
			fsLib.readFile(filePath, (err:Error, buffer:Buffer) =>
			{
				if (err)
				{
					logError(err);
					return callback(kr3m.ERROR_FILE);
				}

				var header = this.readHeader(buffer);
				this.setSize(header.width, header.height, header.colorDepth);
				this.decompress(header, buffer);
				callback(kr3m.SUCCESS);
			});
		}
	}
}

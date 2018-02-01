/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/node.ts"/>



module kr3m.images.files
{
	export abstract class Abstract
	{
		protected colorDepth = 0;
		protected width = 0;
		protected height = 0;
		protected pixelBuffer:Buffer;



		public getWidth():number
		{
			return this.width;
		}



		public getHeight():number
		{
			return this.height;
		}



		public setSize(
			width:number,
			height:number,
			colorDepth:number = 4):void
		{
			this.width = width;
			this.height = height;
			this.colorDepth = colorDepth;
			this.pixelBuffer = Buffer.alloc(width * height * colorDepth);
		}



		public getColorAt(x:number, y:number):number
		{
			var offset = (y * this.width + x) * this.colorDepth;
			switch (this.colorDepth)
			{
				case 3:
					return this.pixelBuffer.readUInt8(offset) << 16 + this.pixelBuffer.readUInt8(offset + 1) << 8 + this.pixelBuffer.readUInt8(offset + 2);

				case 4:
					return this.pixelBuffer.readUInt32BE(offset);
			}
			throw new Error("pixel buffer has invalid color depth");
		}



		public abstract loadLocal(filePath:string, callback:StatusCallback):void;
	}
}

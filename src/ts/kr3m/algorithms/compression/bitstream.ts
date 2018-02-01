//# EXPERIMENTAL
module kr3m.algorithms.compression
{
	/*
		Helper class for working with bit-streams and variable length bit-chunks.

		See also:
			https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
	*/
	export class BitStream
	{
		private buffer = new ArrayBuffer(1024);
		private view = new DataView(this.buffer);
		private cursor = 0;
		private cursorSize = 0;
		private offset = 0;



		private reallocateMemory():void
		{
			var oldBuffer = this.buffer;
			var oldView = this.view;

			this.buffer = new ArrayBuffer(this.buffer.byteLength * 2);
			this.view = new DataView(this.buffer);

			for (var i = 0; i < oldView.byteLength; ++i)
				this.view.setInt8(i, oldView.getInt8(i));
		}



		private pushBit(isSet:boolean):void
		{
			this.cursor = this.cursor * 2 + (isSet ? 1 : 0);
			++this.cursorSize;
			if (this.cursorSize == 15)
			{
				this.view.setUint16(this.offset, this.cursor, false);
				this.cursor = 0;
				this.cursorSize = 0;
				this.offset += 2;
				if (this.offset >= this.buffer.byteLength)
					this.reallocateMemory();
			}
		}



		public pushBase64(base64:string):this
		{
			//# FIXME: NYI pushBase64
			return this;
		}



		public pushBitString(bits:string):this
		{
			for (var i = 0; i < bits.length; ++i)
				this.pushBit(bits.charAt(i) == "1");
			return this;
		}



		public flushBitString():string
		{
			//# FIXME: NYI flushBitString
			return undefined;
		}



		public flushBase64():string
		{
//# CLIENT
			return btoa(this.flushUtf8());
//# /CLIENT
//# !CLIENT
			return encodeBase64EncodedString(this.flushUtf8());
//# /!CLIENT
		}



		public flushUtf8():string
		{
			var result = String.fromCharCode(15 - this.cursorSize);
			for (var i = 0; i < this.offset; i += 2)
				result += String.fromCharCode(this.view.getUint16(i, false));
			if (this.cursorSize > 0)
				result += String.fromCharCode(this.cursor);
			return result;
		}
	}
}
//# /EXPERIMENTAL

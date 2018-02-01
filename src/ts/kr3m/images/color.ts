module kr3m.images
{
	export class Color
	{
		public r:number;
		public g:number;
		public b:number;
		public a:number;



		constructor(r:number = 0, g:number = 0, b:number = 0, a:number = 255)
		{
			this.r = Math.min(Math.max(Math.floor(r), 0), 255);
			this.g = Math.min(Math.max(Math.floor(g), 0), 255);
			this.b = Math.min(Math.max(Math.floor(b), 0), 255);
			this.a = Math.min(Math.max(Math.floor(a), 0), 255);
		}



		public getTransparent(factor:number):kr3m.images.Color
		{
			return new kr3m.images.Color(this.r, this.g, this.b, this.a * factor);
		}



		public toNumber(littleEndian:boolean = false):number
		{
			if (littleEndian)
				return (this.a << 24) + (this.b << 16) + (this.g << 8) + this.r;
			else
				return (this.r << 24) + (this.g << 16) + (this.b << 8) + this.a;
		}



		public toString():string
		{
			return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a +")";
		}



		public static getImageDataColor(
			imageData:any,
			x:number,
			y:number):kr3m.images.Color
		{
			var offset = (imageData.width * y + x) * 4;
			var data = imageData.data;
			return new kr3m.images.Color(data[offset], data[offset + 1], data[offset + 2], data[offset + 3]);
		}



		public static setImageDataColor(
			imageData:any,
			x:number,
			y:number,
			color:kr3m.images.Color):void
		{
			var offset = (imageData.width * y + x) * 4;
			var data = imageData.data;
			data[offset] = color.r;
			data[offset + 1] = color.g;
			data[offset + 2] = color.b;
			data[offset + 3] = color.a;
		}
	}



	export var COLOR_BLACK = new kr3m.images.Color(0, 0, 0, 255);
	export var COLOR_BLUE = new kr3m.images.Color(0, 0, 255, 255);
	export var COLOR_GREEN = new kr3m.images.Color(0, 255, 0, 255);
	export var COLOR_RED = new kr3m.images.Color(255, 0, 0, 255);
	export var COLOR_WHITE = new kr3m.images.Color(255, 255, 255, 255);
}

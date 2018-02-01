module gf.utils
{
	export class Frame
	{
		public frame:PIXI.Rectangle;
		public index:number;
		public name:string;
		public orig:PIXI.Rectangle;
		public pivot:PIXI.Point;
		public rotated:boolean;
		public spriteSourceSize:PIXI.Rectangle;
		public sourceSize:PIXI.Rectangle;
		public trim:PIXI.Rectangle;
		public trimmed:boolean;
		public uid:number;



		/*
			A Frame is a single frame of a spritesheet image
				@param {number} index - The index of this Frame within the FrameData set it is being added to.
			@param {any}  data - The frame data.
			@param {string} name - The name of the frame. In Texture Atlas data this is usually set to the filename.
			@param {number} uid - Internal uid key.
			@param {number} resolution - Target resolution.
		*/
		constructor(index:number, data:any, name:string, uid:number, resolution:number)
		{
			this.index = index;
			this.name = name;
			this.uid = uid;
			this.trimmed = false;

			this.orig = new PIXI.Rectangle(0, 0, data.sourceSize.w / resolution, data.sourceSize.h / resolution);
			this.pivot = data.pivot || new PIXI.Point();

			if (data.rotated)
			{
				this.rotated = true;
				this.frame = new PIXI.Rectangle(data.frame.x / resolution, data.frame.y / resolution, data.frame.h / resolution, data.frame.w / resolution);
			}
			else
			{
				this.rotated = false;
				this.frame = new PIXI.Rectangle(data.frame.x / resolution, data.frame.y / resolution, data.frame.w / resolution, data.frame.h / resolution);
			}

			if (data.trimmed)
			{
				this.trimmed = true;
				this.trim = new PIXI.Rectangle(
					data.spriteSourceSize.x / resolution,
					data.spriteSourceSize.y / resolution,
					data.spriteSourceSize.w / resolution,
					data.spriteSourceSize.h / resolution
				);
			}
		}
	}
}

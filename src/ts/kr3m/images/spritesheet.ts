/// <reference path="../loading/loader.ts"/>
/// <reference path="../util/map.ts"/>



module kr3m.images
{
	export class SpriteSheet
	{
		private data:any = null;
		private namedFrames = new kr3m.util.Map<number>();



		constructor(
			spriteSheetUri:string,
			loadedCallback:() => void)
		{
			var loader = kr3m.loading.Loader.getInstance();
			loader.queue(spriteSheetUri, (data:any) =>
			{
				this.data = data;
				this.initNamedFrames();
				loadedCallback();
			});
			loader.load();
		}



		public getData():any
		{
			return this.data;
		}



		private initNamedFrames():void
		{
			for (var i = 0; i < this.data.frames.length; ++i)
			{
				if (typeof this.data.frames[i].name != "undefined")
					this.namedFrames.set(this.data.frames[i].name, i);
			}
		}



		public getFrameByName(name:string):number
		{
			return this.namedFrames.get(name);
		}



		public getFrameCount():number
		{
			return this.data ? this.data.frames.length : 0;
		}



		public getCssByFrame(frame:number):any
		{
			var css =
			{
				"background-image":"url('" + this.data.imageUrl + "')",
				"background-position":"-" + this.data.frames[frame].x + "px -" + this.data.frames[frame].y + "px"
			};
			return css;
		}
	}
}

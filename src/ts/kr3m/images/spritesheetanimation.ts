/// <reference path="../images/spritesheet.ts"/>



module kr3m.images
{
	export class SpriteSheetAnimation extends kr3m.images.SpriteSheet
	{
		private frameDuration:number;
		private accumulated:number;
		private frame:number;
		private isPaused:boolean;

		private events:kr3m.util.Map<string>;
		private listeners:Array<(event:string) => void>;



		constructor(
			animName:string, spriteSheetUri:string,
			loadedCallback:() => void)
		{
			this.frameDuration = 0;
			this.accumulated = 0;
			this.frame = 0;
			this.isPaused = false;

			this.events = new kr3m.util.Map<string>();
			this.listeners = [];

			super(spriteSheetUri, () =>
			{
				this.initFps();
				this.initEvents();
				loadedCallback();
			});
		}



		private initFps():void
		{
			var data = this.getData();
			if (typeof data.fps != "undefined")
				this.setFps(parseInt(data.fps));
		}



		private initEvents():void
		{
			var data = this.getData();
			for (var i = 0; i < data.frames.length; ++i)
			{
				if (typeof data.frames[i].event != "undefined")
					this.events.set(i, data.frames[i].event);
			}
		}



		public setFps(fps:number):void
		{
			if (fps > 0)
				this.frameDuration = 1000 / fps;
			else
				this.frameDuration = 0;
		}



		public pause():void
		{
			this.isPaused = true;
		}



		public resume():void
		{
			this.isPaused = false;
		}



		public gotoAndStop(frame:number):void
		{
			this.frame = frame;
			this.pause();
		}



		public gotoAndPlay(frame:number):void
		{
			this.play();
			this.frame = frame - 1;
		}



		public play():void
		{
			this.accumulated = this.frameDuration;
			this.frame = this.getFrameCount() - 1;
			this.isPaused = false;
		}



		public accumulateTime(passedTime:number):void
		{
			if (this.isPaused)
				return;

			var oldFrame = this.frame;
			if (this.frameDuration > 0)
			{
				this.accumulated += passedTime;
				var delta = Math.floor(this.accumulated / this.frameDuration);
				this.accumulated -= delta * this.frameDuration;
				this.frame += delta;
			}
			else
			{
				++this.frame;
			}
			this.frame = this.frame % this.getFrameCount();
			if (this.frame != oldFrame)
			{
				var event = this.events.get(this.frame);
				if (event)
					this.dispatchEvent(event);
			}
		}



		public getCss():any
		{
			return this.getCssByFrame(this.frame);
		}


		public addEventListener(listener:(event:string) => void):void
		{
			if (!kr3m.util.Util.contains(this.listeners, listener))
				this.listeners.push(listener);
		}



		public removeEventListener(listener:(event:string) => void):void
		{
			kr3m.util.Util.remove(this.listeners, listener);
		}



		private dispatchEvent(event:string):void
		{
			for (var i = 0; i < this.listeners.length; ++i)
				this.listeners[i](event);
		}
	}
}

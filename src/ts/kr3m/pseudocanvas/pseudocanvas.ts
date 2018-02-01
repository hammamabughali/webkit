/// <reference path="../pseudocanvas/spritecontainer.ts"/>



module kr3m.pseudocanvas
{
	export class PseudoCanvas extends kr3m.pseudocanvas.SpriteContainer
	{
		private timer:number = 0;
		private lastTickTime:number = 0;
		private tickQuality:number = 2;
		private frameDuration:number = 0;
		private accumulatedTime:number = 0;



		constructor(parent, width:number = 600, height:number = 400)
		{
			super(parent);
			this.dom.css(
			{
				width:width,
				height:height,
				overflow:"hidden",
				position:"relative"
			});
			this.setFps(20);
		}



		public setFps(fps:number, tickQuality:number = 2):void
		{
			if (fps <= 0 || tickQuality <= 0)
				return;

			if (this.timer > 0)
				clearInterval(this.timer);

			this.tickQuality = tickQuality;
			this.frameDuration = 1000 / fps;
			var tickDuration = this.frameDuration / this.tickQuality;
			setInterval(this.tick.bind(this), tickDuration);
			this.lastTickTime = Date.now();
		}



		private tick():void
		{
			var now = Date.now();
			var passedTime = now - this.lastTickTime;
			this.lastTickTime = now;

			this.accumulatedTime += passedTime;
			if (this.accumulatedTime >= this.frameDuration)
			{
				this.accumulatedTime -= this.frameDuration;
				this.dispatchEnterFrame(this.frameDuration);
				this.updateStyles();
			}
		}
	}
}

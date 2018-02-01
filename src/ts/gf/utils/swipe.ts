module gf.utils
{
	export class Swipe
	{
		private static callbacks: {[swipeId:number]: {callback: (e?: KeyboardEvent) => void, direction:string}};
		private static instance: gf.utils.Swipe;
		private static xDown:number;
		private static yDown:number;

		public static tolerance:number = 50;



		constructor()
		{
			gf.utils.Swipe.instance = this;
		}



		public static add(direction:string, callback: () => void):number
		{
			if (!this.instance) this.getInstance();

			let swipeId:number = PIXI.utils.uid();
			this.callbacks[swipeId] = {callback: callback, direction: direction};
			return swipeId;
		}



		public static remove(swipeId:number):void
		{
			if (!this.instance) this.getInstance();

			if (!this.callbacks[swipeId]) return;

			this.callbacks[swipeId] = null;
			delete this.callbacks[swipeId];
		}



		private static getInstance(): gf.utils.Keyboard
		{
			let self = gf.utils.Swipe;
			if (typeof self.instance == "undefined")
			{
				self.instance = new gf.utils.Swipe();
				this.init();
			}

			return self.instance;
		}



		private static init():void
		{
			document.addEventListener("touchstart", (e:any) => this.onTouchStart(e), false);
			document.addEventListener("touchmove", (e:any) => this.onTouchMove(e), false);
			this.callbacks = {};
		}



		private static onSwipe(direction:string):void
		{
			for (let p in this.callbacks)
			{
				if (this.callbacks[p] && this.callbacks[p].direction == direction)
					this.callbacks[p].callback();
			}

			this.xDown = null;
			this.yDown = null;
		}



		private static onTouchStart(e:any):void
		{
			this.xDown = e.touches[0].clientX;
			this.yDown = e.touches[0].clientY;
		}



		private static onTouchMove(e:any):void
		{
			if (!this.xDown || !this.yDown) return;

			let xUp:number = e.touches[0].clientX;
			let yUp:number = e.touches[0].clientY;

			let xDiff:number = this.xDown - xUp;
			let yDiff:number = this.yDown - yUp;

			if (Math.abs(xDiff) > Math.abs(yDiff))
			{
				if (xDiff > gf.utils.Swipe.tolerance)
				{
					gf.utils.Swipe.onSwipe(gf.LEFT);
				}
				else if (xDiff < -gf.utils.Swipe.tolerance)
				{
					gf.utils.Swipe.onSwipe(gf.RIGHT);
				}
			}
			else
			{
				if (yDiff > gf.utils.Swipe.tolerance)
				{
					gf.utils.Swipe.onSwipe(gf.UP);
				}
				else if (yDiff < -gf.utils.Swipe.tolerance)
				{
					gf.utils.Swipe.onSwipe(gf.DOWN);
				}
			}
		}
	}
}

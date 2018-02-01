module pogo
{
	export class ActiveTouch
	{
		public id:number;
		public x:number;
		public y:number;
		public sx:number;
		public sy:number;



		constructor(touch:Touch)
		{
			this.id = touch.identifier;
			this.x = touch.pageX;
			this.y = touch.pageY;
			this.sx = this.x;
			this.sy = this.y;
		}
	}



	export class Touchscreen
	{
		protected canvas:pogo.Canvas;
		protected touches:ActiveTouch[] = [];



		constructor(canvas:pogo.Canvas)
		{
			this.canvas = canvas;

			this.canvas.setAttribute("tabIndex", 1);
			this.canvas.focus();

			this.canvas.on("touchstart", this.translateTouchEvent.bind(this, this.touchStart.bind(this)));
			this.canvas.on("touchmove", this.translateTouchEvent.bind(this, this.touchMove.bind(this)));
			this.canvas.on("touchend", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
			this.canvas.on("touchcancel", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
			this.canvas.on("touchleave", this.translateTouchEvent.bind(this, this.touchEnd.bind(this)));
		}



		public getTouchesInArea(
			x:number,
			y:number,
			w:number,
			h:number):ActiveTouch[]
		{
			var result:ActiveTouch[] = [];
			for (var i = 0; i < this.touches.length; ++i)
			{
				var t = this.touches[i];
				if (t.x >= x && t.x <= x + w && t.y >= y && t.y <= y + h)
					result.push(t);
			}
			return result;
		}



		public getTouchesStartedInArea(
			x:number,
			y:number,
			w:number,
			h:number):ActiveTouch[]
		{
			var result:ActiveTouch[] = [];
			for (var i = 0; i < this.touches.length; ++i)
			{
				var t = this.touches[i];
				if (t.sx >= x && t.sx <= x + w && t.sy >= y && t.sy <= y + h)
					result.push(t);
			}
			return result;
		}



		protected translateTouchEvent(
			handler:(evt:Touch) => void,
			rawEvent:TouchEvent):void
		{
			rawEvent.preventDefault();
			for (var i = 0; i < rawEvent.changedTouches.length; ++i)
				handler(rawEvent.changedTouches[i]);
		}



		protected touchStart(touch:Touch):void
		{
			var myTouch = new ActiveTouch(touch);
			this.touches.push(myTouch);
		}



		protected touchMove(touch:Touch):void
		{
			var myTouch = kr3m.util.Util.getBy(this.touches, "id", touch.identifier);
			myTouch.x = touch.pageX;
			myTouch.y = touch.pageY;
		}



		protected touchEnd(touch:Touch):void
		{
			kr3m.util.Util.removeBy(this.touches, "id", touch.identifier);
		}
	}
}

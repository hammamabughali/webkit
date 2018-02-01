module gf.utils
{
	export const MOUSE_WHEEL: string = "mouseWheel";



	export class MouseWheel extends PIXI.utils.EventEmitter
	{
		protected events: string[];
		protected mouseWheel: (e?: any) => void;
		protected lowestDelta: number;



		constructor()
		{
			super();

			this.events = ("onwheel" in document || document["documentMode"] >= 9 ) ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];
			this.mouseWheel = (e?: any) =>
			{
				this.onWheel(e);
			};

			if (document.addEventListener)
			{
				for (let i: number = this.events.length; i;)
				{
					window.addEventListener(this.events[--i], this.mouseWheel, false);
				}
			}
			else
			{
				document.onmousewheel = this.mouseWheel;
			}
		}



		protected onWheel(e?: any): void
		{
			e.preventDefault();

			let orgEvent: any = e || window.event;
			let absDelta: number, delta: number, deltaX: number, deltaY: number = 0;

			e.type = "mousewheel";

			if ("detail" in orgEvent)
			{
				deltaY = orgEvent.detail * -1;
			}
			if ("wheelDelta" in orgEvent)
			{
				deltaY = orgEvent.wheelDelta;
			}
			if ("wheelDeltaY" in orgEvent)
			{
				deltaY = orgEvent.wheelDeltaY;
			}
			if ("wheelDeltaX" in orgEvent)
			{
				deltaX = orgEvent.wheelDeltaX * -1;
			}

			if ("axis" in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS)
			{
				deltaX = deltaY * -1;
				deltaY = 0;
			}

			delta = deltaY === 0 ? deltaX : deltaY;

			if ("deltaY" in orgEvent)
			{
				deltaY = orgEvent.deltaY * -1;
				delta = deltaY;
			}
			if ("deltaX" in orgEvent)
			{
				deltaX = orgEvent.deltaX;
				if (deltaY === 0)
				{
					delta = deltaX * -1;
				}
			}

			if (deltaY === 0 && deltaX === 0)
			{
				return;
			}

			absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

			if (!this.lowestDelta || absDelta < this.lowestDelta)
			{
				this.lowestDelta = absDelta;
			}

			e.delta = Math[delta >= 1 ? "floor" : "ceil"](delta / this.lowestDelta);
			e.deltaX = Math[deltaX >= 1 ? "floor" : "ceil"](deltaX / this.lowestDelta);
			e.deltaY = Math[deltaY >= 1 ? "floor" : "ceil"](deltaY / this.lowestDelta);

			this.emit(gf.utils.MOUSE_WHEEL, e);
		}
	}
}

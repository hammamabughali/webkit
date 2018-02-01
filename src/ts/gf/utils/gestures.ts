module gf.utils
{
	export class Gestures extends PIXI.utils.EventEmitter
	{
		protected target: gf.display.IDisplay;
		protected inertia:boolean;
		protected _pinch:any;



		constructor(target: gf.display.IDisplay, inertia:boolean = true)
		{
			super();

			this.target = target;
			this.inertia = inertia;

			this.init();
		}


		protected init():void
		{
			this.target.on("touchstart", (e) => this.pinchStart(e));
			this.target.on("touchend", (e) => this.pinchEnd(e));
			this.target.on("touchendoutside", (e) => this.pinchEnd(e));
		}



		protected pinchStart(e):void
		{
			this.target.on("touchmove", (e) => this.pinchMove(e));
		}



		protected pinchMove(e: PIXI.interaction.InteractionEvent):void
		{
			const originalEvent: TouchEvent = <TouchEvent>e.data.originalEvent;

			if (!originalEvent)  return;

			const t = originalEvent.targetTouches;
			if (!t || t.length < 2) return;

			const dx = t[0].clientX - t[1].clientX;
			const dy = t[0].clientY - t[1].clientY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (!this._pinch)
			{
				this._pinch =
				{
					p:
					{
						distance: distance,
						date: new Date()
					}
				};
				this.emit("pinchstart");
				return;
			}
			const now:any = new Date();
			const interval = now - this._pinch.p.date;
			if (interval < 12) return;

			const center =
			{
				x: (t[0].clientX + t[1].clientX) >> 1,
				y: (t[0].clientY + t[1].clientY) >> 1
			};
			const event =
			{
				scale: distance / this._pinch.p.distance,
				velocity: distance / interval,
				center: center,
				data: e.data
			};
			this.emit("pinchmove", event);
			this._pinch.pp =
			{
				distance: this._pinch.p.distance,
				date: this._pinch.p.date
			};
			this._pinch.p =
			{
				distance: distance,
				date: now
			};
		}



		protected pinchEnd(e: PIXI.interaction.InteractionEvent):void
		{
			this.target.removeListener("touchmove", this.pinchMove);

			if (!this._pinch) return;

			if (this.inertia && this._pinch.pp)
			{
				if (this._pinch.intervalId) return;

				let date:any = new Date();
				let interval = date - this._pinch.p.date;
				let velocity = (this._pinch.p.distance - this._pinch.pp.distance) / interval;
				let center = this._pinch.p.center;
				let distance = this._pinch.p.distance;
				this._pinch.intervalId = setInterval(() =>
				{
					if (Math.abs(velocity) < 0.04)
					{
						clearInterval(this._pinch.intervalId);
						this.target.emit("pinchend");
						this._pinch = null;
						return;
					}
					let updatedDistance = distance + velocity * 12;
					let event =
					{
						scale: updatedDistance / distance,
						velocity: velocity,
						center: center,
						data: e.data
					};
					this.target.emit("pinchmove", event);
					distance = updatedDistance;
					velocity *= 0.8
				}, 12)
			}
			else
			{
				this.emit("pinchend");
				this._pinch = null
			}
		}
	}
}

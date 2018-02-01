/// <reference path="../display/graphics.ts"/>
/// <reference path="../utils/mousewheel.ts"/>



module gf.ui
{
	/*
		Select a value between a minimum and a maximum by dragging a thumb over
		a physical range. This type of scroll bar does not have increment and
		decrement buttons.
	*/
	export class SimpleScrollBar extends gf.display.Container
	{
		/*
			Determines if the scroll bar"s thumb can be dragged horizontally or
			vertically.
		*/
		protected _data: PIXI.interaction.InteractionData;
		protected _direction: string;
		protected _dragging: boolean;
		protected _dragStart: PIXI.Point;
		private _offsetX: number;
		private _offsetY: number;
		protected _scrollPos: number;
		protected _scrollMax: number;
		protected _sizeScroll: number;
		protected _sizeVisible: number;
		protected _startPos: number;
		protected _thumbSize: number;
		protected _thumbMinSize: number;
		protected _thumbMaxSize: number;
		protected _thumb: gf.display.IDisplay;
		private _track: gf.display.IDisplay;

		public defaultThumb: gf.display.Graphics;
		public defaultTrack: gf.display.Graphics;
		public mouseWheel: gf.utils.MouseWheel;
		public scrollMask: gf.display.IDisplay;
		public toScroll: gf.display.IDisplay;



		constructor(game: gf.core.Game, direction: string = gf.VERTICAL)
		{
			super(game);

			this.interactive = true;

			this._direction = direction;

			this._offsetX = 0;
			this._offsetY = 0;
			this._scrollPos = 0;
			this._sizeScroll = 0;
			this._sizeVisible = 0;
			this._thumbMinSize = 50;
			this._thumbMaxSize = Infinity;

			this.defaultThumb = new gf.display.Graphics(this.game);
			this.defaultThumb.interactive = true;
			this.defaultThumb.buttonMode = true;

			this.defaultTrack = new gf.display.Graphics(this.game);

			this.addTrack(this.defaultTrack);
			this.addThumb(this.defaultThumb);

			this.mouseWheel = new gf.utils.MouseWheel();
			this.enable();

			// @see: https://github.com/pixijs/pixi.js/pull/3963
			const usePointer = parseInt(PIXI.VERSION.split(".").join("")) < 452;

			if (usePointer && this.game.client.config.isMobile)
			{
				this.on("pointerdown", (e: PIXI.interaction.InteractionEvent) => this.onDragStart(e));
				this.on("pointerup pointerupoutside", (e: PIXI.interaction.InteractionEvent) => this.onDragEnd(e));
				this.on("pointermove", (e: PIXI.interaction.InteractionEvent) => this.onDragMove(e, true));
			}
		}



		protected onDragStart(e: PIXI.interaction.InteractionEvent): void
		{
			this._dragStart = e.data.global.clone();
			this._startPos = this._scrollPos;
			this._dragging = true;
		}



		protected onDragEnd(e: PIXI.interaction.InteractionEvent): void
		{
			this._dragging = false;
		}



		protected onDragMove(e: PIXI.interaction.InteractionEvent, invert: boolean = false): void
		{
			if (this._dragging)
			{
				const pos = e.data.global.clone();
				const dif = this.isVertical ? pos.y - this._dragStart.y : pos.x - this._dragStart.x;

				this.updateScrollPos(invert ? this._startPos - dif : this._startPos + dif);
			}
		}



		protected onMouseWheel(e: any): void
		{
			this.updateScrollPos(this._scrollPos + ((e.delta > 0) ? -20 : 20));
		}



		protected updateScrollPos(value: number): void
		{
			this._scrollPos = Math.max(0, Math.min(value, this._scrollMax));
			this.scroll();
		}



		protected drawThumb(): void
		{
			this.defaultThumb.c().f(0x000000, 0.5).rr(0, 0, this.isVertical ? 8 : this._thumbSize, this.isVertical ? this._thumbSize : 8, 4).ef();
		}



		protected drawTrack(): void
		{
			this.defaultTrack.c().f(0x000000, 0.15).rr(0, 0, this.isVertical ? 8 : this._sizeVisible, this.isVertical ? this._sizeVisible : 8, 4).ef();
		}



		public addThumb(value: gf.display.IDisplay): void
		{
			if (this._thumb === value) return;

			if (!this.game.client.config.isMobile)
			{
				if (this._thumb)
				{
					if (this._thumb == this.defaultThumb) this._thumb.visible = false;

					this._thumb.off("pointerdown", (e: PIXI.interaction.InteractionEvent) => this.onDragStart(e));
					this._thumb.off("pointerup pointerupoutside", (e: PIXI.interaction.InteractionEvent) => this.onDragEnd(e));
					this._thumb.off("pointermove", (e: PIXI.interaction.InteractionEvent) => this.onDragMove(e));
				}
			}

			this._thumb = value;
			this._thumb.buttonMode = true;

			this._thumb.on("pointerdown", (e: PIXI.interaction.InteractionEvent) => this.onDragStart(e));
			this._thumb.on("pointerup pointerupoutside", (e: PIXI.interaction.InteractionEvent) => this.onDragEnd(e));
			this._thumb.on("pointermove", (e: PIXI.interaction.InteractionEvent) => this.onDragMove(e));

			this._thumb = value;
			this.addChild(this._thumb);

			this.scroll();
		}



		public addTrack(value: gf.display.IDisplay): void
		{
			if (this._track === value) return;

			if (this._track)
			{
				if (this._track == this.defaultTrack) this._track.visible = false;
			}

			this._track = value;
			this.addChild(this._track);

			this.scroll();
		}



		public enable(): void
		{
			this.mouseWheel.on(gf.utils.MOUSE_WHEEL, (e) => this.onMouseWheel(e), this);
		}



		public disable(): void
		{
			this.mouseWheel.removeAllListeners(gf.utils.MOUSE_WHEEL);
		}



		public scroll(): void
		{
			if (!this._thumb || !this._track || !this.toScroll || !this.scrollMask) return;

			this._thumbSize = Math.max(this._thumbMinSize, Math.min(this._thumbMaxSize, this._sizeVisible, this.sizeVisible / this._sizeScroll * this.sizeVisible));
			this._scrollMax = this._sizeVisible - this._thumbSize;


			if (this._thumb == this.defaultThumb)
			{
				this.drawThumb();
			}

			if (this._track == this.defaultTrack)
			{
				this.drawTrack();
			}

			if (this.visible)
			{
				const value = (this._scrollMax > 0) ? (this._scrollPos / this._scrollMax) * (this.sizeScroll - this.sizeVisible) : 0;

				if (this.isVertical)
				{
					TweenMax.to(this._thumb, 0.25, {y: this._scrollPos});
					TweenMax.to(this.toScroll, 0.25, {
						y: this.scrollMask.y - value,
						onUpdate: () => this.emit(gf.CHANGE)
					});
				}
				else
				{
					TweenMax.to(this._thumb, 0.25, {x: this._scrollPos});
					TweenMax.to(this.toScroll, 0.25, {
						x: this.scrollMask.x - value,
						onUpdate: () => this.emit(gf.CHANGE)
					});
				}
			}
		}



		public update(toScroll: gf.display.IDisplay,
					  mask: gf.display.IDisplay,
					  marginX: number = 0,
					  marginY: number = 0): void
		{
			this.toScroll = toScroll;
			this.scrollMask = mask;

			if (this.isVertical)
			{
				this._track.x = this._thumb.x = this.scrollMask.width + marginX;
				this.x = this.scrollMask.x;
				this.y = this.scrollMask.y + marginY;
				this.sizeVisible = this.scrollMask.height - marginY * 2;
				this.sizeScroll = this.toScroll.height + this._offsetY;
			}
			else
			{
				this.x = this.scrollMask.x + marginX;
				this.y = this.scrollMask.y;
				this._track.y = this._thumb.y = this.scrollMask.height + marginY;
				this.sizeVisible = this.scrollMask.width - marginX * 2;
				this.sizeScroll = this.toScroll.width + this._offsetX;
			}

			this.emit(gf.UPDATE);

			this.visible = this.sizeScroll > this.sizeVisible;

			this.scroll();
		}



		public updateToContentPosition(): void
		{
			let f = -(this.toScroll.y - this.scrollMask.y) / (this.toScroll.height - this.scrollMask.height);

			this._scrollPos = (this.sizeVisible - this._thumbSize) * f;

			if (this.isVertical)
			{
				TweenMax.to(this._thumb, 0.25, {y: this._scrollPos});
			}
			else
			{
				TweenMax.to(this._thumb, 0.25, {x: this._scrollPos});
			}
		}



		public get sizeScroll(): number
		{
			return this._sizeScroll;
		}



		public set sizeScroll(value: number)
		{
			if (this._sizeScroll === value) return;
			this._sizeScroll = value;
			this.scroll();
		}



		public get sizeVisible(): number
		{
			return this._sizeVisible;
		}



		public set sizeVisible(value: number)
		{
			if (this._sizeVisible === value) return;
			this._sizeVisible = value;
			this.scroll();
		}



		public get thumbMaxSize(): number
		{
			return this._thumbMaxSize;
		}



		public set thumbMaxSize(value: number)
		{
			this._thumbMaxSize = value;
		}



		public get direction(): string
		{
			return this._direction;
		}



		public set direction(value: string)
		{
			if (this._direction === value) return;
			this._direction = value;
			this.scroll();
		}



		public get offsetX(): number
		{
			return this._offsetX;
		}



		public set offsetX(value: number)
		{
			this._offsetX = value;
		}



		public get offsetY(): number
		{
			return this._offsetY;
		}



		public set offsetY(value: number)
		{
			this._offsetY = value;
		}



		public get isVertical(): boolean
		{
			return this._direction === gf.VERTICAL;
		}
	}
}

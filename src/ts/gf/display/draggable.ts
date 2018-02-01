/// <reference path="container.ts"/>



module gf.display
{
	export class Draggable extends gf.display.Container
	{
		public canDragX: boolean;
		public canDragY: boolean;
		public smoothScroll: TweenMax;
		public smoothScrollEnabled: boolean;

		protected _dragStart: PIXI.Point;

		protected _isDragging: boolean;
		protected _isDraggable: boolean;
		protected _dragDistance: PIXI.Point;
		protected _maxX: number;
		protected _maxY: number;
		protected _minX: number;
		protected _minY: number;
		protected _startPosition: PIXI.Point;
		protected _velocity: PIXI.Point;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.canDragX = true;
			this.canDragY = true;

			this.interactive = true;

			this._dragDistance = new PIXI.Point();
			this._minX = this._minY = -Number.MAX_VALUE;
			this._maxX = this._maxY = Number.MAX_VALUE;

			this._startPosition = new PIXI.Point();

			this._velocity = new PIXI.Point();

			this.isDraggable = true;

			this.smoothScrollEnabled = true;

			this._isDragging = false;

			this.on("touchstart mousedown", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.onDown(e);
			});
		}



		protected onDown(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this._isDraggable) return;

			//if user drags object,
			//then clicks right mouse button to open context menu in Chrome,
			//then clicks again anywhere on screen,
			//downEvent will be sent again.
			//ignore it to avoid object to receive multiple dragStart events.
			//http://jira.kr3m.com:8080/browse/KLON-16?filter=-1
			if (this._isDragging) return;

			this.on("mouseup mouseupoutside touchend touchendoutside", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.onUp(e);
			});

			if (this.smoothScroll)
			{
				this.smoothScroll.kill();
			}

			this._dragDistance.set(0, 0);

			this.onDragStart(e.data);
		}



		protected onMove(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging)
			{
				this.onDragMove(e.data);
			}
			else
			{
				this.onDragStart(e.data);
			}
		}



		protected onUp(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging)
			{
				this.onDragStop(e.data);
				this.removeAllListeners("mousemove mouseup mouseupoutside touchmove touchend touchendoutside");
			}
		}



		protected onDragStart(data: PIXI.interaction.InteractionData): void
		{
			this._isDragging = true;

			this._dragStart = data.global.clone();
			this._startPosition.set(this.x, this.y);

			this.on("mousemove touchmove", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.onMove(e);
			});

			this.emit(gf.DRAG_START);
		}



		protected onDragMove(data: PIXI.interaction.InteractionData): void
		{
			if (this._isDragging)
			{
				let prevX: number = this.x;
				let prevY: number = this.y;

				this.setPosition(data.global.clone());

				this.emit(gf.DRAG_CHANGE, this.position.x, this.position.y);

				this._velocity.set(this.x - prevX, this.y - prevY);
			}
		}



		protected onDragStop(data: PIXI.interaction.InteractionData): void
		{
			this._isDragging = false;

			if (this.smoothScrollEnabled)
			{
				this.smoothScroll = TweenMax.to(this._velocity, gf.utils.Maths.distance(this._velocity.x, this._velocity.y, 0, 0),
					{
						x: 0,
						y: 0,
						ease: Linear.easeOut,
						onUpdate: () =>
						{
							if (this.canDragX)
							{
								this.x = Math.min(this._maxX, Math.max(this._minX, this._velocity.x + this.x));
							}

							if (this.canDragY)
							{
								this.y = Math.min(this._maxY, Math.max(this._minY, this._velocity.y + this.y));
							}

							this.emit(gf.DRAG_CHANGE, this.x, this.y);
						},
						onComplete: () =>
						{
							this.emit(gf.DRAG_STOP);
						},
						useFrames: true
					});
			}
			else
			{
				this.x = Math.min(this._maxX, Math.max(this._minX, this.x));
				this.y = Math.min(this._maxY, Math.max(this._minY, this.y));
				this.emit(gf.DRAG_CHANGE, this.x, this.y);
				this.emit(gf.DRAG_STOP);
			}
		}



		protected setPosition(position: PIXI.Point): void
		{
			if (this.canDragX && this._minX < this._maxX)
			{
				let px: number = position.x - this._dragStart.x;
				this._dragDistance.x = px;
				this.x = Math.min(this._maxX, Math.max(this._minX, this._startPosition.x + px));
			}

			if (this.canDragY && this._minY < this._maxY)
			{
				let py: number = position.y - this._dragStart.y;
				this._dragDistance.y = py;
				this.y = Math.min(this._maxY, Math.max(this._minY, this._startPosition.y + py));
			}
		}



		public move(x: number = 0, y: number = 0): void
		{
			this.x = Math.min(this._maxX, Math.max(this._minX, this.x + x));
			this.y = Math.min(this._maxY, Math.max(this._minY, this.y + y));
			this.emit(gf.DRAG_CHANGE, this.position.x, this.position.y);
		}



		public forceStopDrag(): void
		{
			if (this._isDragging)
			{
				this.onDragStop(null);
				this.removeAllListeners("mousemove touchmove");
			}
		}



		public get dragDistance(): PIXI.Point
		{
			return this._dragDistance;
		}



		public get maxX(): number
		{
			return this._maxX;
		}



		public set maxX(value: number)
		{
			this._maxX = value;
			this.x = Math.min(this._maxX, Math.max(this._minX, this.x));
		}



		public get maxY(): number
		{
			return this._maxY;
		}



		public set maxY(value: number)
		{
			this._maxY = value;
			this.y = Math.min(this._maxY, Math.max(this._minY, this._velocity.y + this.y));
		}



		public get minX(): number
		{
			return this._minX;
		}



		public set minX(value: number)
		{
			this._minX = value;
		}



		public get minY(): number
		{
			return this._minY;
		}



		public set minY(value: number)
		{
			this._minY = value;
		}



		public get isDraggable(): boolean
		{
			return this._isDraggable;
		}



		public set isDraggable(value: boolean)
		{
			this._isDraggable = value;
			this.interactive = value;
		}



		public get isDragging(): boolean
		{
			return this._isDragging;
		}
	}
}

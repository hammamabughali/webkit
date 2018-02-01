/// <reference path="../scrollbar.ts"/>



module cuboro.ui.tabs
{
	export class Tab extends gf.display.Container
	{
		public bounds: gf.display.Sprite;
		public content: gf.display.Container;
		public contentMask: gf.display.Sprite;
		public scrollbar: cuboro.ui.Scrollbar;

		private _dragDistance: number;
		private _dragStart: number;
		private _isDragging: boolean;
		private _minY: number;
		private _startY: number;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;
			this._minY = 0;

			this.contentMask = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.addChild(this.contentMask);

			this.content = new gf.display.Container(this.game);
			this.content.interactive = true;
			this.content.on("touchstart mousedown", this.onDown, this);
			this.content.mask = this.contentMask;
			this.addChild(this.content);

			this.bounds = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			this.content.addChild(this.bounds);

			this.scrollbar = new cuboro.ui.Scrollbar(this.game);
			this.scrollbar.on(gf.UPDATE, this.onScrollbar, this);
			this.addChild(this.scrollbar);
		}



		protected onScrollbar(): void
		{
			this.bounds.width =
				this.bounds.height = 1;
			this._minY = this.contentMask.y - this.content.height + this.contentMask.height;
			this.bounds.width = this.contentMask.width;
			this.bounds.height = this.scrollbar.sizeScroll;
		}



		protected onDown(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging) return;
			if (!this.scrollbar.visible) return;

			this.on("mouseup mouseupoutside touchend touchendoutside", this.onUp, this);

			this._dragDistance = 0;

			this.onMove(e);
		}



		protected onMove(e: PIXI.interaction.InteractionEvent): void
		{
			if (this._isDragging)
			{
				const py: number = e.data.global.y - this._dragStart;
				this.content.y = Math.min(this.contentMask.y, Math.max(this._minY, this._startY + py));
				this.scrollbar.updateToContentPosition();
			}
			else
			{
				this._isDragging = true;

				this._dragStart = e.data.global.y;
				this._startY = this.content.y;

				this.on("mousemove touchmove", this.onMove, this);

				this.emit(gf.DRAG_START);
			}
		}



		protected onUp(): void
		{
			if (this._isDragging)
			{
				this._isDragging = false;
				this.removeAllListeners("mousemove mouseup mouseupoutside touchmove touchend touchendoutside");
			}
		}



		public updateSize(width: number, height: number): void
		{
			this.contentMask.width = width;
			this.contentMask.height = height;

			const marginX = -(this.scrollbar.defaultThumb.width + cuboro.PADDING);
			const marginY = cuboro.PADDING;

			this.scrollbar.y = this.content.y;
			this.scrollbar.update(this.content, this.contentMask, marginX, marginY);
		}



		public show(): void
		{
			this.visible = true;
		}



		public hide(): void
		{
			this.visible = false;
		}
	}
}

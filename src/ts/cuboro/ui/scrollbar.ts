/// <reference path="../../gf/ui/simplescrollbar.ts"/>



module cuboro.ui
{
	export class Scrollbar extends gf.ui.SimpleScrollBar
	{
		public defaultThumb: gf.display.Graphics;
		public defaultTrack: gf.display.Graphics;



		constructor(game: gf.core.Game, direction: string = gf.VERTICAL)
		{
			super(game, direction);

			this._thumbMinSize = 18;
			this._thumbMaxSize = 100;

			if (this.isVertical)
				this.defaultThumb.c().f(0xffffff).dr(0, 0, 18, 18).ef();
			else
				this.defaultThumb.c().f(0xffffff).dr(0, 0, 18, 18).ef();
			this.defaultThumb.tint = cuboro.COLOR_DARK_GREY;

			this.defaultThumb.on("mouseover", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_LIGHT_GREY;
				this.game.renderState = 2;
			});

			this.defaultThumb.on("mouseout", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_DARK_GREY;
				this.game.renderState = 2;
			});

			this.defaultThumb.on("mousedown touchstart", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_GREY;
				this.game.renderState = 2;
			});

			this.defaultThumb.on("mouseup", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_LIGHT_GREY;
				this.game.renderState = 2;
			});

			this.defaultThumb.on("touchend", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_DARK_GREY;
				this.game.renderState = 2;
			});

			this.defaultThumb.on("mouseupoutside touchendoutside", () =>
			{
				this.defaultThumb.tint = cuboro.COLOR_DARK_GREY;
				this.game.renderState = 2;
			});

			this.defaultTrack.interactive = true;
			if (this.isVertical)
				this.defaultTrack.c().f(cuboro.COLOR_LIGHT_GREY).dr(7, 0, 3, 300).ef();
			else
				this.defaultTrack.c().f(cuboro.COLOR_LIGHT_GREY).dr(0, 7, 300, 3).ef();
			this.defaultTrack.on("mouseup touchend", (e: PIXI.interaction.InteractionEvent) => this.onTrack(e));
		}



		protected onTrack(e: PIXI.interaction.InteractionEvent): void
		{
			const point = e.data.getLocalPosition(this.defaultTrack);
			const pos = this.isVertical ? point.y / this.defaultTrack.height : point.x / this.defaultTrack.width;
			this.updateScrollPos(pos * this._scrollMax);
		}



		protected drawThumb(): void
		{
			this.defaultThumb.width = this.isVertical ? 18 : this._thumbSize;
			this.defaultThumb.height = this.isVertical ? this._thumbSize : 18;
		}



		protected drawTrack(): void
		{
			this.defaultTrack.width = this.isVertical ? 3 : this._sizeVisible;
			this.defaultTrack.height = this.isVertical ? this._sizeVisible : 3;
		}



		public enable(): void
		{
		}



		public disable(): void
		{
		}
	}
}

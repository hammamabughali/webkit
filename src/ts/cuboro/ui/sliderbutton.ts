/// <reference path="iconbutton.ts"/>



module cuboro.ui
{
	export class SliderButton extends cuboro.ui.IconButton
	{
		protected isDragging: boolean;
		protected max: number;
		protected min: number;
		protected startDragY: number;
		protected startY: number;

		public iconBottom: gf.display.Sprite;
		public iconTop: gf.display.Sprite;
		public inverse: boolean;
		public slider: gf.display.Container;
		public track: gf.display.Sprite;
		public thumb: gf.display.Sprite;



		constructor(game: gf.core.Game, icon?: string, label?: string)
		{
			super(game, icon, label);

			this.interactiveChildren = true;
			this.inverse = false;
			this.hitArea = null;

			this.slider = new gf.display.Container(this.game);
			this.slider.interactive = true;
			this.slider.x = -2;
			this.slider.y = -134;
			this.slider.visible = false;
			this.addChildAt(this.slider, 0);

			const border = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			border.width = this.bg.width + 4;
			border.height = 134;
			border.tint = cuboro.COLOR_LIGHT_GREY;
			this.slider.addChild(border);

			const bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			bg.width = this.bg.width;
			bg.height = 132;
			bg.x = 2;
			bg.y = 2;
			bg.tint = cuboro.COLOR_YELLOW;
			this.slider.addChild(bg);

			this.track = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.track.interactive = true;
			this.track.width = 15;
			this.track.height = 105;
			this.track.tint = cuboro.COLOR_WHITE;
			this.track.x = (bg.width - this.track.width) >> 1;
			this.track.y = 17;
			this.track.on("click tap", this.onClick, this);
			this.slider.addChild(this.track);

			this.thumb = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.thumb.tint = cuboro.COLOR_DARK_GREY;
			this.thumb.interactive = true;
			this.thumb.buttonMode = true;
			this.thumb.width = 17;
			this.thumb.height = 17;
			this.thumb.x = (bg.width - this.thumb.width) >> 1;
			this.thumb.y = this.track.y;
			this.thumb.on("mouseover", this.onOver, this);
			this.thumb.on("mouseout", this.onOut, this);
			this.thumb.on("mousedown touchstart", this.onDown, this);
			this.thumb.on("mouseup touchend mouseupoutside", this.onUp, this);
			this.thumb.on("mousemove touchmove", this.onMove, this);
			this.slider.addChild(this.thumb);

			this.iconTop = new gf.display.Sprite(this.game, "sprites", "icon_slider_top");
			this.iconTop.tint = cuboro.COLOR_DARK_GREY;
			this.iconTop.x = this.track.x;
			this.iconTop.y = this.track.y - this.iconTop.height;
			this.slider.addChild(this.iconTop);

			this.iconBottom = new gf.display.Sprite(this.game, "sprites", "icon_slider_bottom");
			this.iconBottom.tint = cuboro.COLOR_DARK_GREY;
			this.iconBottom.x = this.track.x;
			this.iconBottom.y = this.track.bottom;
			this.slider.addChild(this.iconBottom);

			this.max = this.track.y;
			this.min = this.track.y + this.track.height - this.thumb.height;

			const hit = new gf.display.Sprite(this.game, PIXI.Texture.EMPTY);
			hit.interactive = true;
			hit.buttonMode = true;
			hit.width = this.bg.width;
			hit.height = this.bg.height;
			hit.on("click tap", this.onSlider, this);
			this.addChild(hit);
		}



		protected onClickOutside(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this.isSelected) return;

			const pos = e.data.getLocalPosition(this);
			if (!this.getLocalBounds().contains(pos.x, pos.y))
			{
				this.onSlider();
			}
		}



		protected onClick(e: PIXI.interaction.InteractionEvent): void
		{
			this.thumb.y = Math.max(this.max, Math.min(this.min, e.data.getLocalPosition(this.slider).y - (this.thumb.height >> 1)));

			this.update();
		}



		protected onOver(): void
		{
			this.thumb.tint = cuboro.COLOR_GREY;
		}



		protected onOut(): void
		{
			if (!this.isDragging)
				this.thumb.tint = cuboro.COLOR_DARK_GREY;
		}



		protected onDown(e: PIXI.interaction.InteractionEvent): void
		{
			this.startDragY = e.data.global.y;
			this.startY = this.thumb.y;
			this.thumb.tint = cuboro.COLOR_DARK_GREY;
			this.isDragging = true;
		}



		protected onUp(): void
		{
			this.thumb.alpha = 1;
			this.isDragging = false;
			this.thumb.tint = (this.isOver) ? cuboro.COLOR_GREY : cuboro.COLOR_DARK_GREY;

			this.update();
		}



		protected onMove(e: PIXI.interaction.InteractionEvent): void
		{
			if (this.isDragging)
			{
				this.thumb.y = Math.max(this.max, Math.min(this.min, this.startY + (e.data.global.y - this.startDragY)));

				this.update();
			}
		}



		protected update(): void
		{
			this.emit(gf.CHANGE, this.value);
		}



		public onSlider(): void
		{
			this.isSelected = !this.isSelected;
			this.slider.visible = this.isSelected;

			if (this.isSelected)
				this.game.stage.on("mousedown touchstart", this.onClickOutside, this);
			else
				this.game.stage.off("mousedown touchstart", this.onClickOutside);
		}



		public get value(): number
		{
			const value = (this.thumb.y - this.track.y) / (this.track.height - this.thumb.height);

			if (this.inverse)
				return Math.abs(value - 1);

			return value;
		}



		public set value(value: number)
		{
			if (this.inverse)
				value = Math.abs(value - 1);

			this.thumb.y = Math.max(this.max, Math.min(this.min, value * (this.track.height - this.thumb.height) + this.track.y));
		}
	}
}

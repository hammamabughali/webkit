module cuboro.ui
{
	export class Slider extends gf.display.Container
	{
		protected data: PIXI.interaction.InteractionData;
		protected isDragging:boolean;
		protected isOver:boolean;

		public iconLeft: gf.display.Sprite;
		public iconRight: gf.display.Sprite;
		public track: gf.display.Graphics;
		public thumb: gf.display.Sprite;



		constructor(game: gf.core.Game, iconLeft:string, iconRight:string)
		{
			super(game);

			this.interactive = true;

			this.iconLeft = new gf.display.Sprite(this.game, "sprites", iconLeft);
			this.addChild(this.iconLeft);

			this.track = new gf.display.Graphics(this.game);
			this.track.interactive = true;
			this.track.f(cuboro.COLOR_YELLOW).dr(0, 0, 260, 10).ef();
			this.track.x = this.iconLeft.right + 5;
			this.track.y = (this.iconLeft.height - this.track.height) >> 1;
			this.track.on("click tap", this.onClick, this);
			this.addChild(this.track);

			this.thumb = new gf.display.Sprite(this.game, "sprites", "bt_toggle");
			this.thumb.tint = cuboro.COLOR_DARK_GREY;
			this.thumb.interactive = true;
			this.thumb.buttonMode = true;
			this.thumb.anchor.set(0.5);
			this.thumb.x = this.track.x + 10;
			this.thumb.y = this.iconLeft.height >> 1;
			this.thumb.on("mouseover", this.onOver, this);
			this.thumb.on("mouseout", this.onOut, this);
			this.thumb.on("mousedown touchstart", this.onDown, this);
			this.thumb.on("mouseup touchend mouseupoutside", this.onUp, this);
			this.thumb.on("mousemove touchmove", this.onMove, this);
			this.addChild(this.thumb);

			this.iconRight = new gf.display.Sprite(this.game, "sprites", iconRight);
			this.iconRight.x = this.track.right + 5;
			this.addChild(this.iconRight);
		}



		protected onClick(e: PIXI.interaction.InteractionEvent):void
		{
			const max = this.track.x + 10;
			const min = this.track.x + this.track.width - 10;
			this.thumb.x = Math.max(max, Math.min(min, e.data.getLocalPosition(this).x));

			this.update();
		}



		protected onOver():void
		{
			this.isOver = true;
			this.thumb.tint = cuboro.COLOR_GREY;
		}



		protected onOut():void
		{
			this.isOver = false;
			if (!this.isDragging)
				this.thumb.tint = cuboro.COLOR_DARK_GREY;
		}



		protected onDown(e: PIXI.interaction.InteractionEvent):void
		{
			this.data = e.data;
			this.thumb.tint = cuboro.COLOR_YELLOW;
			this.isDragging = true;
		}


		protected onUp():void
		{
			this.thumb.alpha = 1;
			this.isDragging = false;
			this.data = null;
			this.thumb.tint = (this.isOver) ? cuboro.COLOR_GREY : cuboro.COLOR_DARK_GREY;

			this.update();
		}



		protected onMove():void
		{
			if (this.isDragging)
			{
				const max = this.track.x + 10;
				const min = this.track.x + this.track.width - 10;
				this.thumb.x = Math.max(max, Math.min(min, this.data.getLocalPosition(this.parent).x));

				this.update();
			}
		}



		protected update():void
		{
			this.emit(gf.CHANGE, this.value);
		}



		public get value():number
		{
			return (this.thumb.x - 10 - this.track.x) / (this.track.width - 20);
		}



		public set value(value:number)
		{
			const max = this.track.x + 10;
			const min = this.track.x + this.track.width - 10;
			this.thumb.x = Math.max(max, Math.min(min, value * this.track.width + this.track.x));
		}
	}
}

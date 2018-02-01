module cuboro.core
{
	export class Interaction extends gf.display.Sprite
	{
		constructor(game: gf.core.Game)
		{
			super(game);

			this.hitArea = new PIXI.Rectangle(0, 0, this.game.width, this.game.height);
			this.interactive = true;

			this.on("mousemove", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onMouseMove", e.data.originalEvent);
			});

			this.on("mousedown rightdown", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onMouseDown", e.data.originalEvent);
			});

			this.on("mouseup mouseupoutside rightup rightupoutside", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onMouseUp", e.data.originalEvent);
			});

			this.on("mouseout", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onMouseOut", e.data.originalEvent);
			});

			this.on("click tap", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onClick", e.data.originalEvent);
			});

			this.on("touchstart", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onTouchStart", e.data.originalEvent);
			});

			this.on("touchend touchendoutside", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onTouchEnd", e.data.originalEvent);
			});

			this.on("touchmove", (e: PIXI.interaction.InteractionEvent) =>
			{
				this.emit("onTouchMove", e.data.originalEvent);
			});

			document.addEventListener("contextmenu", (e: Event) =>
			{
				e.preventDefault();
			}, false);

			document.addEventListener("mousewheel", (e: any) =>
			{
				e.preventDefault();
				this.emit("onMouseWheel", e);
			}, false);

			document.addEventListener("DOMMouseScroll", (e: any) =>
			{
				e.preventDefault();
				this.emit("onMouseWheel", e);
			}, false);
		}



		public onResize(): void
		{
			super.onResize();

			this.hitArea = new PIXI.Rectangle(0, 0, this.game.width, this.game.height);
		}
	}
}

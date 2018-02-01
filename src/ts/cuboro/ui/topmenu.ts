/// <reference path="soundbutton.ts"/>



module cuboro.ui
{
	export class TopMenu extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public btAbout: cuboro.ui.IconButton;
		public btGallery: cuboro.ui.IconButton;
		public btHelp: cuboro.ui.IconButton;
		public btSound: cuboro.ui.SoundButton;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.addChild(this.bg);

			this.btGallery = new cuboro.ui.IconButton(this.game, "gallery", loc("bt_gallery_home"));
			this.btGallery.x = cuboro.PADDING;
			this.btGallery.on(gf.CLICK, this.onGallery, this);
			this.addChild(this.btGallery);

			/*this.btHelp = new cuboro.ui.IconButton(this.game, "help", loc("bt_help"));
			this.btHelp.x = cuboro.PADDING;
			this.btHelp.y = this.btGallery.bottom + cuboro.PADDING;
			this.btHelp.on(gf.CLICK, this.onHelp, this);
			this.addChild(this.btHelp);*/

			this.btAbout = new cuboro.ui.IconButton(this.game, "cuboro", loc("bt_about"));
			this.btAbout.x = cuboro.PADDING;
			//this.btAbout.y = this.btHelp.bottom + cuboro.PADDING;
			this.btAbout.y = this.btGallery.bottom + cuboro.PADDING;
			this.btAbout.on(gf.CLICK, this.onAbout, this);
			this.addChild(this.btAbout);

			this.btSound = new cuboro.ui.SoundButton(this.game);
			this.btSound.x = cuboro.PADDING;
			this.btSound.y = this.btAbout.bottom + cuboro.PADDING;
			this.addChild(this.btSound);

			this.bg.width = this.btGallery.width + cuboro.PADDING * 2;
			this.bg.height = this.btSound.bottom + cuboro.PADDING;
		}



		protected onGallery(): void
		{
			this.game.screens.show(cuboro.screens.Start.NAME);
			this.hide();
		}



		protected onHelp(): void
		{
		}



		protected onClickOutside(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this.game.stage.header.btMenu.isSelected) return;

			const pos = e.data.getLocalPosition(this);
			if (!this.getLocalBounds().contains(pos.x, pos.y))
			{
				this.hide();
			}
		}



		protected onAbout(): void
		{
			window.open("https://www.cuboro.ch", "_blank");
			this.hide();
		}



		public show():void
		{
			this.visible = true;

			this.game.stage.on("mousedown touchstart", this.onClickOutside, this);
		}



		public hide():void
		{
			this.game.stage.header.btMenu.isSelected = false;
			this.visible = false;

			this.game.stage.off("mousedown touchstart", this.onClickOutside);
		}
	}
}

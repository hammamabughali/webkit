/// <reference path="../../cuboro/ui/closebutton.ts"/>
/// <reference path="../../cuboro/ui/iconbutton.ts"/>
/// <reference path="../../gf/display/slice9.ts"/>
/// <reference path="../../gf/overlays/overlay.ts"/>
/// <reference path="../../gf/ui/noclick.ts"/>



module cuboro.overlays
{
	export class Overlay extends gf.overlays.Overlay
	{
		public readonly NAME: string;

		public bg: gf.display.Sprite;
		public btClose: cuboro.ui.CloseButton;
		public dim: gf.display.Sprite;
		public noClick: gf.ui.NoClick;
		public tfTitle: gf.display.Text;



		protected init(): void
		{
			this.addNoClick();
			this.addDim();
			this.addBg();
			this.addBtClose();
			this.addTitle();
		}



		protected addNoClick(): void
		{
			this.noClick = new gf.ui.NoClick(this.game);
			this.addChild(this.noClick);
		}



		protected addDim(): void
		{
			this.dim = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.dim.tint = 0x000000;
			this.dim.alpha = 0.6;
			this.dim.y = this.game.stage.header.bg.height;
			this.addChild(this.dim);
		}



		protected addBg(): void
		{
			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.width = 270;
			this.bg.height = 315;
			this.bg.y = this.game.stage.header.bg.height + 60;
			this.addChild(this.bg);
		}



		protected addBtClose(): void
		{
			this.btClose = new cuboro.ui.CloseButton(this.game);
			this.btClose.on(gf.CLICK, this.onClose, this);
			this.btClose.y = this.bg.y + cuboro.PADDING * 2 + 2;

			this.addChild(this.btClose);
		}



		protected addTitle(): void
		{
			this.tfTitle = new gf.display.Text(this.game);
			this.tfTitle.style = cuboro.TEXT_STYLE_TITLE_TAB.clone();
			this.tfTitle.y = this.bg.y + cuboro.PADDING * 2;
			this.addChild(this.tfTitle);
		}



		protected onClose(): void
		{
		}



		public onResize(): void
		{
			super.onResize();

			if (this.bg)
				this.bg.x = (this.game.width - this.bg.width) >> 1;

			if (this.btClose)
				this.btClose.x = this.bg.right - this.btClose.width - cuboro.PADDING * 2;

			if (this.tfTitle)
				this.tfTitle.x = this.bg.x + ((this.bg.width - this.tfTitle.width) >> 1);

			if (this.dim)
			{
				this.dim.width = this.game.width;
				this.dim.height = this.game.height - this.game.stage.header.bg.height;
			}
		}
	}
}

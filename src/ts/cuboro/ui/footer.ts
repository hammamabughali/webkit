/// <reference path="textlinkbutton.ts"/>



module cuboro.ui
{
	export class Footer extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public btImprint: cuboro.ui.TextLinkButton;
		public btContact: cuboro.ui.TextLinkButton;
		public tfVersion: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.height = 20;
			this.bg.tint = cuboro.COLOR_WHITE;
			this.addChild(this.bg);

			this.btImprint = new cuboro.ui.TextLinkButton(this.game, loc("bt_imprint"));
			this.btImprint.x = cuboro.PADDING;
			this.btImprint.y = cuboro.PADDING;
			this.btImprint.on(gf.CLICK, this.onImprint, this);
			this.addChild(this.btImprint);

			const divider = new gf.display.Text(this.game, "|", cuboro.TEXT_STYLE_VERSION.clone());
			divider.x = this.btImprint.right + cuboro.PADDING;
			divider.y = cuboro.PADDING;
			this.addChild(divider);

			this.btContact = new cuboro.ui.TextLinkButton(this.game, loc("bt_contact"));
			this.btContact.x = divider.right + cuboro.PADDING;
			this.btContact.y = cuboro.PADDING;
			this.btContact.on(gf.CLICK, this.onContact, this);
			this.addChild(this.btContact);

			this.tfVersion = new gf.display.Text(this.game);
			this.tfVersion.style = cuboro.TEXT_STYLE_VERSION.clone();
			this.tfVersion.text = loc("say_hello",
				{
					name: loc("app_title"),
					version: cuboro.VERSION
				});
			this.tfVersion.y = cuboro.PADDING;
			this.addChild(this.tfVersion);
		}



		protected onImprint(): void
		{
			track("Imprint");
			this.game.overlays.show(cuboro.overlays.Imprint.NAME);
		}



		protected onContact(): void
		{
			track("Contact");
			this.game.overlays.show(cuboro.overlays.Contact.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.y = this.game.height - this.bg.height;

			this.bg.width = this.game.width;

			this.tfVersion.x = this.game.width - this.tfVersion.width - cuboro.PADDING;
		}
	}
}

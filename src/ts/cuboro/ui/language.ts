///<reference path="textlinkbutton.ts"/>



module cuboro.ui
{
	export class Language extends gf.display.Container
	{
		public icon: gf.display.Sprite;
		public btGerman: cuboro.ui.TextLinkButton;
		public btEnglish: cuboro.ui.TextLinkButton;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_language");
			this.icon.tint = cuboro.COLOR_DARK_GREY;
			this.addChild(this.icon);

			this.btGerman = new cuboro.ui.TextLinkButton(this.game, loc("bt_german"));
			this.btGerman.x = this.icon.right + cuboro.PADDING;
			this.addChild(this.btGerman);

			const divider = new gf.display.Text(this.game, "|", cuboro.TEXT_STYLE_VERSION.clone());
			divider.x = this.btGerman.right + cuboro.PADDING;
			this.addChild(divider);

			this.btEnglish = new cuboro.ui.TextLinkButton(this.game, loc("bt_english"));
			this.btEnglish.x = divider.right + cuboro.PADDING;
			this.addChild(this.btEnglish);
		}
	}
}
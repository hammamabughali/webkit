/// <reference path="soundbutton.ts"/>



module cuboro.ui
{
	export class AccountMenu extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public btAccount: cuboro.ui.IconButton;
		public btChangePassword: cuboro.ui.IconButton;
		public btLogout: cuboro.ui.IconButton;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.addChild(this.bg);

			this.btAccount = new cuboro.ui.IconButton(this.game, "options", loc("bt_account_management"));
			this.btAccount.x = cuboro.PADDING;
			this.btAccount.on(gf.CLICK, this.onAccount, this);
			this.addChild(this.btAccount);

			this.btChangePassword = new cuboro.ui.IconButton(this.game, "password", loc("bt_change_password"));
			this.btChangePassword.x = cuboro.PADDING;
			this.btChangePassword.y = this.btAccount.bottom + cuboro.PADDING;
			this.btChangePassword.on(gf.CLICK, this.onChangePassword, this);
			this.addChild(this.btChangePassword);

			this.btLogout = new cuboro.ui.IconButton(this.game, "logout", loc("bt_logout"));
			this.btLogout.x = cuboro.PADDING;
			this.btLogout.y = this.btChangePassword.bottom + cuboro.PADDING;
			this.btLogout.on(gf.CLICK, this.onLogout, this);
			this.addChild(this.btLogout);

			this.bg.width = this.btAccount.width + cuboro.PADDING * 2;
			this.bg.height = this.btLogout.bottom + cuboro.PADDING;
		}



		protected onAccount(): void
		{
			this.game.overlays.show(cuboro.overlays.Account.NAME);
			this.hide();
		}



		protected onChangePassword(): void
		{
			this.game.overlays.show(cuboro.overlays.ChangePassword.NAME);
			this.hide();
		}



		protected onLogout(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			casClient.logout(() =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);
				this.game.screens.show(cuboro.screens.Start.NAME);
				this.hide();
			});
		}



		protected onClickOutside(e: PIXI.interaction.InteractionEvent): void
		{
			if (!this.game.stage.header.btAccount.isSelected) return;

			const pos = e.data.getLocalPosition(this);
			if (!this.getLocalBounds().contains(pos.x, pos.y))
			{
				this.hide();
			}
		}



		public show(): void
		{
			this.visible = true;

			this.game.stage.on("mousedown touchstart", this.onClickOutside, this);
		}



		public hide(): void
		{
			this.game.stage.header.btAccount.isSelected = false;
			this.visible = false;

			this.game.stage.off("mousedown touchstart", this.onClickOutside);
		}
	}
}

/// <reference path="accountmenu.ts"/>
/// <reference path="iconbutton.ts"/>
/// <reference path="topmenu.ts"/>
/// <reference path="trackmenu.ts"/>



module cuboro.ui
{
	export class Header extends gf.display.Container
	{
		public accountMenu: cuboro.ui.AccountMenu;
		public bg: gf.display.Sprite;
		public btAccount: cuboro.ui.IconButton;
		public btMenu: cuboro.ui.IconButton;
		public btLogin: cuboro.ui.IconButton;
		public topMenu: cuboro.ui.TopMenu;
		public trackMenu: cuboro.ui.TrackMenu;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.height = 75;
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.addChild(this.bg);

			this.btAccount = new cuboro.ui.IconButton(this.game, "account", loc("bt_account"));
			this.btAccount.tfLabel.style.wordWrap = true;
			this.btAccount.tfLabel.style.breakWords = true;
			this.btAccount.tfLabel.style.wordWrapWidth = this.btAccount.width;
			this.btAccount.on(gf.CLICK, this.onAccount, this);
			this.btAccount.y = cuboro.PADDING;
			this.btAccount.visible = false;
			this.addChild(this.btAccount);

			this.accountMenu = new cuboro.ui.AccountMenu(this.game);
			this.accountMenu.y = this.bg.bottom;
			this.accountMenu.visible = false;
			this.addChild(this.accountMenu);

			this.btMenu = new cuboro.ui.IconButton(this.game, "menu", loc("bt_menu"));
			this.btMenu.on(gf.CLICK, this.onMenu, this);
			this.btMenu.y = cuboro.PADDING;
			this.addChild(this.btMenu);

			this.topMenu = new cuboro.ui.TopMenu(this.game);
			this.topMenu.y = this.bg.bottom;
			this.topMenu.visible = false;
			this.addChild(this.topMenu);

			this.btLogin = new cuboro.ui.IconButton(this.game, "login", loc("bt_login"));
			this.btLogin.on(gf.CLICK, this.onLogin, this);
			this.btLogin.y = cuboro.PADDING;
			this.addChild(this.btLogin);

			this.trackMenu = new cuboro.ui.TrackMenu(this.game);
			this.trackMenu.hide();
			this.addChild(this.trackMenu);

			mUser.on("loggedIn", this.onUserStatus, this);
			mUser.on("logout", this.onUserStatus, this);

			this.getUsername();
		}



		protected onUserStatus(): void
		{
			this.btLogin.visible = !mUser.isLoggedIn();
			this.btAccount.visible = mUser.isLoggedIn();

			if (mUser.isLoggedIn())
			{
				if (!mTrack.owner)
					mTrack.owner = mUser.getUser();
			}

			this.getUsername();
		}



		protected getUsername(): void
		{
			if (!mUser.isLoggedIn()) return;

			casClient.getUserAccount((account: cas.vo.AccountData) =>
			{
				this.btAccount.label = account.user.name;
			});
		}



		protected onLogin(): void
		{
			this.game.overlays.show(cuboro.overlays.Login.NAME);
		}



		protected onAccount(): void
		{
			if (this.accountMenu.visible)
				this.accountMenu.hide();
			else
				this.accountMenu.show();

			this.btAccount.isSelected = this.accountMenu.visible;
		}



		protected onMenu(): void
		{
			if (this.topMenu.visible)
				this.topMenu.hide();
			else
				this.topMenu.show();

			this.btMenu.isSelected = this.topMenu.visible;
		}



		public onResize(): void
		{
			super.onResize();

			this.bg.width = this.game.width;

			this.btMenu.x = this.game.width - this.btMenu.width - cuboro.PADDING;
			this.topMenu.x = this.btMenu.x - cuboro.PADDING;

			this.btLogin.x =
				this.btAccount.x = this.btMenu.x - this.btAccount.width - cuboro.PADDING;
			this.accountMenu.x = this.btAccount.x - cuboro.PADDING;

			this.trackMenu.onResize();
		}



		public hide(): void
		{
			if (this.trackMenu.visible)
			{
				this.trackMenu.form.hideDom();
			}

			this.visible = false;
		}



		public show(): void
		{
			if (this.trackMenu.visible)
			{
				this.trackMenu.form.showDom();
			}

			this.visible = true;
		}
	}
}

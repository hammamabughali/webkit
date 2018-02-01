/// <reference path="button.ts"/>



module gf.ui
{
	export class Header extends gf.display.Container
	{
		public btLogin:gf.ui.Button;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.interactive = true;
			this.name = "header";

			this.init();
		}



		protected init():void
		{
			this.game.user.onLogin.add(this.onLogin, this);
			this.game.user.onLogout.add(this.onLogout, this);

			this.addBtLogin();

			if (this.game.user.isLoggedIn)
				this.onLogin();

			this.onResize();
		}



		protected addBtLogin():void
		{
			if (this.btLogin)
				this.btLogin.onClick.add(this.login, this);
		}



		protected onLogin():void
		{
		}



		protected onLogout():void
		{
		}



		protected login():void
		{
			this.game.overlays.show("loader");

			track("Start-Login", "CAS");
			this.game.user.login(() => this.game.overlays.hide("loader"));
		}



		public show():void
		{
			this.visible = true;
			TweenMax.to(this, 0.25, {alpha: 1});
		}



		public hide():void
		{
			TweenMax.to(this, 0.25,
			{
				alpha: 0, onComplete: () =>
				{
					this.visible = false;
				}
			});
		}
	}
}

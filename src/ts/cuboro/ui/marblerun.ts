/// <reference path="accountmenu.ts"/>
/// <reference path="iconbutton.ts"/>
/// <reference path="topmenu.ts"/>
/// <reference path="trackinfo.ts"/>



module cuboro.ui
{
	export class MarbleRun extends gf.display.Container
	{
		public bg: gf.display.Sprite;
		public btAbort: cuboro.ui.IconButton;
		public gameScreen: cuboro.screens.Game;



		constructor(gameScreen: cuboro.screens.Game)
		{
			super(gameScreen.game);

			this.gameScreen = gameScreen;
			this.interactive = true;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.height = 75;
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.addChild(this.bg);

			this.btAbort = new cuboro.ui.IconButton(this.game, "abort", loc("bt_abort"));
			this.btAbort.on(gf.CLICK, this.onAbort, this);
			this.btAbort.y = cuboro.PADDING;
			this.addChild(this.btAbort);
		}



		protected onAbort(): void
		{
			this.gameScreen.playground.marble.stop(true);
		}



		public onResize(): void
		{
			super.onResize();

			this.bg.width = this.game.width;

			this.btAbort.x = this.game.width - this.btAbort.width - cuboro.PADDING;
		}
	}
}

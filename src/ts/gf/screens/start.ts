/// <reference path="../../gf/screens/screen.ts"/>
/// <reference path="../../kr3m/tracking3/track.ts"/>



module gf.screens
{
	export class Start extends gf.screens.Screen
	{
		public static NAME:string = "start";

		public btPlay:gf.ui.Button;
		public tfVersion:gf.display.Text;



		public init():void
		{
			this.addBtPlay();
			this.addVersion();
		}



		protected addBtPlay():void
		{
			if (this.btPlay)
				this.btPlay.on(gf.CLICK, this.onPlay, this);
		}



		protected addVersion():void
		{
			this.tfVersion = new gf.display.Text(this.game, loc("say_hello",
				{
					name: loc("app_title")
				}));
			this.tfVersion.style.fontFamily = "Arial";
			this.tfVersion.style.fontSize = 8;
			this.tfVersion.hAlign(gf.RIGHT, this.game, -5);
			this.tfVersion.vAlign(gf.BOTTOM, this.game, -5);
			this.addChild(this.tfVersion);
		}



		protected onPlay():void
		{
			track("Start-Play");

			if (this.game.levels.levelCount == 1)
			{
				this.game.stage.header.hide();
				this.game.levels.loadLevel(0, () =>
				{
					this.game.overlays.show("detail");
				});
			}
			else
			{
				this.game.screens.show("trail");
			}
		}



		public transitionIn():void
		{
			super.transitionIn();

			if (this.game.stage.header)
				this.game.stage.header.show();
		}
	}
}

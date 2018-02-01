/// <reference path="overlay.ts"/>



module gf.overlays
{
	export class Pause extends gf.overlays.Overlay
	{
		public static NAME:string = "pause";

		public btAbort:gf.ui.Button;
		public btBack:gf.ui.Button;
		public btResume:gf.ui.Button;
		public onAbortGame:gf.utils.Signal;
		public onRestartGame:gf.utils.Signal;
		public onResumeGame:gf.utils.Signal;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.onAbortGame = new gf.utils.Signal();
			this.onRestartGame = new gf.utils.Signal();
			this.onResumeGame = new gf.utils.Signal();
		}



		protected init():void
		{
			this.addBtAbort();
			this.addBtBack();
			this.addBtResume();
		}



		protected update():void
		{
		}



		protected addBtAbort():void
		{
			if (this.btAbort)
				this.btAbort.onClick.add(this.onAbort, this);
		}



		protected addBtBack():void
		{
			if (this.btBack)
				this.btBack.onClick.add(this.onBack, this);
		}



		protected addBtResume():void
		{
			if (this.btResume)
				this.btResume.onClick.add(this.onResume, this);
		}



		protected onAbort():void
		{
			track("Pause-Abort");
			this.onAbortGame.dispatch();
			this.game.overlays.hide(this.name);
			this.game.screens.show("start");
		}



		protected onBack():void
		{
			track("Pause-Resume");
			this.onResumeGame.dispatch();
			this.game.overlays.hide(this.name);
		}



		protected onResume():void
		{
			track("Pause-Resume");
			this.onResumeGame.dispatch();
			this.game.overlays.hide(this.name);
		}
	}
}

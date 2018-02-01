/// <reference path="overlay.ts"/>



module gf.overlays
{
	export class Loader extends gf.overlays.Overlay
	{
		public static NAME:string = "loader";

		protected _progress:any;
		protected _showProgress:boolean;

		public tfProgress:gf.display.Text;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.interactive = true;
		}



		public init():void
		{
			this.addProgress();
		}



		public transitionOutComplete():void
		{
			super.transitionOutComplete();

			this._showProgress = false;
		}



		public addProgress():void
		{
			let style:PIXI.TextStyle = <PIXI.TextStyle>{};
			style.fontFamily = "Arial";
			style.fontSize = 14;

			this.tfProgress = new gf.display.Text(this.game, "0%", style);
			this.tfProgress.hAlign(gf.CENTER, this.game);
			this.tfProgress.vAlign(gf.CENTER, this.game);
			this.addChild(this.tfProgress);
		}



		public onProgress():void
		{
		}



		public onResize():void
		{
			this.hitArea = new PIXI.Rectangle(0, 0, this.game.width, this.game.height);

			super.onResize();
		}



		public get progress():any
		{
			return this._progress;
		}



		public set progress(value:any)
		{
			this._progress = value;
			if (this.tfProgress)
				this.tfProgress.text = this._progress.toString();
			this.onProgress();
		}



		public get showProgress():boolean
		{
			return this._showProgress;
		}



		public set showProgress(value:boolean)
		{
			this._showProgress = value;
			if (this.tfProgress)
				this.tfProgress.visible = this._showProgress;
		}
	}
}

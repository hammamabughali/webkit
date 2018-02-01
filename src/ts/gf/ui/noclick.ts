module gf.ui
{
	export class NoClick extends gf.display.Sprite
	{
		constructor(game:gf.core.Game)
		{
			super(game);

			this.interactive = true;

			this.onResize();
		}



		public onResize():void
		{
			this.hitArea = new PIXI.Rectangle(0, 0, this.game.width, this.game.height);
		}
	}
}

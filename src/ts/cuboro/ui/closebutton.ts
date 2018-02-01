///<reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class CloseButton extends gf.ui.Button
	{
		public icon: gf.display.Sprite;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_close");
			this.icon.tint = cuboro.COLOR_DARK_GREY;
			this.addChild(this.icon);

			this.hitArea = new PIXI.Circle(this.icon.width >> 1, this.icon.height >> 1, (this.icon.width >> 1) + cuboro.PADDING * 2)
		}



		protected setState(state: string): void
		{
			switch (this._currentState)
			{
				case gf.DOWN:
					this.icon.tint = cuboro.COLOR_GREY;
					break;

				case gf.OUT:
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.icon.tint = cuboro.COLOR_YELLOW;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.icon.tint = cuboro.COLOR_YELLOW;
					}
					else
					{
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}
	}
}
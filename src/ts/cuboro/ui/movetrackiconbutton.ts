/// <reference path="iconbutton.ts"/>



module cuboro.ui
{
	export class MoveTrackIconButton extends cuboro.ui.IconButton
	{
		constructor(game: gf.core.Game)
		{
			super(game, "arrow");
		}



		protected setState(state: string): void
		{
			if (this._isSelected)
			{
				if (this.bg.tint != cuboro.COLOR_YELLOW)
					this.bg.tint = cuboro.COLOR_YELLOW;
				return;
			}

			if (this._isEnabled)
			{
				this.icon.alpha = 1;
			}
			else
			{
				this.bg.tint = cuboro.COLOR_GREY;
				this.icon.alpha = 0.6;
				this.icon.tint = cuboro.COLOR_DARK_GREY;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_WHITE;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.tint = cuboro.COLOR_YELLOW;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_YELLOW;
					this.icon.tint = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						this.icon.tint = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}
	}
}

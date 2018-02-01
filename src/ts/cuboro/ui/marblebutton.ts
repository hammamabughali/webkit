/// <reference path="iconbutton.ts"/>



module cuboro.ui
{
	export class MarbleButton extends cuboro.ui.IconButton
	{
		constructor(game: gf.core.Game)
		{
			super(game, "marble", loc("bt_marble"));

			this.bg.width = 135;

			this.icon.anchor.set(0);
			this.icon.x =
				this.icon.y = 0;

			this.tfLabel.style.fontSize = 16;
			this.tfLabel.anchor.set(0, 0.5);
			this.tfLabel.x = this.icon.right + cuboro.PADDING * 2;
			this.tfLabel.y = this.bg.height >> 1;

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
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
				this.tfLabel.alpha = 1;
			}
			else
			{
				this.bg.tint = cuboro.COLOR_GREY;
				this.icon.alpha = 0.6;
				this.icon.tint = cuboro.COLOR_DARK_GREY;
				this.tfLabel.alpha = 0.6;
				this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_WHITE;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.tint = cuboro.COLOR_YELLOW;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_YELLOW;
					this.icon.tint = cuboro.COLOR_WHITE;
					this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						this.icon.tint = cuboro.COLOR_WHITE;
						this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						this.icon.tint = cuboro.COLOR_DARK_GREY;
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}
	}
}

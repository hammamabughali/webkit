module cuboro.ui
{
	export class ReportAbuseButton extends gf.ui.Button
	{
		public icon: gf.display.Sprite;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_report_abuse");
			this.addChild(this.icon);

			this.tfLabel = new gf.display.Text(this.game, loc("bt_report_abuse"), cuboro.TEXT_STYLE_SMALL.clone());
			this.tfLabel.x = this.icon.right + cuboro.PADDING;
			this.addChild(this.tfLabel);

			this.icon.y = (this.tfLabel.height - this.icon.height) >> 1;
		}



		protected setState(state: string): void
		{
			this.tfLabel.alpha = 1;
			this.icon.alpha = 1;

			if (!this.isEnabled)
			{
				this.tfLabel.alpha = 0.5;
				this.icon.alpha = 0.5;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.tfLabel.style.fill = cuboro.COLOR_GREY;
					this.icon.tint = cuboro.COLOR_GREY;
					break;

				case gf.OUT:
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.tfLabel.style.fill = cuboro.COLOR_YELLOW;
					this.icon.tint = cuboro.COLOR_YELLOW;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.tfLabel.style.fill = cuboro.COLOR_YELLOW;
						this.icon.tint = cuboro.COLOR_YELLOW;
					}
					else
					{
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public enable(): void
		{
			super.enable();

			this.setState(this._currentState);
		}



		public disable(): void
		{
			super.disable();

			this.setState(this._currentState);
		}
	}
}
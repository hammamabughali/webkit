/// <reference path="../../gf/display/slice3.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class TextLinkButton extends gf.ui.Button
	{
		protected _label: string;

		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, label: string)
		{
			super(game);

			this.tfLabel = new gf.display.Text(game, "", cuboro.TEXT_STYLE_BUTTON_FOOTER.clone());
			this.addChild(this.tfLabel);

			this.label = label;

			this.setState(gf.OUT);
		}



		protected setState(state: string): void
		{
			this.tfLabel.alpha = 1;

			if (!this.isEnabled)
			{
				this.tfLabel.alpha = 0.5;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.tfLabel.style.fill = cuboro.COLOR_GREY;
					break;

				case gf.OUT:
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.tfLabel.style.fill = cuboro.COLOR_YELLOW;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.tfLabel.style.fill = cuboro.COLOR_YELLOW;
					}
					else
					{
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
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



		public get label(): string
		{
			return this._label;
		}



		public set label(value: string)
		{
			if (value == this._label) return;

			this._label = value;
			this.tfLabel.text = this._label;

			this.hitArea = this.getLocalBounds();
		}
	}
}

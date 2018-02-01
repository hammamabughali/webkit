/// <reference path="../../gf/display/slice3.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class GalleryItemButton extends gf.ui.Button
	{
		protected _label: string;

		public icon: gf.display.Sprite;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, label: string)
		{
			super(game);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_details_gallery");
			this.icon.tint = cuboro.COLOR_DARK_GREY;
			this.icon.y = 1;
			this.addChild(this.icon);

			this.tfLabel = new gf.display.Text(game, "", cuboro.TEXT_STYLE_SMALL.clone());
			this.tfLabel.x = this.icon.right + cuboro.PADDING;
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
					this.icon.tint = cuboro.COLOR_GREY;
					break;

				case gf.OUT:
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					this.icon.tint = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.tfLabel.style.fill = cuboro.COLOR_WHITE;
						this.icon.tint = cuboro.COLOR_WHITE;
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

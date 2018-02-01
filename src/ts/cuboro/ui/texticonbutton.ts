/// <reference path="textbutton.ts"/>



module cuboro.ui
{
	export class TextIconButton extends cuboro.ui.TextButton
	{
		protected _isSelected: boolean;

		public icon: gf.display.Sprite;



		constructor(game: gf.core.Game, icon: string, label: string)
		{
			super(game, label, false);

			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_" + icon);
			this.icon.x = cuboro.PADDING;
			this.addChild(this.icon);

			this.tfLabel.x = this.icon.right + cuboro.PADDING;

			this.label = label;

			this.setState(this._currentState);
		}



		protected setState(state: string): void
		{
			if (!this.icon) return;

			this.icon.alpha = 1;
			this.tfLabel.alpha = 1;

			if (!this.isEnabled)
			{
				this.bg.frameName = "bt_text_disabled";
				this.icon.alpha = 0.5;
				this.tfLabel.alpha = 0.5;
				return;
			}

			if (this.isSelected)
			{
				this.bg.frameName = "bt_text_over";
				this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
				this.icon.tint = cuboro.COLOR_DARK_GREY;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.frameName = "bt_text_down";
					this.icon.tint = cuboro.COLOR_YELLOW;
					this.tfLabel.style.fill = cuboro.COLOR_YELLOW;
					break;

				case gf.OUT:
					this.bg.frameName = (this.isPrimary) ? "bt_text_out" : "bt_text_sek_out";
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.frameName = "bt_text_over";
					this.icon.tint = cuboro.COLOR_DARK_GREY;
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.frameName = "bt_text_over";
						this.icon.tint = cuboro.COLOR_DARK_GREY;
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					else
					{
						this.bg.frameName = (this.isPrimary) ? "bt_text_out" : "bt_text_sek_out";
						this.icon.tint = cuboro.COLOR_DARK_GREY;
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public setWidth(value: number): void
		{
			this.bg.width = value;

			this.hitArea = this.getLocalBounds();
		}



		public get label(): string
		{
			return this._label;
		}



		public set label(value: string)
		{
			if (value == this._label || !this.icon) return;

			this._label = value;
			this.tfLabel.text = this._label;

			this.bg.width = Math.round(this.tfLabel.width) + this.icon.width + 20;

			this.hitArea = this.getLocalBounds();
		}



		public get isSelected(): boolean
		{
			return this._isSelected;
		}



		public set isSelected(value: boolean)
		{
			this._isSelected = value;
			this._isOver = false;
			this.setState(this._currentState);
		}
	}
}

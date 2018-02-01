/// <reference path="../../gf/display/slice3.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class TextButton extends gf.ui.Button
	{
		protected _label: string;

		public bg: gf.display.Slice3;
		public isPrimary: boolean;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, label: string, isPrimary: boolean)
		{
			super(game);

			this.isPrimary = isPrimary;

			this.bg = new gf.display.Slice3(game, 10, 80, "sprites", (this.isPrimary) ? "bt_text_out" : "bt_text_sek_out");
			this.addChild(this.bg);

			this.tfLabel = new gf.display.Text(game, "", cuboro.TEXT_STYLE_BUTTON_TEXT.clone());
			this.tfLabel.anchor.y = 0.5;
			this.tfLabel.x = 10;
			this.tfLabel.y = this.bg.height >> 1;
			this.addChild(this.tfLabel);

			this.label = label;

			this.setState(gf.OUT);
		}



		protected setState(state: string): void
		{
			this.tfLabel.alpha = 1;

			if (!this.isEnabled)
			{
				this.bg.frameName = "bt_text_disabled";
				this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
				this.tfLabel.alpha = 0.5;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.frameName = "bt_text_down";
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.frameName = (this.isPrimary) ? "bt_text_out" : "bt_text_sek_out";
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.frameName = "bt_text_over";
					this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.frameName = "bt_text_over";
						this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.frameName = (this.isPrimary) ? "bt_text_out" : "bt_text_sek_out";
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public setWidth(value: number): void
		{
			this.bg.width = value;
			this.tfLabel.hAlign(gf.CENTER, value);

			this.hitArea = this.getLocalBounds();
		}



		public autoFit(padding: number = cuboro.PADDING):void
		{
			this.bg.width = this.tfLabel.width + padding * 2;
			this.tfLabel.hAlign(gf.CENTER, this.bg.width);
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

			this.bg.width = Math.round(this.tfLabel.width) + 20;

			this.hitArea = this.getLocalBounds();
		}
	}
}

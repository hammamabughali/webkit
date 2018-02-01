/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class Checkbox extends gf.ui.Button
	{
		protected _isChecked: boolean;
		protected _label: string;

		public bg: gf.display.Sprite;
		public border: gf.display.Sprite;
		public check: gf.display.Sprite;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, label?: string)
		{
			super(game);

			this.interactiveChildren = false;

			this.bg = new gf.display.Sprite(game, "sprites", "checkbox_out");
			this.addChild(this.bg);

			this.check = new gf.display.Sprite(game, "sprites", "icon_check");
			this.check.anchor.set(0.5);
			this.check.tint = cuboro.COLOR_DARK_GREY;
			this.check.x = this.bg.width >> 1;
			this.check.y = this.bg.height >> 1;
			this.addChild(this.check);

			if (label)
				this.label = label;

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
			this.on(gf.CLICK, () =>
			{
				this.isChecked = !this.isChecked;
			}, this);
		}



		protected addLabel(): void
		{
			this.tfLabel = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_BUTTON_CHECKBOX.clone());
			this.tfLabel.x = this.bg.right + 5;
			this.tfLabel.y = 2;
			this.addChild(this.tfLabel);
		}



		protected setState(state: string): void
		{
			this.check.visible = this._isChecked;

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.frameName = "checkbox_down";
					break;

				case gf.OUT:
					this.bg.frameName = "checkbox_out";
					break;

				case gf.OVER:
					this.bg.frameName = "checkbox_over";
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.frameName = "checkbox_over";
					}
					else
					{
						this.bg.frameName = "checkbox_out";
					}
					break;
			}
		}



		public enable(): void
		{
			super.enable();
			this.alpha = 1;
			this.setState(this._currentState);
		}



		public disable(): void
		{
			super.disable();
			this.bg.frameName = "checkbox_over";
			this.alpha = 0.5;
		}



		public forceState(state: string): void
		{
			this._currentState = state;
			this.setState(state);
		}



		public get label(): string
		{
			return this._label;
		}



		public set label(value: string)
		{
			if (value == this._label) return;

			if (!this.tfLabel) this.addLabel();

			this._label = value;
			this.tfLabel.text = this._label;
		}



		public get isChecked(): boolean
		{
			return this._isChecked;
		}



		public set isChecked(value: boolean)
		{
			this._isChecked = value;
			this.setState(this._currentState);
		}
	}
}

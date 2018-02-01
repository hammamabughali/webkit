/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class IconButton extends gf.ui.Button
	{
		protected _icon: string;
		protected _isPrimary: boolean;
		protected _isSelected: boolean;
		protected _label: string;

		public bg: gf.display.Sprite;
		public icon: gf.display.Sprite;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, icon?: string, label?: string, isPrimary: boolean = true)
		{
			super(game);

			this.interactiveChildren = false;

			this._icon = icon;
			this._label = label;
			this._isPrimary = isPrimary;

			this.bg = new gf.display.Sprite(game, PIXI.Texture.WHITE);
			this.bg.width =
				this.bg.height = 65;
			this.addChild(this.bg);

			if (this._icon) this.addIcon();
			if (this._label) this.addLabel();

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
		}



		protected addIcon(): void
		{
			this.icon = new gf.display.Sprite(this.game, "sprites", "icon_" + this._icon);
			this.icon.anchor.set(0.5);
			this.icon.x = this.bg.width >> 1;
			this.icon.y = this.bg.height >> 1;
			this.addChild(this.icon);
		}



		protected addLabel(): void
		{
			this.tfLabel = new gf.display.Text(this.game, this._label, cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfLabel.anchor.set(0.5, 1);
			this.tfLabel.style.wordWrapWidth = this.bg.width;
			this.tfLabel.x = this.bg.width >> 1;
			this.tfLabel.y = this.bg.height;
			this.addChild(this.tfLabel);
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
				if (this.icon)
					this.icon.alpha = 1;
				if (this.tfLabel)
					this.tfLabel.alpha = 1;
			}
			else
			{
				this.bg.tint = cuboro.COLOR_GREY;
				if (this.icon)
				{
					this.icon.alpha = 0.6;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
				}
				if (this.tfLabel)
				{
					this.tfLabel.alpha = 0.6;
					this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
				}
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_YELLOW;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.tint = (this._isPrimary) ? cuboro.COLOR_WHITE : cuboro.COLOR_LIGHT_GREY;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_YELLOW;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_WHITE;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						if (this.icon)
							this.icon.tint = cuboro.COLOR_WHITE;
						if (this.tfLabel)
							this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.tint = (this._isPrimary) ? cuboro.COLOR_WHITE : cuboro.COLOR_LIGHT_GREY;
						if (this.icon)
							this.icon.tint = cuboro.COLOR_DARK_GREY;
						if (this.tfLabel)
							this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public enable(): void
		{
			super.enable();

			this.setState(this.currentState);
		}



		public disable(): void
		{
			super.disable();

			this.setState(this.currentState);
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

			this._label = value;

			if (!this.tfLabel) this.addLabel();
			this.tfLabel.text = this._label;
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

/// <reference path="../../gf/display/slice3.ts"/>
/// <reference path="../../gf/display/text.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class TabButton extends gf.ui.Button
	{
		protected _isSelected:boolean;
		protected _label:string;

		public bg: gf.display.Sprite;
		public tab: cuboro.ui.tabs.Tab;
		public tfLabel: gf.display.Text;



		constructor(game:gf.core.Game, label:string)
		{
			super(game);

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.height = 40;
			this.addChild(this.bg);

			this.tfLabel = new gf.display.Text(this.game, label, cuboro.TEXT_STYLE_BUTTON_TAB.clone());
			this.tfLabel.x = 20;
			this.tfLabel.y = 10;
			this.addChild(this.tfLabel);

			this.setState(this.currentState);
		}



		protected setState(state:string):void
		{
			this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;

			if(!this._isEnabled)
			{
				this.tfLabel.style.fill = cuboro.COLOR_MID_GREY;
				return;
			}

			if (this._isSelected)
			{
				this.bg.tint = cuboro.COLOR_WHITE;
				if (this.tfLabel.style.fontFamily != cuboro.TEXT_STYLE_BUTTON_TAB_SELECTED.fontFamily)
					this.tfLabel.style = cuboro.TEXT_STYLE_BUTTON_TAB_SELECTED.clone();
				return;
			}
			else
			{
				if (this.tfLabel.style.fontFamily != cuboro.TEXT_STYLE_BUTTON_TAB.fontFamily)
					this.tfLabel.style = cuboro.TEXT_STYLE_BUTTON_TAB.clone();
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_GREY;
					break;

				case gf.OUT:
					this.bg.tint = cuboro.COLOR_LIGHT_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_MID_GREY;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_MID_GREY;
					}
					else
					{
						this.bg.tint = cuboro.COLOR_LIGHT_GREY;
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



		public get isSelected():boolean
		{
			return this._isSelected;
		}



		public set isSelected(value:boolean)
		{
			if (value == this._isSelected) return;

			this._isSelected = value;

			this.setState(this.currentState);
		}
	}
}

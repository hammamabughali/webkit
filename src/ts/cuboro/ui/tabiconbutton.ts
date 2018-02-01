/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class TabIconButton extends gf.ui.Button
	{
		protected _icon:string;
		protected _isSelected:boolean;
		protected _label:string;

		public bg: gf.display.Sprite;
		public icon: gf.display.Sprite;
		public tfLabel: gf.display.Text;



		constructor(game: gf.core.Game, icon:string)
		{
			super(game);

			this.interactiveChildren = false;

			this._icon = icon;

			this.icon = new gf.display.Sprite(game, "sprites", "icon_" + this._icon);
			this.icon.tint = cuboro.COLOR_DARK_GREY;
			this.addChild(this.icon);

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
		}


		protected addLabel():void
		{
			this.tfLabel = new gf.display.Text(this.game, "", cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfLabel.anchor.set(0.5, 1);
			this.tfLabel.style.wordWrapWidth = this.bg.width;
			this.tfLabel.x = this.bg.width >> 1;
			this.tfLabel.y = this.bg.height;
			this.addChild(this.tfLabel);
		}



		protected setState(state:string):void
		{
			switch (this._currentState)
			{
				case gf.DOWN:
					this.icon.tint = COLOR_LIGHT_GREY;
					break;

				case gf.OUT:
					this.icon.tint = COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.icon.tint = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.icon.tint = cuboro.COLOR_WHITE;
					}
					else
					{
						this.icon.tint = COLOR_DARK_GREY;
					}
					break;
			}
		}



		public enable():void
		{
			super.enable();
			this.alpha = 1;
			this.setState(this._currentState);
		}



		public disable():void
		{
			super.disable();
			this.alpha = 0.5;
		}



		public forceState(state:string):void
		{
			this._currentState = state;
			this.setState(state);
		}



		public get label():string
		{
			return this._label;
		}



		public set label(value:string)
		{
			if (value == this._label) return;

			if (!this.tfLabel) this.addLabel();

			this._label = value;
			this.tfLabel.text = this._label;
		}



		public get isSelected():boolean
		{
			return this._isSelected;
		}



		public set isSelected(value:boolean)
		{
			this._isSelected = value;
			this.setState(this._currentState);
		}
	}
}

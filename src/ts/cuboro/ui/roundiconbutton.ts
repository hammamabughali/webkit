/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class RoundIconButton extends gf.ui.Button
	{
		protected _icon: string;

		public bg: gf.display.Sprite;
		public icon: gf.display.Sprite;



		constructor(game: gf.core.Game, icon: string)
		{
			super(game);

			this.interactiveChildren = false;

			this._icon = icon;

			this.bg = new gf.display.Sprite(game, "sprites", "bt_round_out");
			this.addChild(this.bg);

			this.addIcon();

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



		protected setState(state: string): void
		{
			if (this._isEnabled)
			{
				this.icon.alpha = 1;
			}
			else
			{
				this.bg.frameName = "bt_round_over";
				this.icon.alpha = 0.6;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.frameName = "bt_round_down";
					//this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.frameName = "bt_round_out";
					//this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.frameName = "bt_round_over";
					//this.icon.tint = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.frameName = "bt_round_over";
						//this.icon.tint = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.frameName = "bt_round_out";
						//this.icon.tint = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public forceState(state: string): void
		{
			this._currentState = state;
			this.setState(state);
		}
	}
}

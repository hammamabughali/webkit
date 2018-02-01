/// <reference path="iconbutton.ts"/>



module cuboro.ui
{
	export class LayerButton extends cuboro.ui.IconButton
	{
		public layer: number;



		constructor(game: gf.core.Game, layer: number)
		{
			super(game, "bt_layer_out", layer.toString());

			this.layer = layer;

			this.bg.width = this.icon.width;
			this.bg.height = this.icon.height;

			this.icon.x = this.bg.width >> 1;
			this.icon.y = this.bg.height >> 1;

			this.tfLabel.anchor.set(0.5);
			this.tfLabel.x = this.bg.width >> 1;
			this.tfLabel.y = this.bg.height >> 1;
			this.tfLabel.style.fill = cuboro.COLOR_WHITE;

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
		}



		protected addIcon():void
		{
			this.icon = new gf.display.Sprite(this.game, "sprites", "bt_layer_out");
			this.icon.anchor.set(0.5);
			this.addChild(this.icon);
		}



		protected setState(state: string): void
		{
			if (this._isSelected)
			{
				if (this.icon.frameName != "bt_layer_down")
					this.icon.frameName = "bt_layer_down";
				this.bg.tint = cuboro.COLOR_YELLOW;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.icon.frameName = "bt_layer_down";
					this.bg.tint = cuboro.COLOR_YELLOW;
					break;

				case gf.OUT:
					this.icon.frameName = "bt_layer_out";
					this.bg.tint = cuboro.COLOR_WHITE;
					break;

				case gf.OVER:
					this.icon.frameName = "bt_layer_over";
					this.bg.tint = cuboro.COLOR_LIGHT_GREY;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.icon.frameName = "bt_layer_over";
						this.bg.tint = cuboro.COLOR_LIGHT_GREY;
					}
					else
					{
						this.icon.frameName = "bt_layer_out";
						this.bg.tint = cuboro.COLOR_WHITE;
					}
					break;
			}
		}
	}
}

/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class DropHeightButton extends gf.ui.Button
	{
		protected _dropHeight: "LOW" | "MEDIUM" | "HIGH";
		protected _isSelected: boolean;

		public bg: gf.display.Sprite;
		public icon: gf.display.Sprite;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.interactiveChildren = false;

			this.bg = new gf.display.Sprite(game, "sprites", "bt_dropheight_out");
			this.addChild(this.bg);

			this.icon = new gf.display.Sprite(game, "sprites");
			this.icon.anchor.set(0.5);
			this.icon.x = this.bg.width >> 1;
			this.icon.y = this.bg.height >> 1;
			this.addChild(this.icon);

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);

			this.dropHeight = cuboro.MARBLE_DROP_HEIGHT_DEFAULT;
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
			}
			else
			{
				this.bg.tint = cuboro.COLOR_GREY;
				if (this.icon)
				{
					this.icon.alpha = 0.6;
					this.icon.tint = cuboro.COLOR_DARK_GREY;
				}
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.frameName = "bt_dropheight_down";
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.frameName = "bt_dropheight_out";
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.frameName = "bt_dropheight_over";
					if (this.icon)
						this.icon.tint = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.frameName = "bt_dropheight_over";
						if (this.icon)
							this.icon.tint = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.frameName = "bt_dropheight_out";
						if (this.icon)
							this.icon.tint = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}



		public forceState(state: string): void
		{
			this._currentState = state;
			this.setState(state);
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



		public get dropHeight(): "LOW" | "MEDIUM" | "HIGH"
		{
			return this._dropHeight;
		}



		public set dropHeight(value: "LOW" | "MEDIUM" | "HIGH")
		{
			if (this._dropHeight == value) return;

			this._dropHeight = value;

			switch (this._dropHeight)
			{
				case "LOW":
					this.icon.frameName = "icon_dropheight_1";
					break;

				case "MEDIUM":
					this.icon.frameName = "icon_dropheight_2";
					break;

				case "HIGH":
					this.icon.frameName = "icon_dropheight_3";
					break;
			}
		}
	}
}

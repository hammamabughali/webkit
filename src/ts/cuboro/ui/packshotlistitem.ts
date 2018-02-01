module cuboro.ui
{
	export class PackshotListItem extends gf.ui.Button
	{
		public bg: gf.display.Sprite;
		public packshot: gf.display.Sprite;
		public packshotList: cuboro.ui.PackshotList;
		public key: string;
		public tfLabel: gf.display.Text;

		protected _id: string;
		protected _isSelected: boolean;



		constructor(packshotList: cuboro.ui.PackshotList, id: string)
		{
			super(packshotList.game);

			this.packshotList = packshotList;
			this.key = "packshot_" + id;

			this._id = id;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.bg.width = 80;
			this.bg.height = 65;
			this.addChild(this.bg);

			this.packshot = new gf.display.Sprite(this.game, "sprites", this.key);
			this.addChild(this.packshot);

			this.tfLabel = new gf.display.Text(this.game, loc(this.key), cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfLabel.anchor.set(0.5, 1);
			this.tfLabel.x = this.bg.width >> 1;
			this.tfLabel.y = this.bg.height;
			this.addChild(this.tfLabel);

			this.hitArea = this.getLocalBounds();

			this.setState(gf.OUT);
		}



		protected setState(state: string): void
		{
			if (this._isSelected)
			{
				this.bg.tint = cuboro.COLOR_YELLOW;
				return;
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_YELLOW;
					break;

				case gf.OUT:
					this.bg.tint = cuboro.COLOR_LIGHT_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_YELLOW;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
					}
					else
					{
						this.bg.tint = cuboro.COLOR_LIGHT_GREY;
					}
					break;
			}
		}



		public get id(): string
		{
			return this._id;
		}



		public get isSelected(): boolean
		{
			return this._isSelected;
		}



		public set isSelected(value: boolean)
		{
			if (value == this._isSelected) return;

			this._isSelected = value;

			this.setState(this.currentState);
		}
	}
}

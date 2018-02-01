/// <reference path="../../gf/display/multistyletext.ts"/>



module cuboro.ui
{
	export class CubeListItem extends gf.ui.Button
	{
		public bg: gf.display.Sprite;
		public cube: gf.display.Sprite;
		public cubeList: cuboro.ui.CubeList;
		public key: string;
		public tfCount: gf.display.Text;
		public tfLabel: gf.display.Text;

		private _count: number;
		protected _id: string;
		protected _index: number;
		protected _isSelected: boolean;
		protected _remaining: number;



		constructor(cubeList: cuboro.ui.CubeList, id: string, count: number, index: number)
		{
			super(cubeList.game);

			this.cubeList = cubeList;
			this.key = "cube_" + id;

			this._count = count;
			this._id = id;
			this._remaining = count;
			this._index = index;

			this.bg = new gf.display.Sprite(this.game, PIXI.Texture.WHITE);
			this.bg.tint = cuboro.COLOR_LIGHT_GREY;
			this.bg.width =
				this.bg.height = 65;
			this.addChild(this.bg);

			this.cube = new gf.display.Sprite(this.game, "sprites", this.key);
			this.cube.width = this.bg.width;
			this.cube.height = this.bg.height;
			this.addChild(this.cube);

			this.tfLabel = new gf.display.Text(this.game, loc(this.key), cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfLabel.anchor.set(0.5, 1);
			this.tfLabel.x = this.bg.width >> 1;
			this.tfLabel.y = this.bg.height;
			this.addChild(this.tfLabel);

			this.tfCount = new gf.display.Text(this.game,
				loc("cubes_count",
					{
						count: this._count,
						remaining: this._count
					}), cuboro.TEXT_STYLE_BUTTON_ICON.clone());
			this.tfCount.style.fontFamily = cuboro.DEFAULT_FONT_HEAVY;
			this.tfCount.x = 2;
			this.addChild(this.tfCount);

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



		public get count(): number
		{
			return this._count;
		}



		public set count(value: number)
		{
			this._count = value;
			this.tfCount.text = loc("cubes_count", {count: this._count, remaining: this._remaining});
		}



		public get id(): string
		{
			return this._id;
		}



		public get index(): number
		{
			return this._index;
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



		public get remaining(): number
		{
			return this._remaining;
		}



		public set remaining(value: number)
		{
			this._remaining = value;
			this.tfCount.text = loc("cubes_count",
				{
					count: this._count, remaining: this._remaining
				});

			this.cubeList.updateUsed();

			this.alpha = this._remaining > 0 ? 1 : 0.5;
		}
	}
}

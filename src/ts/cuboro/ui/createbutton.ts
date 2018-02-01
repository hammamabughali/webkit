/// <reference path="textbutton.ts"/>



module cuboro.ui
{
	export class CreateButton extends cuboro.ui.TextButton
	{
		public icon: gf.display.Sprite;



		constructor(game: gf.core.Game, label: string, type: "FREE" | "CONTEST")
		{
			super(game, label, true);

			this.icon = new gf.display.Sprite(this.game, type == "FREE" ? "icon_new_track" : "icon_contest");
			this.addChild(this.icon);

			this.bg.y = this.icon.bottom + cuboro.PADDING;
			this.tfLabel.y += this.bg.y;

			this.label = label;
		}



		public setWidth(value: number): void
		{
			super.setWidth(value);


			const w = Math.max(this.bg.width, this.icon.width);

			this.bg.hAlign(gf.CENTER, w);
			this.tfLabel.hAlign(gf.CENTER, w);
			this.icon.hAlign(gf.CENTER, w);

			this.hitArea = this.getLocalBounds();
		}



		public get label(): string
		{
			return this._label;
		}



		public set label(value: string)
		{
			if (!this.icon || value == this._label) return;

			this._label = value;
			this.tfLabel.text = this._label;

			this.setWidth(Math.round(this.tfLabel.width) + 20);
		}
	}
}

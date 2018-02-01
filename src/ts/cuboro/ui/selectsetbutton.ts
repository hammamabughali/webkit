/// <reference path="../../cuboro/ui/checkbox.ts"/>
/// <reference path="../../gf/ui/button.ts"/>



module cuboro.ui
{
	export class SelectSetButton extends gf.ui.Button
	{
		public cb: cuboro.ui.Checkbox;
		public packshot: gf.display.Sprite;
		public setName: string;



		constructor(game: gf.core.Game, setName: string)
		{
			super(game);

			this.setName = setName;

			this.cb = new cuboro.ui.Checkbox(this.game, loc("packshot_" + this.setName));
			this.cb.on("click tap", this.onCheckbox, this);
			this.addChild(this.cb);

			this.packshot = new gf.display.Sprite(this.game, "sprites-sets", this.setName);
			this.packshot.y = this.cb.bottom;
			this.packshot.interactive = true;
			this.packshot.on("click tap", this.onPackshot, this);
			this.addChild(this.packshot);
		}



		protected onCheckbox(): void
		{
			this.emit(gf.CHANGE, this);
		}



		protected onPackshot(): void
		{
			this.cb.isChecked = !this.cb.isChecked;
			this.emit(gf.CHANGE, this);
		}



		public enable(): void
		{
			super.enable();

			this.interactiveChildren = true;
		}



		public disable(): void
		{
			super.disable();

			this.interactiveChildren = false;
		}



		public get isSelected(): boolean
		{
			return this.cb.isChecked;
		}



		public set isSelected(value: boolean)
		{
			this.cb.isChecked = value;
		}
	}
}

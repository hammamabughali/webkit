/// <reference path="button.ts"/>



module gf.ui
{
	export class ToggleButton extends gf.ui.Button
	{
		protected _isToggled:boolean;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.onClick.add(() =>
			{
				this.isToggled = !this.isToggled;
			}, this);
		}



		protected onToggle():void
		{
		}



		public get isToggled():boolean
		{
			return this._isToggled;
		}



		public set isToggled(value:boolean)
		{
			if (this._isToggled == value) return;

			this._isToggled = value;
			this.onToggle();
		}
	}
}

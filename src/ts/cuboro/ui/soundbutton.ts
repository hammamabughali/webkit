/// <reference path="iconbutton.ts"/>



module cuboro.ui
{
	export class SoundButton extends cuboro.ui.IconButton
	{
		constructor(game: gf.core.Game, icon?: string, label?: string)
		{
			super(game, "sound", loc("bt_sound_on"));

			this.on(gf.CLICK, this.onToggle);
		}



		protected onToggle(): void
		{
			this.isSelected = !this.isSelected;

			this.game.sounds.muteFx(this.isSelected);
		}



		protected setState(state: string): void
		{
			if (!this.isSelected)
			{
				if (this.icon.frameName != "icon_sound")
				{
					this.icon.frameName = "icon_sound";
					this.label = loc("bt_sound_on");
				}
			}
			else
			{
				this.icon.frameName = "icon_mute";
				this.label = loc("bt_sound_off");
			}

			switch (this._currentState)
			{
				case gf.DOWN:
					this.bg.tint = cuboro.COLOR_YELLOW;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OUT:
					this.bg.tint = cuboro.COLOR_WHITE;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_DARK_GREY;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					break;

				case gf.OVER:
					this.bg.tint = cuboro.COLOR_YELLOW;
					if (this.icon)
						this.icon.tint = cuboro.COLOR_WHITE;
					if (this.tfLabel)
						this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					break;

				case gf.UP:
					if (this.isOver)
					{
						this.bg.tint = cuboro.COLOR_YELLOW;
						if (this.icon)
							this.icon.tint = cuboro.COLOR_WHITE;
						if (this.tfLabel)
							this.tfLabel.style.fill = cuboro.COLOR_WHITE;
					}
					else
					{
						this.bg.tint = cuboro.COLOR_WHITE;
						if (this.icon)
							this.icon.tint = cuboro.COLOR_DARK_GREY;
						if (this.tfLabel)
							this.tfLabel.style.fill = cuboro.COLOR_DARK_GREY;
					}
					break;
			}
		}
	}
}

/// <reference path="../overlays/message.ts"/>
/// <reference path="../ui/textbutton.ts"/>



module cuboro.overlays
{
	export class LowQuality extends cuboro.overlays.Message
	{
		public static NAME:string = "lowquality";

		public btReload: cuboro.ui.TextButton;



		public init():void
		{
			super.init();

			this.btReload = new cuboro.ui.TextButton(this.game, loc("bt_reload"), false);
			this.btReload.on(gf.CLICK, this.onReload, this);
			this.addChild(this.btReload);

			this.text = loc("hint_low_quality");
			this.title = loc("hint_low_quality_title", { name: loc("app_title")});
		}



		protected onReload():void
		{
			track("LowQuality-Reload");
			location.href = window.location.href + ((window.location.href.indexOf("?") == -1) ? "?" : "&") + "lowquality=1";
		}



		public onResize():void
		{
			super.onResize();

			this.btReload.x = this.bg.x + ((this.bg.width - this.btReload.width) >> 1);
			this.btReload.y = this.tfMessage.bottom + cuboro.PADDING * 2;

			this.bg.height = this.btReload.bottom - this.bg.y + cuboro.PADDING * 4;
		}
	}
}

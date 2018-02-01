/// <reference path="overlay.ts"/>



module cuboro.overlays
{
	export class Imprint extends cuboro.overlays.Overlay
	{
		public static readonly NAME: string = "imprint";

		public tf: gf.display.Text;



		protected init(): void
		{
			super.init();

			this.tfTitle.text = loc("imprint_title");

			this.tf = new gf.display.Text(this.game, loc("imprint"), cuboro.TEXT_STYLE_DEFAULT.clone());
			this.tf.style.fontSize = 13;
			this.tf.style.wordWrap = true;
			this.tf.style.wordWrapWidth = this.bg.width - 44;
			this.tf.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tf);

			this.bg.height = this.tf.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		protected onClose(): void
		{
			track("Imprint-Close");
			this.game.overlays.hide(cuboro.overlays.Imprint.NAME);
		}



		public onResize(): void
		{
			super.onResize();

			this.tf.x = this.bg.x + 22;
		}
	}
}

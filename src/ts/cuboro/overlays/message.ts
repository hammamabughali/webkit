/// <reference path="overlay.ts"/>



module cuboro.overlays
{
	export class Message extends cuboro.overlays.Overlay
	{
		public static readonly NAME:string = "message";

		public tfMessage: gf.display.Text;



		public init():void
		{
			super.init();

			this.dim.interactive = true;
			this.dim.on("click tap", this.onClose, this);

			this.tfMessage = new gf.display.Text(this.game);
			this.tfMessage.style = cuboro.TEXT_STYLE_DEFAULT.clone();
			this.tfMessage.style.align = gf.CENTER;
			this.tfMessage.style.fontSize = 13;
			this.tfMessage.style.wordWrap = true;
			this.tfMessage.style.wordWrapWidth = this.bg.width - 44;
			this.tfMessage.y = this.tfTitle.bottom + cuboro.PADDING * 4;
			this.addChild(this.tfMessage);
		}



		protected onClose():void
		{
			this.game.overlays.hide(cuboro.overlays.Message.NAME);
		}



		public onResize():void
		{
			super.onResize();

			this.tfMessage.x = this.bg.x + ((this.bg.width - this.tfMessage.width) >> 1);
			this.bg.height = this.tfMessage.bottom - this.bg.y + cuboro.PADDING * 4;
		}



		public transitionOutComplete():void
		{
			super.transitionOutComplete();

			this.tfTitle.text = "";
			this.tfMessage.text = "";
		}



		public set text(value:string)
		{
			this.tfMessage.text = value;

			this.onResize();
		}



		public set title(value:string)
		{
			this.tfTitle.text = value;

			this.onResize();
		}
	}
}

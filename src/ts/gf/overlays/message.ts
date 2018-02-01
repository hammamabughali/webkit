/// <reference path="../display/text.ts"/>
/// <reference path="../ui/button.ts"/>



module gf.overlays
{
	export class Message extends gf.overlays.Overlay
	{
		public btClose:gf.ui.Button;
		public onClose:() => void;
		public tfMessage:gf.display.Text;
		public tfTitle:gf.display.Text;



		public init():void
		{
			this.addBtClose();
			this.addTitle();
			this.addMessage();
		}



		protected addTitle():void
		{
		}



		protected addMessage():void
		{
		}



		protected addBtClose():void
		{
			if (this.btClose)
			{
				this.btClose.onClick.add(() =>
				{
					this.game.overlays.hide(this.name);

					if (this.onClose)
					{
						this.onClose();
						this.onClose = null;
					}
				}, this);
			}
		}



		public set message(value:string)
		{
			if (this.tfMessage)
				this.tfMessage.text = value;

			this.onResize();
		}



		public set title(value:string)
		{
			if (this.tfTitle)
				this.tfTitle.text = value;

			this.onResize();
		}
	}
}

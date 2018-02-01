/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/image.ts"/>
/// <reference path="../ui/popup.ts"/>
/// <reference path="../ui/textbox.ts"/>



module kr3m.ui
{
	/*
		Eine Popup-Klasse mit Titelleiste, Text und Schließen-Button.
	*/
	export class PopupText extends kr3m.ui.Popup
	{
		private closeButton:kr3m.ui.Image;
		private caption:kr3m.ui.Textbox;
		private text:kr3m.ui.Textbox;



		constructor(parent:any)
		{
			super(parent);

			this.closeButton = new kr3m.ui.Image(this, "img/icon_close.png", "closeButton");
			this.closeButton.dom.on("click", () => {this.hide();});

			this.caption = new kr3m.ui.Textbox(this, "", "popupCaption");
			this.text = new kr3m.ui.Textbox(this, "", "popupText");
		}



		public setCaption(caption:string):void
		{
			this.callOnShow(() =>
			{
				this.caption.setText(caption);
			});
		}



		public setText(text:string):void
		{
			this.callOnShow(() =>
			{
				this.text.setText(text);
			});
		}



		public getText():string
		{
			return this.text.getText();
		}
	}
}

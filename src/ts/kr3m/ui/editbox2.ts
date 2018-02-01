/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Editbox2 extends kr3m.ui.Element
	{
		constructor(parent, className = "")
		{
			super(parent, null, "input", {type : "text"});
			if (className)
				this.addClass(className);
		}



		public setText(text:any):void
		{
			this.dom.val(text.toString());
		}



		public getText():string
		{
			return this.dom.val();
		}



		public setMaxLength(value:number):void
		{
			this.dom.attr("maxlength", value);
		}



		public isEmpty():boolean
		{
			return !this.getText();
		}



		public setPlaceholder(placeholder:string):void
		{
			this.setAttribute("placeholder", placeholder);
		}



		public getPlaceholder():string
		{
			return this.getAttribute("placeholder") || "";
		}



		public setPasswordMode(modeEnabled:boolean):void
		{
			this.setAttribute("type", modeEnabled ? "password" : "text");
		}



		public isInPasswordMode():boolean
		{
			return this.getAttribute("type") == "password";
		}



		public togglePasswordMode():void
		{
			this.setPasswordMode(!this.isInPasswordMode());
		}



		public disable():void
		{
			this.addClass("disabled");
			this.setAttribute("disabled", "disabled");
		}



		public enable():void
		{
			this.removeClass("disabled");
			this.removeAttribute("disabled");
		}



		public resetVoValue():void
		{
			this.setText("");
		}



		public getVoValue():any
		{
			return this.getText();
		}



		public setVoValue(value:any):void
		{
			this.setText(value);
		}



		public selectText():void
		{
			this.dom.get(0).setSelectionRange(0, this.getText().length);
		}



		public deselectText():void
		{
			this.dom.get(0).setSelectionRange(0, 0);
		}



		public copyToClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("copy");

			if (!isVisible)
				this.hide();
		}



		public cutToClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("cut");

			if (!isVisible)
				this.hide();
		}



		public pasteFromClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("paste");

			if (!isVisible)
				this.hide();
		}
	}
}

/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Textarea extends kr3m.ui.Element
	{
		public static FLAG_REQUIRED:string = "REQUIRED";
		public static FLAG_READONLY:string = "READONLY";

		public static ERROR_REQUIRED:string = "REQUIRED";

		private callToActionText:string = "";
		private flags:string[] = [];



		constructor(parent, className:string = "", flags:string[] = [])
		{
			super(parent, null, "textarea", {"class":className});
			this.flags = flags;
			if (this.hasFlag(Textarea.FLAG_READONLY))
				this.dom.attr('readonly', 'readonly');
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();

			if (this.callToActionText == "")
			{
				var placeholder = this.dom.attr("placeholder");
				if (placeholder && placeholder != "")
				{
					this.setCallToActionText(placeholder);
					this.dom.removeAttr("placeholder");
				}
			}

			this.dom.on("blur", this.onFocusOut.bind(this));
			this.dom.on("focus", this.onFocusIn.bind(this));
		}



		public hasFlag(flag:string):boolean
		{
			for (var i = 0; i < this.flags.length; ++i)
				if (this.flags[i] == flag)
					return true;
			return false;
		}



		private checkState():void
		{
			var text = this.dom.val();
			if (text == "" || text == this.callToActionText)
			{
				this.dom.addClass("callToAction");
				this.dom.val(this.callToActionText);
			}
			else
			{
				this.dom.removeClass("callToAction");
			}
		}



		public validate():string
		{
			var text = this.getText();

			if (this.hasFlag(Textarea.FLAG_REQUIRED) && text == "")
				return Textarea.ERROR_REQUIRED;

			return Element.prototype.validate.call(this);
		}



		private onFocusIn():void
		{
			if (this.dom.hasClass("callToAction"))
			{
				this.dom.val("");
				this.dom.removeClass("callToAction");
			}
		}



		private onFocusOut():void
		{
			this.checkState();
		}



		public setText(text:any):void
		{
			this.dom.val(text.toString());
			this.checkState();
		}



		public getText():string
		{
			var text = this.dom.val();
			return (text != this.callToActionText) ? text : "";
		}



		public isEmpty():boolean
		{
			return this.getText() == "";
		}



		public setCallToActionText(text:string):void
		{
			this.callToActionText = text;
			this.checkState();
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

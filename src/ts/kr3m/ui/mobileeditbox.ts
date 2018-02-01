/// <reference path="../ui/editbox.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../util/validator.ts"/>



module kr3m.ui
{
	/*
		Vereinfachtes Eingabefeld hauptsächlich für mobile-browser.
		ACHTUNG: nur für moderne browser zu benutzen. Ansonsten unbedingt <kr3m.ui.Editbox> verwenden.
	*/
	export class MobileEditbox extends kr3m.ui.Element
	{
		constructor(parent, className:string = "", type:string = 'text')
		{
			super(parent, null, "input",
			{
				"class":className,
				type:type
			});
		}



		public getText():string
		{
			var text = this.dom.val();
			return text;
		}



		public setText(text:string):void
		{
			this.dom.val(text);
		}



		public getType():string
		{
			return this.dom.attr('type');
		}



		public validate():string
		{
			var text = this.getText();

			if (this.dom.is('[required]') && text == "")
				return kr3m.ui.Editbox.ERROR_REQUIRED;

			if (this.getType() == 'email' && !kr3m.util.Validator.email(text))
				return kr3m.ui.Editbox.ERROR_EMAIL;

			//# TODO: pw-validierung

			return super.validate();
		}
	}
}

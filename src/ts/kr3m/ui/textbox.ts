/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Textbox extends kr3m.ui.Element
	{
		constructor(parent?:any, text?:string, className?:string, attributes?:any)
		{
			attributes = attributes || {};
			if (className && className != "")
				attributes["class"] = className;
			super(parent, null, "div", attributes);
			this.setText(text);
		}



		public getText():string
		{
			return this.dom.text();
		}



		public setText(text:any):void
		{
			text = text || "";
			this.dom.text(text.toString());
		}



		public setHtml(html:string):void
		{
			html = html || "";
			this.dom.html(html);
		}



		public scrollToBottom():void
		{
			this.dom.get(0).scrollTop = this.dom.get(0).scrollHeight;
		}
	}
}

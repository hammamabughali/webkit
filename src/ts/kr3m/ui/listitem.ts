/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class ListItem extends kr3m.ui.Element
	{
		constructor(parent?:kr3m.ui.Element, attributes:any = {})
		{
			super(parent, null, "li", attributes);
		}



		public setText(text:any):void
		{
			this.dom.text(text);
		}



		public getText():string
		{
			return this.dom.text();
		}



		public setHtml(html:any):void
		{
			this.dom.html(html);
		}



		public getHtml():string
		{
			return this.dom.html();
		}
	}
}

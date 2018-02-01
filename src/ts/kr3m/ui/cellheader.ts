/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class CellHeader extends kr3m.ui.Element
	{
		constructor(parent, caption:string, attributes:any = {})
		{
			super(parent, null, 'th', attributes);
			this.setHtml(caption);
		}



		public setHtml(html:string):void
		{
			this.dom.html(html);
		}



		public getHtml():string
		{
			return this.dom.html();
		}



		public setText(text:any):void
		{
			this.dom.text(text.toString());
		}



		public getText():string
		{
			return this.dom.text();
		}
	}
}

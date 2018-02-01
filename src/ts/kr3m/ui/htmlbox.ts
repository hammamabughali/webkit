/// <reference path="../ui/textbox.ts"/>



module kr3m.ui
{
	export class HtmlBox extends kr3m.ui.Textbox
	{
		constructor(parent?:any, html?:string, className?:string, attributes?:any)
		{
			super(parent, "", className, attributes);
			if (html)
				this.setHtml(html);
		}
	}
}

/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Anchor extends kr3m.ui.Element
	{
		constructor(parent:any, caption?:string, url?:string, attributes?:any)
		{
			attributes = attributes || {};
			attributes.href = url ? url : "";
			super(parent, null, "a", attributes);
			if (caption)
				this.setInnerHtml(caption);
		}



		public select():void
		{
			this.addClass("selected");
		}



		public deselect():void
		{
			this.removeClass("selected");
		}



		public setSelected(selected:boolean):void
		{
			if (selected)
				this.select();
			else
				this.deselect();
		}



		public setTarget(target:string):void
		{
			this.setAttribute("target", target);
		}



		public setUrl(url:string):void
		{
			this.setAttribute("href", url);
		}
	}
}

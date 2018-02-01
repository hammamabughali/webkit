/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/listitem.ts"/>



module kr3m.ui
{
	export class UnorderedList extends kr3m.ui.Element
	{
		constructor(parent:kr3m.ui.Element, className:string = "")
		{
			super(parent, null, "ul", {"class":className});
		}



		public addChild(child:kr3m.ui.Element):void
		{
			if (child instanceof kr3m.ui.ListItem)
			{
				super.addChild(child);
			}
			else
			{
				var li = new kr3m.ui.ListItem(this);
				li.addChild(child);
			}
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			if (child instanceof kr3m.ui.ListItem)
				super.removeChild(child);
			else
				super.removeChild(child.parent);
		}



		public addTextItem(caption:string, attributes:any = {}):kr3m.ui.ListItem
		{
			var item = new kr3m.ui.ListItem(this, attributes);
			item.setText(caption);
			return item;
		}



		public addHtmlItem(caption:string, attributes:any = {}):kr3m.ui.ListItem
		{
			var item = new kr3m.ui.ListItem(this, attributes);
			item.setHtml(caption);
			return item;
		}
	}
}

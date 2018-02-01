/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Horizontal extends kr3m.ui.Element
	{
		private row:Element;



		constructor(parent, className:string = '')
		{
			super(parent, null, "table", {"class":className});
			this.row = new kr3m.ui.Element(this, null, "tr");
		}



		public addChild(child:kr3m.ui.Element):void
		{
			if (this.row)
			{
				var cell = new kr3m.ui.Element(this.row, null, "td");
				cell.addChild(child);
			}
			else
			{
				super.addChild(child);
			}
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			for (var i = 0; i < this.row.children.length; ++i)
			{
				if (this.row.children[i] == child)
				{
					this.row.children[i].removeChild(child);
					return;
				}
			}
		}
	}
}

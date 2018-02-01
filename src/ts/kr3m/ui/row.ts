/// <reference path="../ui/cell.ts"/>
/// <reference path="../ui/cellheader.ts"/>
/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Row extends kr3m.ui.Element
	{
		constructor(parent, attributes:any = {})
		{
			super(parent, null, "tr", attributes);
		}



		public addChild(child:kr3m.ui.Element):void
		{
			if (child instanceof kr3m.ui.Cell || child instanceof kr3m.ui.CellHeader)
			{
				super.addChild(child);
			}
			else
			{
				var cell = new kr3m.ui.Cell(this);
				cell.addChild(child);
			}
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			if (child instanceof kr3m.ui.Cell || child instanceof kr3m.ui.CellHeader)
				super.removeChild(child);
			else
				super.removeChild(child.parent);
		}
	}
}

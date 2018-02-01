/// <reference path="../ui2/td.ts"/>
/// <reference path="../ui2/th.ts"/>
/// <reference path="../ui2/tr.ts"/>



module kr3m.ui2
{
	export class Table extends Element
	{
		protected latestRow:Tr;



		constructor(parentNode:ParentTypes, options?:ElementOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "table"}));
		}



		public addRow():Tr
		{
			this.latestRow = new Tr(this);
			return this.latestRow;
		}



		public addCell():Td
		{
			if (!this.latestRow)
				this.addRow();
			return new Td(this.latestRow);
		}



		public addHeader():Th
		{
			if (!this.latestRow)
				this.addRow();
			return new Th(this.latestRow);
		}
	}
}

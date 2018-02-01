/// <reference path="../ui2/td.ts"/>
/// <reference path="../ui2/th.ts"/>



module kr3m.ui2
{
	export class Tr extends Element
	{
		constructor(parentNode:ParentTypes, options?:ElementOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "tr"}));
		}



		public addCell():Td
		{
			return new Td(this);
		}



		public addHeader():Th
		{
			return new Th(this);
		}
	}
}

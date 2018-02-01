/// <reference path="../../kr3m/ui2/div.ts"/>



module cuboro.cms
{
	export class Footer extends kr3m.ui2.Div
	{
		constructor(parentElement:kr3m.ui2.Element|HTMLElement)
		{
			super(parentElement);
			this.addClass("footer");
		}
	}
}

/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class ClickBlocker extends kr3m.ui.Element
	{
		constructor(parent:kr3m.ui.Element)
		{
			super(parent, null, "div", {"class" : "clickBlocker"});
			this.css(
			{
				"position": "fixed",
				"top" : "0px",
				"left" : "0px",
				"right" : "0px",
				"bottom" : "0px",
				"z-index" : "1000",
				"background-color" : "#7f7f7f",
				"opacity" : "0.6",
				"filter" : "alpha(opacity=60);"
			});
		}
	}
}

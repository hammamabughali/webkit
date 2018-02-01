/// <reference path="../../../../../ui/formbutton.ts"/>



module omni.ui
{
	export class CloseButton extends kr3m.ui.FormButton
	{
		constructor(parent:kr3m.ui.Element, clickListener:() => void)
		{
			super(parent, "X", clickListener);
			this.addClass("closeButton");
		}
	}
}

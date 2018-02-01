/// <reference path="../../../../../ui/formbutton.ts"/>



module omni.ui
{
	export class Button extends kr3m.ui.FormButton
	{
		constructor(parent:kr3m.ui.Element, captionId:string, clickListener:() => void)
		{
			super(parent, loc(captionId), clickListener);
			this.addClass("button");
		}
	}
}

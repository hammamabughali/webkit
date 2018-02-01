/// <reference path="../ui/integratediframe.ts"/>



module kr3m.ui
{
	export class Banner extends kr3m.ui.IntegratedIFrame
	{
		constructor(parent:any, url:string, className:string = "")
		{
			super(parent, url, {"class":className});
		}
	}
}

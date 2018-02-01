/// <reference path="../../../../../ui/anchor.ts"/>



module omni.ui
{
	export class DownloadButton extends kr3m.ui.Anchor
	{
		constructor(parent:kr3m.ui.Element, fileName:string, url:string)
		{
			super(parent, fileName, url);
			this.addClass("downloadButton");
			this.setAttribute("download", fileName);
		}
	}
}

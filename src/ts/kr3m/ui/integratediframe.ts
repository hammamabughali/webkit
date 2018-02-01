/// <reference path="../ui/iframe.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.ui
{
	/*
		Eine Version des IFrames, die möglichst versucht, sich in
		ihre Umgebungsseite anzupassen und den IFrame-Inhalt wie
		ein "gewöhnlichen Inhalt" anzuzeigen. Es werden Scrollbalken
		ausgeblendet und die Länge des Frames automatisch angepasst,
		um den Inhalt komplett anzuzeigen.
	*/
	export class IntegratedIFrame extends kr3m.ui.IFrame
	{
		private static DEFAULT_ATTRIBUTES:any =
		{
			scrolling:"no",
			marginheight:"0",
			marginwidth:"0",
			frameborder:"0",
			border:"0",
			cellspacing:"0",
			style:"marginheight:0px; marginwidth:0px; overflow:hidden; width:100%; border:0px; margin:0px; padding:0px"
		};



		constructor(parent:any, url:string = "", attributes:any = {})
		{
			super(parent, url, kr3m.util.Util.mergeAssoc(kr3m.ui.IntegratedIFrame.DEFAULT_ATTRIBUTES, attributes));
			if (typeof attributes.height == "undefined")
				this.autoAdjustSize();
		}
	}
}

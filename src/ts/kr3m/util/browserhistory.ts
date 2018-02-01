/// <reference path="../util/browser.ts"/>



//# CLIENT
module kr3m.util
{
	/*
		Klasse um die History-Funktionen des Browsers zu kapseln
		und auch in solchen Browsern zugänglich zu machen, welche
		die Browser-History-API nicht unterstützen.
	*/
	export class BrowserHistory
	{
		public static addUrl(
			url:string,
			title:string = "",
			data:any = null,
			targetWindow:Window = window):void
		{
			targetWindow.history.pushState(data, title, url);
		}
	}
}
//# /CLIENT

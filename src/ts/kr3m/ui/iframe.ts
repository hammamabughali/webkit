/// <reference path="../ui/element.ts"/>
/// <reference path="../util/browser.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/postmessage.ts"/>



module kr3m.ui
{
	export class IFrame extends kr3m.ui.Element
	{
		private autoAdjustTimer:any;



		constructor(parent:any, url:string = "", attributes:any = {})
		{
			attributes.src = url;
			super(parent, null, "iframe", attributes);
		}



		public setUrl(url:string):void
		{
			this.dom.attr("src", url);
		}



		public reload():void
		{
			this.dom.css("height", "auto");
			this.getWindow().location.reload();
		}



		public postMessage(message:any):void
		{
			kr3m.util.PostMessage.send(message, this.dom.get(0).contentWindow);
		}



		public setSize(width:number, height:number):void
		{
			this.dom.css({width:width, height:height});
		}



		public autoAdjustSize():void
		{
			if (!this.autoAdjustTimer)
				this.autoAdjustTimer = setInterval(this.checkSize.bind(this), 250);
		}



		public getWindow():any
		{
			var win:any = this.dom[0];
			return win.contentWindow;
		}



		private checkSize():void
		{
			var win = this.getWindow();
			var body = win.document.body;

			if (body && body.offsetHeight > 10)
				this.setSize(body.offsetWidth, ((kr3m.util.Browser.isOldBrowser()) ? body.scrollHeight : body.offsetHeight));
		}
	}
}

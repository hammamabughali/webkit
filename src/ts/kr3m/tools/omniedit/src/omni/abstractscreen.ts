/// <reference path="../../../../tools/omniedit/src/omni/ui/closebutton.ts"/>
/// <reference path="../../../../tools/omniedit/src/omni/ui/downloadbutton.ts"/>
/// <reference path="../../../../ui/screen.ts"/>
/// <reference path="../../../../util/stringex.ts"/>



module omni
{
	export abstract class AbstractScreen extends kr3m.ui.Screen
	{
		private downloadUrls:string[] = [];
		private clickBlocker:kr3m.ui.Element;
		private downloadButtons:kr3m.ui.Element;

		private hotkeyListeners:{[key:string]:Array<() => void>} = {};
		private popupElement:kr3m.ui.Element;

		protected fileName = "download";



		constructor(manager:kr3m.ui.ScreenManager, name:string)
		{
			super(manager, name);

			this.clickBlocker = new kr3m.ui.Element(this);
			this.clickBlocker.addClass("clickBlocker");
			this.clickBlocker.hide();

			this.downloadButtons = new kr3m.ui.Element(this);
			this.downloadButtons.addClass("downloadButtons");
			this.downloadButtons.hide();

			$(window.document.body).on("keydown", this.onKeyDown.bind(this));
		}



		protected setFileName(name:string):void
		{
			document.title = name;
			this.fileName = kr3m.util.StringEx.getBefore(name, ".", false);
		}



		private onKeyDown(evt:any):boolean
		{
			if (!this.isVisible())
				return true;

			if (this.popupElement)
			{
				if (evt.keyCode == 27)
				{
					this.closeAsPopup(this.popupElement);
					return false;
				}
			}

			if (!evt.ctrlKey)
				return true;

			var listeners = this.hotkeyListeners[evt.key];
			if (!listeners)
				return true;

			for (var i = 0; i < listeners.length; ++i)
				listeners[i]();
			return false;
		}



		public onHotkey(key:string, listener:() => void):void
		{
			var listeners = this.hotkeyListeners[key];
			if (!listeners)
			{
				listeners = [];
				this.hotkeyListeners[key] = listeners;
			}
			listeners.push(listener);
		}



		public showAsPopup(element:kr3m.ui.Element):void
		{
			if (this.popupElement)
				return;

			this.popupElement = element;
			this.clickBlocker.show();
			element.show();

			setTimeout(() =>
			{
				var width = element.getWidth();
				var height = element.getHeight();
				var winWidth = $(window).width();
				var winHeight = $(window).height();

				var x = Math.floor((winWidth - width) / 2);
				var y = Math.floor((winHeight - height) / 2);

				element.css({position : "fixed", top : y, left : x});
			}, 1);
		}



		public closeAsPopup(element:kr3m.ui.Element):void
		{
			if (this.popupElement != element)
				return;

			element.hide();
			this.clickBlocker.hide();
			this.popupElement = null;
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		protected clearDownloads():void
		{
			this.downloadButtons.removeAllChildren();
			new omni.ui.CloseButton(this.downloadButtons, () => this.closeAsPopup(this.downloadButtons));
			for (var i = 0; i < this.downloadUrls.length; ++i)
				URL.revokeObjectURL(this.downloadUrls[i]);
			this.downloadUrls = [];
		}



		protected addDownloadUrl(fileName:string, url:string):void
		{
			this.downloadUrls.push(url);
			new omni.ui.DownloadButton(this.downloadButtons, fileName, url);
			this.showAsPopup(this.downloadButtons);
		}



		protected addDownload(fileName:string, data:any, mimeType:string):void
		{
			var blob = new Blob([data], {type : mimeType});
			var url = URL.createObjectURL(blob);
			this.addDownloadUrl(fileName, url);
		}
	}
}

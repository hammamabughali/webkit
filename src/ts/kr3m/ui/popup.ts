/// <reference path="../ui/clickblocker.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/image.ts"/>
/// <reference path="../ui/textbox.ts"/>
/// <reference path="../util/device.ts"/>



module kr3m.ui
{
	/*
		Eine Klasse für generische Popups. Im Gegensatz zur Popup
		Klasse hat diese keine Elemente und bringt nur die grundlegende
		Funktionalität mit, um Popups beliebigen Inhalts zentriert und
		modal auf dem Bildschirm anzuzeigen. Inhalt und Schließen-Button
		müssen explizit hinzugefügt werden.
	*/
	export class Popup extends kr3m.ui.Element
	{
		public static verticalPadding = 20;
		public static topAlignOffset = 0;

		private static pendingPopups:{[groupName:string]:kr3m.ui.Popup[]} = {};
		private static visiblePopups:{[groupName:string]:kr3m.ui.Popup} = {};

		protected window:kr3m.ui.Element;
		protected clickBlocker:kr3m.ui.ClickBlocker;
		protected contentContainer:kr3m.ui.Element;

		private groupName = "ALL_POPUPS";

		private pendingCalls:Callback[] = [];

		protected desiredWidth:number;
		protected desiredHeight:number;
		protected topAligned:boolean;



		constructor(parent:kr3m.ui.Element)
		{
			super(parent, null, "div", {"style":"z-index:10000000"});
			this.hide();

			this.clickBlocker = new kr3m.ui.ClickBlocker(this);
			var position = "fixed";
			var device = kr3m.util.Device.getInstance();
			if (device.iOS && !device.desktop)
				position = "absolute";
			this.window = new kr3m.ui.Element(this, null, "div", {style : "z-index:1001; position:" + position + "; top:20px; left:20px; right:20px; bottom:20px;", "class":"popupwindow"});
			this.contentContainer = new kr3m.ui.Element(this.window);
		}



		public getContentHeight():number
		{
			var bottom = 0;
			var padding = 10000000;
			for (var i = 0; i < this.contentContainer.children.length; ++i)
			{
				var child = this.contentContainer.children[i];
				if (child.isVisible())
				{
					if (child.css("position") == "absolute")
						continue;

					var rect = child.dom[0].getBoundingClientRect();
					if (rect.bottom > bottom)
						bottom = rect.bottom;
					if (rect.top < padding)
						padding = rect.top;
				}
			}
			return bottom + padding;
		}



		private getDesiredWidth():number
		{
			return this.desiredWidth;
		}



		private getDesiredHeight():number
		{
			return this.desiredHeight;
		}



		public addChild(child:kr3m.ui.Element):void
		{
			if (this.contentContainer)
				this.contentContainer.addChild(child);
			else
				super.addChild(child);
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			this.contentContainer.removeChild(child);
		}



		/*
			Mit dieser Methode können Funktionsaufrufe hinausgezögert
			werden, bis das Popup das nächste Mal angezeigt wird. Dann
			werden die hinausgezögerten Funktionsaufrufe kurz vor dem
			Anzeigen des Popups ausgeführt.

			Die Hauptaufgabe dieser Funktion ist es, sicher zu stellen,
			dass wenn das gleiche Popup mehrfach mit unterschiedlichem
			Inhalt angezeigt werden soll, der Inhalt sich erst ändert,
			wenn der User das Popup schließt. Die Methode simuliert
			sozusagen mehrere Popups mit unterschiedlichem Inhalt, obwohl
			in Wirklichkeit nur ein Popup vorhanden ist.
		*/
		public callOnShow(callback:Callback):void
		{
			this.pendingCalls.push(callback);
		}



		public static isAnyPopupVisible(groupName = "ALL_POPUPS"):boolean
		{
			return !!kr3m.ui.Popup.visiblePopups[groupName];
		}



		public show():void
		{
			var self = kr3m.ui.Popup;
			if (self.isAnyPopupVisible(this.groupName))
			{
				if (!self.pendingPopups[this.groupName])
					self.pendingPopups[this.groupName] = [];
				self.pendingPopups[this.groupName].push(this);
				this.pendingCalls.push(null);
			}
			else
			{
				while (this.pendingCalls.length > 0)
				{
					var func = this.pendingCalls.shift();
					if (func)
						func();
					else
						break;
				}
				self.visiblePopups[this.groupName] = this;
				super.show();
			}
		}



		public hide():void
		{
			var self = kr3m.ui.Popup;
			super.hide();
			self.visiblePopups[this.groupName] = null;
			var pendingPopups = self.pendingPopups[this.groupName];
			if (pendingPopups && pendingPopups.length > 0)
			{
				var nextPopup = pendingPopups.shift();
				nextPopup.show();
			}
		}



		public static closePopup(groupName = "ALL_POPUPS"):void
		{
			var self = kr3m.ui.Popup;
			var popup = kr3m.ui.Popup.visiblePopups[groupName];
			if (popup)
				popup.hide();
		}



		/*
			Mit dieser Methode kann eingestellt werden, zu
			welcher Gruppe von Popups dieses Popup gehört.
			Aus jeder Gruppe kann immer nur ein Popup sichtbar
			sein. Wird ein Popup aus einer Gruppe angezeigt,
			in der bereits ein anderes Popup sichtbar ist,
			wird das Anzeigen des späteren Popups so lange
			hinausgezögert, bis das vorige Popup geschlossen
			wird.
			Standardmäßig gehören alle Popups zur gleichen
			Gruppe "ALL_POPUPS".
		*/
		public setGroup(groupName:string):void
		{
			this.groupName = groupName;
		}



		public getGroup():string
		{
			return this.groupName;
		}



		/*
			Damit das hier zuverlässig funktioniert muss in
			der HTML-Datei, in welcher die Application
			eingebunden ist <!DOCTYPE html> am Anfang stehen!
		*/
		public setSize(
			width:number,
			height:number,
			topAligned = false):void
		{
			this.desiredWidth = width;
			this.desiredHeight = height;
			this.topAligned = topAligned;
			this.onSize(window.innerWidth, window.innerHeight);
		}



		public onSize(width:number, height:number):void
		{
			if (this.topAligned)
			{
				var self = kr3m.ui.Popup;
				var hor = (width - this.desiredWidth) / 2;
				var topMargin = self.verticalPadding + self.topAlignOffset;
				topMargin = Math.max(self.verticalPadding, topMargin);
				var bottomMargin = height - this.desiredHeight - topMargin;
				if (bottomMargin < self.verticalPadding)
				{
					var displacement = self.verticalPadding - bottomMargin;
					displacement = Math.min(displacement, self.topAlignOffset);
					displacement = Math.max(displacement, 0);
					if (displacement > 0)
					{
						topMargin -= displacement;
						bottomMargin += displacement;
					}
				}
				this.window.dom.css({top : topMargin, bottom : bottomMargin, left : hor, right : hor});
			}
			else
			{
				var hor = (width - this.desiredWidth) / 2;
				var ver = (height - this.desiredHeight) / 2;
				this.window.dom.css({top : ver, bottom : ver, left : hor, right : hor});
			}
		}
	}
}

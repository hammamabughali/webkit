/// <reference path="../ui/button.ts"/>
/// <reference path="../ui/unorderedlist.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.ui
{
	/*
		Klasse zum Darstellen von Menüs (und Untermenüs),
		die automatisch Events auslöst oder callback-
		Funktionen aufruft wenn Menüpunkte geklickt werden.
	*/
	export class Menu extends kr3m.ui.Element
	{
		private topMenu:kr3m.ui.UnorderedList;
		private listeners:Array<(event:string) => void> = [];



		constructor(parent, className:string = "")
		{
			super(parent, null, "div", {"class":className});
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.topMenu = new kr3m.ui.UnorderedList(this);
		}



		public addEventListener(
			listener:(event:any) => void):void
		{
			if (!kr3m.util.Util.contains(this.listeners, listener))
				this.listeners.push(listener);
		}



		public removeEventListener(
			listener:(event:any) => void):void
		{
			kr3m.util.Util.remove(this.listeners, listener);
		}



		private dispatchEvent(event:any):void
		{
			for (var i = 0; i < this.listeners.length; ++i)
				this.listeners[i](event);
		}



		private fillMenu(
			menu:kr3m.ui.UnorderedList,
			items:any[],
			level:number):void
		{
			for (var i = 0; i < items.length; ++i)
			{
				var button = new kr3m.ui.Button(menu, items[i].caption);
				if (typeof items[i].submenu != "undefined")
				{
					var isOpen = (typeof items[i].open == "boolean" && items[i].open);
					var submenu = new kr3m.ui.UnorderedList(menu);
					if (!isOpen)
						submenu.hide();
					this.fillMenu(submenu, items[i].submenu, level + 1);
					items[i].submenu = submenu;
					button.addClass("submenu");
					button.addClass(isOpen ? "open" : "closed");
				}
				button.setClickHandler(this.onClicked.bind(this, button, items[i]));
				if (typeof items[i].disabled != "undefined" && items[i].disabled)
					button.addClass("disabled");
				button.addClass("level" + level);
			}
		}



		private onClicked(
			button:kr3m.ui.Button, item:any):void
		{
			if (typeof item.disabled != "undefined" && item.disabled)
				return;

			if (typeof item.callback != "undefined")
				item.callback();

			if (typeof item.event != "undefined")
				this.dispatchEvent(item.event);

			if (typeof item.submenu != "undefined")
			{
				if (item.submenu.isVisible())
				{
					item.submenu.hide();
					button.addClass("closed");
					button.removeClass("open");
				}
				else
				{
					item.submenu.show();
					button.addClass("open");
					button.removeClass("closed");
				}
			}
		}



		/*
			Befüllt das Menü mit Einträgen. Jeder Eintrag ist ein Objekt,
			das mindestens das Attribut caption haben muss. caption ist
			der angezeigte Text.

			Ist event gesetzt, dann wird bei einem Click auf den Eintrag
			ein entsprechendes Event ausgelöst, das an alle registrierten
			Listener geleitet wird. Der gesetzte Wert wird dabei als
			Parameter übergeben.

			Ist callback eine Funktion, wird diese bei einem Click auf den
			Eintrag aufgerufen.

			Ist submenu ein Array, dann wird ein Untermenü dargestellt. Für
			jeden einzelnen Eintrag im Untermenü zählen die selben Regeln wie
			für die Einträge in der obersten Menüebene.

			Mit open kann eingestellt werden, ob ein Untermenü im geöffneten
			Zustand dargestellt wird oder nicht. Standardmäßig werden alle
			Untermenüs geschlossen dargestellt.

			Ist disabled true, wird der Eintrag inaktiv dargestellt und kann
			nicht angeklickt werden.
		*/
		public setContent(content:any[]):void
		{
			this.topMenu.removeAllChildren();
			this.fillMenu(this.topMenu, content, 0);
		}
	}
}

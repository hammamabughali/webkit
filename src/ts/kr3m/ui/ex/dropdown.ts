/// <reference path="../../async/loop.ts"/>
/// <reference path="../../ui/element.ts"/>
/// <reference path="../../util/map.ts"/>



module kr3m.ui.ex
{
	/*
		Selbstgebautes DropDown-Listen-Element das sich deutlich
		einfacher über CSS anpassen lässt als das Standard-
		DropDown-Element der Browser und über weitere
		Funktionalitäten verfügt. Z.B. werden HTML-Angaben in den
		Captions der Werte auch als HTML angezeigt. Damit lassen
		sich auch Bilder / Icons und andere Sachen als Optionen
		darstellen.
	*/
	export class DropDown extends kr3m.ui.Element
	{
		private options = new kr3m.util.Map<string>();
		private selected:any = null;
		private initValues:any = null;
		private initLocaPrefix:string = null;

		private callToActionCaption:string = null;
		private callToActionValue:string = null;

		private preChangeListeners:Array<(newValue?:string, callback?:(doContinue:boolean) => void) => void> = [];
		private changeListeners:Array<(newValue?:string) => void> = [];

		private current:kr3m.ui.Element;
		private popup:kr3m.ui.Element;



		constructor(parent, values:any = null, classname:string = "", locaPrefix:string = null)
		{
			super(parent, null, "div", {"class":"dropDown closed " + classname});
			this.initValues = values;
			this.initLocaPrefix = locaPrefix;
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();

			this.setAttribute("tabindex", "0");
			this.dom.on("blur", this.close.bind(this));

			this.current = new kr3m.ui.Element(this, null, "div", {"class":"current"});
			this.current.dom.on("click", this.togglePopup.bind(this));

			var popupContainer = new kr3m.ui.Element(this, null, "div", {style:"position:relative;"});
			this.popup = new kr3m.ui.Element(popupContainer, null, "div", {"class":"popuplist", style:"position:absolute;"});
			this.popup.hide();

			if (this.initValues)
			{
				if (this.initLocaPrefix)
					this.setLocalizedValues(this.initValues, this.initLocaPrefix);
				else
					this.setValues(this.initValues);

				this.initValues = null;
				this.initLocaPrefix = null;
			}
		}



		private togglePopup():void
		{
			if (this.popup.isVisible())
				this.close();
			else
				this.open();
		}



		private open():void
		{
			if (!this.isEnabled())
				return;

			this.popup.show();
			this.removeClass("closed");
			this.addClass("open");
		}



		private close():void
		{
			this.popup.hide();
			this.removeClass("open");
			this.addClass("closed");
		}



		/*
			Setzt einen (HTML-)Text und Wert, der angezeigt / zurückgegeben
			wird, so lange der User noch nichts ausgewählt hat.
		*/
		public setCallToAction(caption:string, value:string = null):void
		{
			this.callToActionCaption = caption;
			this.callToActionValue = value;

			if (!this.selected)
			{
				this.current.dom.html(this.callToActionCaption);
				this.current.addClass("callToAction");
			}
		}



		public addValues(values:any):void
		{
			for (var i in values)
				this.addValue(i, values[i]);
		}



		public addValue(value:string, caption:string):void
		{
			this.options.set(value, caption);
			var butt = new kr3m.ui.Element(this.popup, null, "div", {"class":"option"});
			butt.dom.on("click", this.select.bind(this, value));
			butt.dom.html(caption);
		}



		public addLocalizedValue(value:string, prefix:string):void
		{
			this.addValue(value, loc(prefix + value));
		}



		public addLocalizedValues(values:any, prefix:string):void
		{
			for (var i in values)
				this.addLocalizedValue(values[i], prefix);
		}



		public setLocalizedValues(values:any, prefix:string):void
		{
			this.clearValues();
			this.addLocalizedValues(values, prefix);
		}



		public clearValues():void
		{
			this.current.removeAllChildren();
			this.popup.removeAllChildren();
			this.selected = null;
		}



		public removeAllChildren(removeHtmlToo:boolean = true):void
		{
			this.clearValues();
		}



		public setValues(values:any):void
		{
			this.clearValues();
			this.addValues(values);
		}



		public getSelectedValue():string
		{
			return this.selected ? this.selected : this.callToActionValue;
		}



		public getSelectedText():string
		{
			return this.selected ? this.options.get(this.selected) : null;
		}



		public select(value:any):void
		{
			this.close();

			if (value == this.selected)
				return;

			this.callPreChangeListeners(value, (abort:boolean) =>
			{
				if (abort)
					return;

				var option = this.options.get(value);
				if (option)
				{
					this.selected = value;
					this.current.dom.html(option);
					this.current.removeClass("callToAction");
					this.callChangeListeners();
				}
				else
				{
					this.selected = null;
					this.current.dom.html(this.callToActionCaption);
					this.current.addClass("callToAction");
					this.callChangeListeners();
				}
			});
		}



		public selectByText(text:string):void
		{
			var value = this.options.getKeyByValue(text);
			if (value)
				this.select(value);
		}



		private callChangeListeners():void
		{
			var value = this.getSelectedValue();
			for (var i = 0; i < this.changeListeners.length; ++i)
				this.changeListeners[i](value);
		}



		private callPreChangeListeners(newValue:any, callback:(abort:boolean) => void):void
		{
			var abort = false;
			var i = 0;
			kr3m.async.Loop.loop((loopCallback:(keepGoing:boolean) => void) =>
			{
				if (i >= this.preChangeListeners.length)
					return loopCallback(false);

				this.preChangeListeners[i++](newValue, (doContinue:boolean) =>
				{
					if (!doContinue)
						abort = true;
					loopCallback(doContinue);
				});
			}, () =>
			{
				callback(abort);
			});
		}



		public addChangeListener(listener:(newValue?:string) => void):void
		{
			this.changeListeners.push(listener);
		}



		public addPreChangeListener(listener:(newValue?:string, callback?:(doContinue:boolean) => void) => void):void
		{
			this.preChangeListeners.push(listener);
		}



		public enable():void
		{
			super.enable();
			this.close();
		}



		public resetVoValue():void
		{
			this.select(null);
		}



		public getVoValue():any
		{
			return this.getSelectedValue();
		}



		public setVoValue(value:any):void
		{
			this.select(value);
		}
	}
}

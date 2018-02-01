/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/ex/autocompletepopup.ts"/>
/// <reference path="../util/device.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../util/validator.ts"/>



//# DEPRECATED: kr3m.ui.Editbox is deprecated. Please use kr3m.ui.Editbox2 instead.
module kr3m.ui
{
	/*
		Einfaches Eingabefeld mit optionalem Call-To-Action-Text,
		einfachen Eingabevalidierungsmethoden und einzelnen
		Bequemlichkeitsmethoden.
	*/
	export class Editbox extends kr3m.ui.Element
	{
		public static FLAG_REQUIRED = "REQUIRED";
		public static FLAG_EMAIL = "EMAIL";
		public static FLAG_PASSWORD = "PASSWORD";
		public static FLAG_MODERN_PLACEHOLDER = "MODERN_PLACEHOLDER";

		public static ERROR_REQUIRED = "REQUIRED";
		public static ERROR_EMAIL = "EMAIL";

		public static ERROR_FILTER = "FILTER";

		private callToActionText:string;
		private flags:string[];
		private hasFocus:boolean;

		private filter:RegExp;

		private changeListeners:Array<(newValue:string, oldValue:string) => void>;
		private changeFunc:(eventObject:JQueryEventObject) => void;
		private oldText:string;

		private lastACOption:string;
		private autoCompletePopup:kr3m.ui.ex.AutoCompletePopup;



		public static isPlaceholderSupported():boolean
		{
			var device = kr3m.util.Device.getInstance();
			return !(device.ie && device.ieVersion < 11);
		}



		constructor(parent, className = "", flags:string[] = [])
		{
			super(parent, null, "input", {type : flags.indexOf(Editbox.FLAG_PASSWORD) >= 0 ? "password" : "text"});
			if (className)
				this.addClass(className);

			this.callToActionText = "";
			this.flags = flags;

			if (!Editbox.isPlaceholderSupported())
				kr3m.util.Util.remove(this.flags, Editbox.FLAG_MODERN_PLACEHOLDER);

			this.filter = null;

			this.changeListeners = [];
			this.changeFunc = null;
			this.oldText = "";
		}



		public onAddedToStage():void
		{
			setTimeout(() =>
			{
				super.onAddedToStage();

				if (this.dom.attr("type") == "password" && !this.hasFlag(Editbox.FLAG_PASSWORD))
					this.flags.push(Editbox.FLAG_PASSWORD);

				if (this.callToActionText == "")
				{
					var placeholder = this.dom.attr("placeholder");
					if (placeholder && placeholder != "" && !this.hasFlag(Editbox.FLAG_MODERN_PLACEHOLDER))
					{
						this.setCallToActionText(placeholder);
						this.dom.removeAttr("placeholder");
					}
				}

				this.dom.on("blur", this.onFocusOut.bind(this));
				this.dom.on("focus", this.onFocusIn.bind(this));

				this.checkState();

				if (this.changeListeners.length > 0)
					this.startChecking();

				this.updateChangeCheckStatus();
			});
		}



		public onRemovedFromStage():void
		{
			this.dom.off("blur", this.onFocusOut.bind(this));
			this.dom.off("focus", this.onFocusIn.bind(this));

			super.onRemovedFromStage();

			this.updateChangeCheckStatus();
		}



		/*
			Aktiviert das Auto-Complete-Feature der Editbox. Als
			Parameter muss eine Funktion übergeben werden, welche,
			wenn sie mit einem Wert aufgerufen wird, eine Liste von
			anzuzeigenden Einträgen (via callback) zurück gibt.
		*/
		public enableAutoComplete(
			searchFunc:(text:string, callback:CB<string[]>) => void,
			showDropdownOnClick = false,
			optionsUnscaped = false):void
		{
			if (!this.autoCompletePopup)
			{
				this.autoCompletePopup = new kr3m.ui.ex.AutoCompletePopup(this, (option) =>
				{
					this.lastACOption = option;
					this.setText(option);
					if (this.changeFunc)
						this.changeFunc(null);
				}, optionsUnscaped);

				this.lastACOption = this.getText();

				this.addChangeListener((newValue) =>
				{
					if (newValue == this.lastACOption)
						return;
					this.lastACOption = newValue;

					searchFunc(newValue, this.autoCompletePopup.setOptions.bind(this.autoCompletePopup));
				});

				if (showDropdownOnClick)
					this.on("click", () => this.autoCompletePopup.showOnClicked());
			}
		}



		private turnIntoPasswordEdit():void
		{
			if (this.dom.attr("type") == "password")
				return;

			this.dom.attr("type", "password");
		}



		private turnIntoTextEdit():void
		{
			if (this.dom.attr("type") == "text")
				return;

			this.dom.attr("type", "text");
		}



		public removeFlag(flag:string):void
		{
			kr3m.util.Util.remove(this.flags, flag);

			if (flag == Editbox.FLAG_PASSWORD && !this.callToActionVisible())
				this.turnIntoTextEdit();
		}



		public addFlag(flag:string):void
		{
			if (!Editbox.isPlaceholderSupported() && flag == Editbox.FLAG_MODERN_PLACEHOLDER)
				return;

			if (!this.hasFlag(flag))
			{
				this.flags.push(flag);
				if (flag == Editbox.FLAG_PASSWORD && !this.callToActionVisible())
					this.turnIntoPasswordEdit();
			}
		}



		public hasFlag(flag:string):boolean
		{
			return this.flags.indexOf(flag) >= 0;
		}



		private callToActionVisible():boolean
		{
			return this.hasClass("callToAction");
		}



		private showCallToAction():void
		{
			this.addClass("callToAction");
			this.dom.val(this.callToActionText);

			if (this.hasFlag(Editbox.FLAG_PASSWORD))
				this.turnIntoTextEdit();
		}



		private hideCallToAction():void
		{
			this.removeClass("callToAction");

			if (this.hasFlag(Editbox.FLAG_PASSWORD))
				this.turnIntoPasswordEdit();
		}



		private checkState():void
		{
			var text = this.dom.val();
			if (!this.hasFocus && (this.callToActionText != "" && (text == "" || text == this.callToActionText)))
				this.showCallToAction();
			else
				this.hideCallToAction();
		}



		public validate():string
		{
			var text = this.getText();

			if (this.hasFlag(Editbox.FLAG_REQUIRED) && text == "")
				return Editbox.ERROR_REQUIRED;

			if (!this.isEmpty() && this.hasFlag(Editbox.FLAG_EMAIL) && !kr3m.util.Validator.email(text))
				return Editbox.ERROR_EMAIL;

			if (this.filter && !this.filter.test(text))
				return Editbox.ERROR_FILTER;

			return super.validate();
		}



		private onFocusIn():void
		{
			this.hasFocus = true;
			if (this.callToActionVisible())
			{
				this.dom.val("");
				this.hideCallToAction();
			}
		}



		private onFocusOut():void
		{
			this.hasFocus = false;
			this.checkState();
		}



		public setText(text:any):void
		{
			this.lastACOption = text;
			this.dom.val(text.toString());
			this.checkState();
		}



		public getText():string
		{
			var text = this.dom.val();
			return (text != this.callToActionText) ? text : "";
		}



		public setMaxLength(value:number):void
		{
			this.dom.attr("maxlength", value);
		}



		public isEmpty():boolean
		{
			return this.getText() == "";
		}



		/*
			Setzt den Call-To-Action-Text des Elements, d.h.
			den Text, der angezeigt wird, so lange der User
			noch keinen eigenen Text in das Feld eingetragen
			hat.
		*/
		public setCallToActionText(text:string):void
		{
			if (this.dom.val() == this.callToActionText)
				this.dom.val(text);
			this.callToActionText = text;
			this.checkState();
		}



		private startChecking():void
		{
			if (this.changeFunc)
				return;

			this.changeFunc = this.checkForChange.bind(this);
			this.on("keydown", this.changeFunc);
			this.on("keyup", this.changeFunc);
		}



		private stopChecking():void
		{
			if (!this.changeFunc)
				return;

			this.off("keyup", this.changeFunc);
			this.off("keydown", this.changeFunc);
			this.changeFunc = null;
		}



		private checkForChange():void
		{
			var text = this.getText();
			if (text != this.oldText)
			{
				for (var i = 0; i < this.changeListeners.length; ++i)
					this.changeListeners[i](text, this.oldText);
				this.oldText = text;
			}
		}



		private updateChangeCheckStatus():void
		{
			if (this.parent && this.changeListeners.length > 0)
			{
				this.oldText = this.getText();
				this.startChecking();
			}
			else
			{
				this.stopChecking();
			}
		}



		public setFilter(filter:RegExp):void
		{
			this.filter = filter;
		}



		public disable():void
		{
			this.addClass("disabled");
			this.setAttribute("disabled", "disabled");
		}



		public enable():void
		{
			this.removeClass("disabled");
			this.removeAttribute("disabled");
		}



		/*
			Fügt eine Listener-Function hinzu, die immer dann
			aufgerufen wird, wenn sich der Inhalt der Textbox
			ändert. Die Funktion erhält den neuen und den alten
			Inhalt als Parameter übergeben.

			Diese Methode benutzt ausdrücklich NICHT onChange
			des Html-Attributes, um verschiedene Verhalten bei
			verschiedenen Browsern zu verhindern.
		*/
		public addChangeListener(
			listener:(newValue:string, oldValue:string) => void):void
		{
			if (!kr3m.util.Util.contains(this.changeListeners, listener))
			{
				this.changeListeners.push(listener);
				this.updateChangeCheckStatus();
			}
		}



		public removeChangeListener(
			listener:(newValue:string, oldValue:string) => void):void
		{
			if (kr3m.util.Util.remove(this.changeListeners, listener))
				this.updateChangeCheckStatus();
		}



		public removeChangeListeners():void
		{
			this.changeListeners = [];
			this.updateChangeCheckStatus();
		}



		public resetVoValue():void
		{
			this.setText("");
		}



		public getVoValue():any
		{
			return this.getText();
		}



		public setVoValue(value:any):void
		{
			this.setText(value);
		}



		public selectText():void
		{
			this.dom.get(0).setSelectionRange(0, this.getText().length);
		}



		public deselectText():void
		{
			this.dom.get(0).setSelectionRange(0, 0);
		}



		public copyToClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("copy");

			if (!isVisible)
				this.hide();
		}



		public cutToClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("cut");

			if (!isVisible)
				this.hide();
		}



		public pasteFromClipBoard():void
		{
			var isVisible = this.isVisible();
			if (!isVisible)
				this.show();

			this.dom.get(0).select();
			document.execCommand("paste");

			if (!isVisible)
				this.hide();
		}
	}
}

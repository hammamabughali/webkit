/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/option.ts"/>
/// <reference path="../util/localization.ts"/>



module kr3m.ui
{
	export interface DropDownOption
	{
		value:any;
		caption:any;
		disabled?:boolean;
	}



	export class DropDown extends kr3m.ui.Element
	{
		private callToActionText:string;
		private options:DropDownOption[] = [];

		public sortValues = false;



		constructor(parent, values?:any, className?:string, locaPrefix?:string)
		{
			super(parent, null, "select", className ? {"class":className} : {});
			if (values)
			{
				if (typeof locaPrefix == "string")
					this.setLocalizedValues(values, locaPrefix);
				else
					this.setValues(values);
			}
		}



		public setCallToActionText(text:string):void
		{
			this.callToActionText = text;
			this.rebuildList();
		}



		private rebuildList():void
		{
			this.removeAllChildren();
			if (this.callToActionText)
			{
				var cta = new kr3m.ui.Option(this, "", this.callToActionText);
				cta.disable();
			}

			if (this.sortValues)
				this.options.sort((a, b) => a.caption.localeCompare(b.caption));

			for (var i = 0; i < this.options.length; ++i)
			{
				var option = new kr3m.ui.Option(this, this.options[i].value, this.options[i].caption);
				if (this.options[i].disabled)
					option.disable();
			}

			var list = this.dom.get(0);
			list.selectedIndex = 0;
		}



		public addValues(values:any):void
		{
			for (var i in values)
				this.options.push({value : i, caption : values[i]});
			this.rebuildList();
		}



		public addValue(value:string, caption:string, disabled?:boolean):void
		{
			this.options.push({value : value, caption : caption, disabled : disabled});
			this.rebuildList();
		}



		public addOptions(values:DropDownOption[]):void
		{
			this.options = this.options.concat(values);
			this.rebuildList();
		}



		public clearValues():void
		{
			this.options = [];
			this.rebuildList();
		}



		public addLocalizedValue(value:string, prefix:string = "", disabled?:boolean):void
		{
			this.options.push({value : value, caption :kr3m.util.Localization.get(prefix + value), disabled: disabled});
			this.rebuildList();
		}



		public addLocalizedValues(values:any, prefix:string):void
		{
			for (var i in values)
				this.options.push({value : values[i], caption :kr3m.util.Localization.get(prefix + values[i])});
			this.rebuildList();
		}



		public setLocalizedValues(values:any, prefix:string = ""):void
		{
			this.options = [];
			this.addLocalizedValues(values, prefix);
		}



		public setValues(values:any):void
		{
			this.options = [];
			this.addValues(values);
		}



		public setOptions(values:DropDownOption[]):void
		{
			this.options = [];
			this.addOptions(values);
		}



		public getSelectedValue():string
		{
			var list = this.dom.get(0);
			var option = list.options[list.selectedIndex];
			return option ? option.value : null;
		}



		public getSelectedText():string
		{
			var list = this.dom.get(0);
			var option = list.options[list.selectedIndex];
			return option ? option.text : null;
		}



		public select(value:any):void
		{
			if (value === undefined || value === null)
				return;

			value = value.toString();
			var list = this.dom.get(0);
			for (var i = 0; i < list.options.length; ++i)
			{
				if (list.options[i].value == value)
				{
					list.selectedIndex = i;
					return;
				}
			}
		}



		public selectByText(text:string):void
		{
			var list = this.dom.get(0);
			for (var i = 0; i < list.options.length; ++i)
			{
				if (list.options[i].text == text)
				{
					list.selectedIndex = i;
					return;
				}
			}
		}



		public addChangeListener(listener:() => void):void
		{
			this.dom.on("change", listener);
		}



		public removeChangeListeners():void
		{
			this.dom.off("change");
		}



		public resetVoValue():void
		{
			var list = this.dom.get(0);
			var option = list.options[0];
			if (option)
				this.select(option.value);
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

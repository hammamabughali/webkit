/// <reference path="../ui2/formelement.ts"/>
/// <reference path="../ui2/option.ts"/>



module kr3m.ui2
{
	export interface SelectOptions extends FormElementOptions
	{
		options?:{[value:string]:{toString():string}};
	}



	export class Select extends FormElement
	{
		protected dom:HTMLSelectElement;
		protected options:SelectOptions;



		constructor(parentNode:ParentTypes, options?:SelectOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "select"}));

			if (this.options.options)
				this.setOptions(this.options.options);
		}



		public setOptions(options:{[value:string]:{toString():string}}):void
		{
			this.removeAllChildren();
			for (var value in options)
				new Option(this, {value : value, caption : options[value].toString()});
		}



		public setValue(value:string):void
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i].getAttribute("value") == value)
				{
					this.dom.selectedIndex = i;
					return;
				}
			}
			this.dom.selectedIndex = -1;
		}



		public getValue():string
		{
			if (this.dom.selectedIndex < 0)
				return undefined;

			return this.children[this.dom.selectedIndex].getAttribute("value");
		}
	}
}

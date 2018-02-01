/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface FormElementOptions extends ElementOptions
	{
		value?:{toString():string};
		disabled?:boolean;
		readonly?:boolean;
		formId?:string;
	}



	export abstract class FormElement extends Element
	{
		protected options:FormElementOptions;



		constructor(parentNode:ParentTypes, options?:FormElementOptions)
		{
			super(parentNode, options);
			this.initOptionsAttributes("value", "disabled", "readonly");

			if (this.options.formId)
				this.setAttribute("form", this.options.formId);
		}



		public abstract setValue(value:{toString():string}):void;
		public abstract getValue():any;
	}
}

/// <reference path="../ui2/formelement.ts"/>



module kr3m.ui2
{
	export interface InputOptions extends FormElementOptions
	{
		type?:string;
	}



	export abstract class Input extends FormElement
	{
		protected dom:HTMLInputElement;
		protected options:InputOptions;



		constructor(parentNode:ParentTypes, options?:InputOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "input"}));
			this.initOptionsAttributes("type");
		}



		public setValue(value:{toString():string}):void
		{
			this.dom.value = value.toString();
		}



		public getValue():string
		{
			return this.dom.value;
		}
	}
}

/// <reference path="../net2/constants.ts"/>
/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface FormOptions extends ElementOptions
	{
		action?:string;
		method?:kr3m.net2.HttpMethod;
		enctype?:string;
	}



	export class Form extends Element
	{
		protected options:FormOptions;



		constructor(parentNode:ParentTypes, options?:FormOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "form"}));
			this.options.enctype = this.options.enctype || "multipart/form-data";
			this.initOptionsAttributes("action", "method", "enctype");
		}
	}
}

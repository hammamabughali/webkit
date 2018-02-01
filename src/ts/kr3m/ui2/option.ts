/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface OptionOptions extends ElementOptions
	{
		value?:{toString():string};
		caption?:string;
	}



	export class Option extends Element
	{
		protected options:OptionOptions;



		constructor(parentNode:ParentTypes, options?:OptionOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "option"}));
			this.initOptionsAttributes("value");

			if (this.options.caption)
				this.setHtml(this.options.caption);
		}
	}
}

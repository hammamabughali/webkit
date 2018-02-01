/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface ButtonOptions extends ElementOptions
	{
		caption?:string;
	}



	export class Button extends Element
	{
		protected options:ButtonOptions;



		constructor(parentNode:ParentTypes, options?:ButtonOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "button"}));

			if (this.options.caption)
				this.setHtml(this.options.caption);
		}
	}
}

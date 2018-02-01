/// <reference path="../ui2/input.ts"/>



module kr3m.ui2
{
	export interface InputTextOptions extends InputOptions
	{
		placeholder?:string;
		size?:number;
	}



	export class InputText extends Input
	{
		protected options:InputTextOptions;



		constructor(parentNode:ParentTypes, options?:InputTextOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {type : "text"}));
			this.initOptionsAttributes("placeholder", "size");
		}
	}
}

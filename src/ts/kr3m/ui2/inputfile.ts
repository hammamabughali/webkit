/// <reference path="../ui2/input.ts"/>



module kr3m.ui2
{
	export interface InputFileOptions extends InputOptions
	{
		accept?:string;
		multiple?:boolean;
	}



	export class InputFile extends Input
	{
		protected options:InputFileOptions;



		constructor(parentNode:ParentTypes, options?:InputFileOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {type : "file"}));
			this.initOptionsAttributes("accept", "multiple");
		}



		public setAcceptImages():void
		{
			this.setAttribute("accept", "image/*");
		}
	}
}

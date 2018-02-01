/// <reference path="../ui2/input.ts"/>



module kr3m.ui2
{
	export class InputHidden extends Input
	{
		constructor(parentNode:ParentTypes, options?:InputOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {type : "hidden"}));
		}
	}
}

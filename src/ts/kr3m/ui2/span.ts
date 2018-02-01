/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export class Span extends Element
	{
		constructor(parentNode:ParentTypes, options?:ElementOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "span"}));
		}
	}
}

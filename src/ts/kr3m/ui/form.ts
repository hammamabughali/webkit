/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Form extends kr3m.ui.Element
	{
		constructor(parent:kr3m.ui.Element, action?:string, method:string = "post")
		{
			super(parent, null, "form");
			if (action)
				this.setAttribute("action", action);

			this.setAttribute("method", method);
		}
	}
}

/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Option extends kr3m.ui.Element
	{
		constructor(parent:kr3m.ui.Element, value:any, text:any)
		{
			super(parent, null, "option", {value : value.toString()});
			this.dom.text(text.toString());
		}



		public enable():void
		{
			super.enable();
			this.dom.get(0).disabled = false;
		}



		public disable():void
		{
			super.disable();
			this.dom.get(0).disabled = true;
		}
	}
}

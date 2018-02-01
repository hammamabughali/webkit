/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Label extends kr3m.ui.Element
	{
		constructor(parent, caption:string)
		{
			super(parent, null, "label");
			this.setText(caption);
		}



		public setText(text:string):void
		{
			this.dom.text(text);
		}



		public setHtml(html:string):void
		{
			this.dom.html(html);
		}



		public addChild(child:kr3m.ui.Element):void
		{
			child.parent = this;
			this.children.unshift(child);
			this.dom.prepend(child.dom);
			child.onAddedToStage();
		}
	}
}

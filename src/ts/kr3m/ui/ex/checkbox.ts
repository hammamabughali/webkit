/// <reference path="../../ui/element.ts"/>
/// <reference path="../../ui/textbox.ts"/>



module kr3m.ui.ex
{
	export class Checkbox extends kr3m.ui.Element
	{
		private box:kr3m.ui.Element;
		private label:kr3m.ui.Textbox;



		constructor(parent, label?:string, className?:string)
		{
			super(parent, null, "div", {tabindex : "0"});
			this.addClass("checkbox");
			if (className)
				this.addClass(className);

			this.box = new kr3m.ui.Element(this, null, "span", {"class" : "box"});
			this.label = new kr3m.ui.Textbox(this, "", "label");
			if (label)
				this.label.setHtml(label);

			this.on("click", this.toggleChecked.bind(this, true));
			this.on("keydown", this.onKeyDown.bind(this));
		}



		public onKeyDown(event:JQueryKeyEventObject):void
		{
			if (event.keyCode == 32)
				this.toggleChecked(true);
		}



		public getLabel():string
		{
			return this.label.getText();
		}



		public toggleChecked(byUser:boolean, event?:JQueryEventObject):void
		{
			if (event && event.target["tagName"] == "A")
				return;

			if (byUser && this.isDisabled())
				return;

			this.setChecked(!this.isChecked());
			if (byUser)
				this.dom.trigger("change");
		}



		public setChecked(value:boolean):void
		{
			if (value)
			{
				this.addClass("checked");
				this.box.addClass("checked");
			}
			else
			{
				this.box.removeClass("checked");
				this.removeClass("checked");
			}
		}



		public isChecked():boolean
		{
			return this.hasClass("checked");
		}
	}
}

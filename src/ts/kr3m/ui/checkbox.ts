/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Checkbox extends kr3m.ui.Element
	{
		constructor(parent, className?:string)
		{
			super(parent, null, "input", {type : "checkbox"});
			if (className)
				this.addClass("className");
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.on("change", this.onChange.bind(this));
		}



		public onRemovedFromStage():void
		{
			this.off("change", this.onChange.bind(this));
			super.onRemovedFromStage();
		}



		public onChange():void
		{
			if (this.isChecked())
				this.addClass("checked");
			else
				this.removeClass("checked");
		}



		public isChecked():boolean
		{
			return this.dom.prop("checked");
		}



		public setChecked(value:boolean = true):void
		{
			this.dom.prop("checked", value);
			this.onChange();
		}



		public toggleChecked(initiatedByUser:boolean):void
		{
			if (initiatedByUser)
				this.trigger("click");
			else
				this.setChecked(!this.isChecked());
		}
	}
}

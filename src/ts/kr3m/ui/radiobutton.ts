/// <reference path="../ui/element.ts"/>
/// <reference path="../util/map.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.ui
{
	export class RadioButton extends kr3m.ui.Element
	{
		private static groups = new kr3m.util.Map<kr3m.ui.RadioButton[]>();



		constructor(parent, className:string = "", name:string = "")
		{
			super(parent, null, "input", {"class":className, name:name, type:"radio"});
		}



		public onAddedToStage():void
		{
			var self = kr3m.ui.RadioButton;
			var name = this.getName();
			if (!self.groups.contains(name))
				self.groups.set(name, []);
			self.groups.get(name).push(this);

			this.dom.on("change", this.onChange.bind(this));

			super.onAddedToStage();
		}



		public onRemovedFromStage():void
		{
			super.onRemovedFromStage();

			var self = kr3m.ui.RadioButton;
			var name = this.getName();
			kr3m.util.Util.remove(self.groups.get(name), this);

			this.dom.off("change", this.onChange.bind(this));
		}



		public getGroupButtons():kr3m.ui.RadioButton[]
		{
			var self = kr3m.ui.RadioButton;
			var name = this.getName();
			return self.groups.get(name);
		}



		public onChange():void
		{
			var buttons = this.getGroupButtons();
			for (var i = 0; i < buttons.length; ++i)
			{
				if (buttons[i].isChecked())
					buttons[i].addClass("checked");
				else
					buttons[i].removeClass("checked");
			}
		}



		public isChecked():boolean
		{
			return this.dom.prop("checked");
		}



		public setChecked(value:boolean):void
		{
			this.dom.prop("checked", value);
			this.onChange();
		}
	}
}

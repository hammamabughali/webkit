/// <reference path="../../ui/ex/checkbox.ts"/>
/// <reference path="../../ui/textbox.ts"/>



module kr3m.ui.ex
{
	export class RadioButton extends kr3m.ui.ex.Checkbox
	{
		private static groups:{[name:string]:kr3m.ui.ex.RadioButton[]} = {};

		private groupName:string;



		constructor(parent, groupName:string, label?:string, className?:string)
		{
			super(parent, label, className);
			this.removeClass("checkbox");
			this.addClass("radiobutton");

			this.groupName = groupName;

			var self = kr3m.ui.ex.RadioButton;
			if (!self.groups[this.groupName])
				self.groups[this.groupName] = [];
			self.groups[this.groupName].push(this);
		}



		public toggleChecked(byUser:boolean, event?:JQueryEventObject):void
		{
			if (byUser && (this.isChecked() || this.isDisabled()))
				return;

			var self = kr3m.ui.ex.RadioButton;
			var radios = self.groups[this.groupName];
			for (var i = 0; i < radios.length; ++i)
			{
				if (radios[i] != this)
					radios[i].setChecked(false);
			}

			super.toggleChecked(byUser, event);
		}
	}
}

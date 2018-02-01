/// <reference path="../../ui/ex/radiobutton.ts"/>



module kr3m.ui.ex
{
	export class RadioButtonGroup extends kr3m.ui.Element
	{
		private groupName:string;

		private buttons:{[id:string]:kr3m.ui.ex.RadioButton} = {};



		constructor(parent, groupName:string, values?:any, className?:string)
		{
			super(parent);
			this.addClass("radioButtonGroup");
			this.groupName = groupName;
			if (className)
				this.addClass(className);

			if (values)
				this.setValues(values);
		}



		public setValues(values:any):void
		{
			this.buttons = {};
			this.removeAllChildren();
			this.addValues(values);
		}



		public addValues(values:any):void
		{
			for (var i in values)
			{
				var button = new kr3m.ui.ex.RadioButton(this, this.groupName, values[i]);
				this.buttons[i] = button;
			}
		}



		public select(value:string):void
		{
			if (this.buttons[value])
				this.buttons[value].setChecked(true);
			else
				logError("invalid value for RadioButtonGroup.select():", value, " - possible values are", Object.keys(this.buttons));
		}



		public getSelectedValue():string
		{
			for (var i in this.buttons)
			{
				if (this.buttons[i].isChecked())
					return i;
			}
			return null;
		}
	}
}

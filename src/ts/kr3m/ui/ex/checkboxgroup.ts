/// <reference path="../../ui/ex/checkbox.ts"/>



module kr3m.ui.ex
{
	export class CheckboxGroup extends kr3m.ui.Element
	{
		private boxes:{[id:string]:kr3m.ui.ex.Checkbox} = {};

		public sortValues = false;



		constructor(parent, values?:any, className?:string)
		{
			super(parent);
			this.addClass("checkboxGroup");
			if (className)
				this.addClass(className);

			if (values)
				this.setValues(values);
		}



		public setValues(values:any):void
		{
			this.boxes = {};
			this.removeAllChildren();

			var keys = Object.keys(values);
			if (this.sortValues)
				keys.sort((a, b) => values[a].localeCompare(values[b]));

			for (var i = 0; i < keys.length; ++i)
			{
				var box = new kr3m.ui.ex.Checkbox(this, values[keys[i]]);
				this.boxes[keys[i]] = box;
			}
		}



		public select(values:string[]):void
		{
			for (var i in this.boxes)
			{
				var checked = kr3m.util.Util.contains(values, i);
				this.boxes[i].setChecked(checked);
			}
		}



		public getSelectedValues():string[]
		{
			var result:string[] = [];
			for (var i in this.boxes)
			{
				if (this.boxes[i].isChecked())
					result.push(i);
			}
			return result;
		}
	}
}

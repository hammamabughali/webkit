/// <reference path="../ui/editbox.ts"/>
/// <reference path="../ui/table.ts"/>



module kr3m.ui
{
	export class TimeSelect extends kr3m.ui.Table
	{
		private valueEdits:kr3m.ui.Editbox[];

		public onChange:() => void = null;



		constructor(parent:kr3m.ui.Element)
		{
			super(parent, {"class":"timeSelect"});
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.initCells();
		}



		private initCells():void
		{
			var row = new kr3m.ui.Row(this);
			for (var i = 0; i < 2; ++i)
			{
				var cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
				cell.setText("+");
				cell.dom.on("click", this.onClick.bind(this, i, 1));
			}
			this.valueEdits = [];
			row = new kr3m.ui.Row(this);
			for (var i = 0; i < 2; ++i)
			{
				cell = new kr3m.ui.Cell(row);
				this.valueEdits.push(new kr3m.ui.Editbox(cell));
				this.valueEdits[i].dom.css("text-align", "center");
				this.valueEdits[i].dom.on("change", this.onValueChanged.bind(this));
			}
			row = new kr3m.ui.Row(this);
			for (var i = 0; i < 2; ++i)
			{
				cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
				cell.setText("-");
				cell.dom.on("click", this.onClick.bind(this, i, -1));
			}
		}



		private onClick(i:number, delta:number):void
		{
			var max = [23, 59][i];
			var value = parseInt(this.valueEdits[i].getText());
			if (isNaN(value))
				value = 0;
			value += delta;
			if (value < 0)
				value += max + 1;
			if (value > max)
				value -= max + 1;
			this.valueEdits[i].setText(value.toString());

			if (this.onChange)
				this.onChange();
		}



		private onValueChanged():void
		{
			if (this.onChange)
				this.onChange();
		}



		public getHours():number
		{
			var value = parseInt(this.valueEdits[0].getText());
			if (isNaN(value))
				value = 0;
			if (value < 0)
				value = 0;
			else if (value > 23)
				value = 23;
			return value;
		}



		public getMinutes():number
		{
			var value = parseInt(this.valueEdits[1].getText());
			if (isNaN(value))
				value = 0;
			if (value < 0)
				value = 0;
			else if (value > 59)
				value = 59;
			return value;
		}



		public setTime(time:Date):void
		{
			this.valueEdits[0].setText(time.getHours().toString());
			this.valueEdits[1].setText(time.getMinutes().toString());
		}
	}
}

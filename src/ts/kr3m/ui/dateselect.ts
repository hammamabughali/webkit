/// <reference path="../ui/cell.ts"/>
/// <reference path="../ui/datetimepopup.ts"/>
/// <reference path="../ui/row.ts"/>
/// <reference path="../ui/table.ts"/>
/// <reference path="../util/dates.ts"/>
/// <reference path="../util/localization.ts"/>



//# DEPRECATED: bitte statt DateSelect DateEdit verwenden
module kr3m.ui
{
	export class DateSelect extends kr3m.ui.Table
	{
		private selectedDate:Date;
		private shownMonth:number;
		private shownYear:number;

		private month:kr3m.ui.Cell;
		private year:kr3m.ui.Cell;
		private dayCells:kr3m.ui.Cell[];

		public onChange:() => void = null;



		constructor(parent:kr3m.ui.Element)
		{
			super(parent, {"class":"dateSelect", "tabindex":0});
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.initCells();
			this.fillCells();

			this.on("keydown", this.onKeyDown.bind(this));
			this.on("focusout", this.onBlur.bind(this));
		}



		private onBlur():void
		{
			var parentPopup = <kr3m.ui.DateTimePopup> this.getParentOfClass(kr3m.ui.DateTimePopup);
			if (parentPopup)
				parentPopup.close();
		}



		private onKeyDown(event:JQueryEventObject):void
		{
			switch (event.key)
			{
				case "Enter":
				case " ":
				case "Esc":
					this.onBlur();
					break;

				case "Up":
					this.selectedDate.setDate(this.selectedDate.getDate() - 7);
					this.changed(true);
					break;

				case "Down":
					this.selectedDate.setDate(this.selectedDate.getDate() + 7);
					this.changed(true);
					break;

				case "Left":
					this.selectedDate.setDate(this.selectedDate.getDate() - 1);
					this.changed(true);
					break;

				case "Right":
					this.selectedDate.setDate(this.selectedDate.getDate() + 1);
					this.changed(true);
					break;

				case "PageDown":
					this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
					this.changed(true);
					break;

				case "PageUp":
					this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
					this.changed(true);
					break;

				default:
					break;
			}
		}



		private initCells():void
		{
			this.selectedDate = new Date();
			this.shownMonth = this.selectedDate.getMonth() + 1;
			this.shownYear = this.selectedDate.getFullYear();

			var row = new kr3m.ui.Row(this);

			var cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
			cell.setText("<");
			cell.on("mousedown", this.showPreviousMonth.bind(this));

			this.month = new kr3m.ui.Cell(row, {"colspan":5});
			this.month.setText("REPLACE");

			cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
			cell.setText(">");
			cell.on("mousedown", this.showNextMonth.bind(this));

			row = new kr3m.ui.Row(this);

			cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
			cell.setText("<");
			cell.on("mousedown", this.showPreviousYear.bind(this));

			this.year = new kr3m.ui.Cell(row, {"colspan":5});
			this.year.setText("REPLACE");

			cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
			cell.setText(">");
			cell.on("mousedown", this.showNextYear.bind(this));

			row = new kr3m.ui.Row(this);
			for (var i = 0; i < 7; ++i)
			{
				cell = new kr3m.ui.Cell(row);
				cell.setText(kr3m.util.Localization.get("WEEKDAY_SHORT_" + i));
			}

			this.dayCells = [];
			for (var y = 0; y < 6; ++y)
			{
				row = new kr3m.ui.Row(this);
				for (var x = 0; x < 7; ++x)
				{
					cell = new kr3m.ui.Cell(row, {style:"cursor:pointer;"});
					this.dayCells.push(cell);
					cell.on("mousedown", this.onDateClicked.bind(this, y * 7 + x));
				}
			}
		}



		private changed(adjustMonthAndYear:boolean = false):void
		{
			if (adjustMonthAndYear)
			{
				this.shownMonth = this.selectedDate.getMonth() + 1;
				this.shownYear = this.selectedDate.getFullYear();
			}

			this.fillCells();

			if (this.onChange)
				this.onChange();
		}



		private onDateClicked(
			cellIndex:number,
			eventObject:JQueryEventObject):void
		{
			var text = this.dayCells[cellIndex].getText();
			if (text != "")
			{
				var shownDay = parseInt(text);
				this.selectedDate = new Date(this.shownYear, this.shownMonth - 1, shownDay);
				this.changed();
			}
			eventObject.preventDefault();
		}



		private showNextMonth(eventObject: JQueryEventObject):void
		{
			++this.shownMonth;
			if (this.shownMonth > 12)
			{
				this.shownMonth = 1;
				++this.shownYear;
			}
			this.fillCells();

			eventObject.preventDefault();
		}



		private showNextYear(eventObject: JQueryEventObject):void
		{
			++this.shownYear;
			this.fillCells();
			eventObject.preventDefault();
		}



		private showPreviousMonth(eventObject: JQueryEventObject):void
		{
			--this.shownMonth;
			if (this.shownMonth == 0)
			{
				this.shownMonth = 12;
				--this.shownYear;
			}
			this.fillCells();

			eventObject.preventDefault();
		}



		private showPreviousYear(eventObject: JQueryEventObject):void
		{
			--this.shownYear;
			this.fillCells();
			eventObject.preventDefault();
		}



		private fillCells():void
		{
			this.month.setText(kr3m.util.Localization.get("MONTH_" + this.shownMonth));
			this.year.setText(this.shownYear);

			var date = new Date(this.shownYear, this.shownMonth - 1, 1);
			var offset = (date.getDay() + 6) % 7;
			date.setMonth(date.getMonth() + 1);
			date.setDate(date.getDate() - 1);
			var days = date.getDate();

			var today = new Date();

			for (var i = 0; i < offset; ++i)
			{
				this.dayCells[i].setText("");
				this.dayCells[i].removeClass("selected");
				this.dayCells[i].css({cursor : "default"});
			}
			for (var i = 0; i  < days; ++i)
			{
				this.dayCells[i + offset].css({cursor : "pointer"});
				this.dayCells[i + offset].setText(i + 1);
				if (this.shownYear == this.selectedDate.getFullYear()
					&& (this.shownMonth - 1) == this.selectedDate.getMonth()
					&& (i + 1) == this.selectedDate.getDate())
				{
					this.dayCells[i + offset].addClass("selected");
				}
				else
				{
					this.dayCells[i + offset].removeClass("selected");
				}
				if (this.shownYear == today.getFullYear()
					&& (this.shownMonth - 1) == today.getMonth()
					&& (i + 1) == today.getDate())
				{
					this.dayCells[i + offset].addClass("today");
				}
				else
				{
					this.dayCells[i + offset].removeClass("today");
				}
			}
			for (var i = days + offset; i < this.dayCells.length; ++i)
			{
				this.dayCells[i].setText("");
				this.dayCells[i].removeClass("selected");
				this.dayCells[i].css({cursor : "default"});
			}
		}



		public setDate(date:Date):void
		{
			this.selectedDate = date;
			this.shownYear = date.getFullYear();
			this.shownMonth = date.getMonth() + 1;
			this.fillCells();
		}



		public getDate():Date
		{
			return this.selectedDate;
		}
	}
}

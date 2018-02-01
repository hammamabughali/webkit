/// <reference path="../constants.ts"/>
/// <reference path="../ui/dateselect.ts"/>
/// <reference path="../ui/editbox.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/timeselect.ts"/>



//# DEPRECATED: bitte statt DateTimePopup DateEdit verwenden
module kr3m.ui
{
	/*
		Klasse zum Auswählen von Datum, Zeit oder beidem.
		Kann mit einer Editbox verknüpft werden um deren
		Inhalt automatisch zu beziehen und anzupassen.
	*/
	export class DateTimePopup extends kr3m.ui.Element
	{
		private edit:kr3m.ui.Editbox = null;

		private showDate:boolean;
		private showTime:boolean;

		private button:kr3m.ui.Element = null;
		private popup:kr3m.ui.Element = null;

		private dateSelect:kr3m.ui.DateSelect = null;
		private timeSelect:kr3m.ui.TimeSelect = null;



		constructor(parent:kr3m.ui.Element, showDate:boolean = true, showTime:boolean = true)
		{
			super(parent, null, "span", {style:"position:relative;"});

			this.showDate = showDate;
			this.showTime = showTime;
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();

			setTimeout(() =>
			{
				if (!this.button)
					this.createButton();

				if (!this.popup)
					this.createPopup();
			}, 1);
		}



		private createButton():void
		{
			this.button = new kr3m.ui.Element(this, null, "span", {"class":"dateTimePopupButton"});
			this.button.on("click", this.onClick.bind(this));
		}



		private createPopup():void
		{
			this.popup = new kr3m.ui.Element(this, null, "div", {"class":"dateTimePopupWindow", style:"position:absolute; right:0px;"});

			if (this.showDate)
			{
				this.dateSelect = new kr3m.ui.DateSelect(this.popup);
				this.dateSelect.onChange = this.onDateChanged.bind(this);
			}

			if (this.showTime)
			{
				this.timeSelect = new kr3m.ui.TimeSelect(this.popup);
				this.timeSelect.onChange = this.onDateChanged.bind(this);
			}

			this.popup.hide();
		}



		public onRemovedFromStage():void
		{
			super.onRemovedFromStage();
		}



		private getResultString():string
		{
			if (this.showDate && this.showTime)
			{
				var date = this.dateSelect.getDate();
				date.setHours(this.timeSelect.getHours());
				date.setMinutes(this.timeSelect.getMinutes());
				return kr3m.util.Localization.getFormattedDate(FORMAT_DATETIME, date);
			}
			else if (this.showDate)
			{
				var date = this.dateSelect.getDate();
				return kr3m.util.Localization.getFormattedDate(FORMAT_DATE, date);
			}
			else if (this.showTime)
			{
				var date = new Date();
				date.setHours(this.timeSelect.getHours());
				date.setMinutes(this.timeSelect.getMinutes());
				return kr3m.util.Localization.getFormattedDate(FORMAT_TIME, date);
			}
			else
			{
				return "";
			}
		}



		public getDateFormatId():string
		{
			if (this.showDate && this.showTime)
				return kr3m.FORMAT_DATETIME;
			else if (this.showDate)
				return kr3m.FORMAT_DATE;
			else if (this.showTime)
				return kr3m.FORMAT_TIME;
			return "";
		}



		private getInitialDate():Date
		{
			if (!this.edit)
				return new Date();

			return kr3m.util.Localization.getDateFromString(this.getDateFormatId(), this.edit.getText()) || new Date();
		}



		private onDateChanged():void
		{
			if (this.edit)
			{
				this.edit.setText(this.getResultString());
				this.edit.trigger("change");
			}
		}



		private onTimeChanged():void
		{
			if (this.edit)
				this.edit.setText(this.getResultString());
		}



		public open():void
		{
			var date = this.getInitialDate() || new Date();
			if (this.dateSelect)
				this.dateSelect.setDate(date);
			if (this.timeSelect)
				this.timeSelect.setTime(date);

			this.popup.show();

			if (this.dateSelect)
				this.dateSelect.dom.focus();
			else if (this.timeSelect)
				this.timeSelect.dom.focus();
		}



		public close():void
		{
			this.popup.hide();
		}



		private onClick():void
		{
			if (this.popup.isVisible())
				this.close();
			else
				this.open();
		}



		public link(edit:kr3m.ui.Editbox):void
		{
			this.edit = edit;
		}



		public unlink():void
		{
			this.edit = null;
		}



		public getLinkedEdit():kr3m.ui.Editbox
		{
			return this.edit;
		}
	}
}

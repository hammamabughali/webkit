/// <reference path="../ui/element.ts"/>
/// <reference path="../util/dates.ts"/>



module kr3m.ui
{
	/*
		Simple class for input controls that display the browser's
		native date and time selecting popup dialogs.

		For more details see:
			http://caniuse.com/#feat=input-datetime
	*/
	export class DateEdit extends kr3m.ui.Element
	{
		constructor(
			parentElement:kr3m.ui.Element,
			protected showDate:boolean = true,
			protected showTime:boolean = false)
		{
			super(parentElement, null, "input");
			if (!showDate && !showTime)
				throw new Error("DateEdit must show at least one of date or time");
			this.adjustType();
		}



		protected adjustType():void
		{
			var type = "";
			if (this.showDate)
				type += "date";
			if (this.showTime)
				type += "time";
			if (this.showDate && this.showTime)
				type += "-local";
			this.setAttribute("type", type);
		}



		public setMode(showDate:boolean, showTime:boolean):void
		{
			this.showDate = showDate;
			this.showTime = showTime;
			this.adjustType();
		}



		public convertDate(date:Date):string
		{
			var parts:string[] = [];
			if (this.showDate)
				parts.push(kr3m.util.Dates.getDateString(date, false));
			if (this.showTime)
				parts.push(kr3m.util.Dates.getTimeString(date, false));
			return parts.join("T");
		}



		public setMin(date:Date|string):void
		{
			if (typeof date == "string")
				this.setAttribute("min", date);
			else
				this.setAttribute("min", this.convertDate(date));
		}



		public setMax(date:Date|string):void
		{
			if (typeof date == "string")
				this.setAttribute("max", date);
			else
				this.setAttribute("max", this.convertDate(date));
		}



		public setValue(date:Date|string):void
		{
			if (!date)
				this.dom.val("");
			else if (typeof date == "string")
				this.dom.val(date.replace(" ", "T"));
			else
				this.dom.val(this.convertDate(date));
		}



		public getValueDate():Date
		{
			var dateVal = this.dom.val().replace("T", " ");
			if (this.showTime && this.showDate)
				return kr3m.util.Dates.getDateFromDateTimeString(dateVal);

			if (this.showDate)
				return kr3m.util.Dates.getDateFromDateString(dateVal);

			var date = new Date();
			var matches = dateVal.match(/(\d\d)\:(\d\d)\:(\d\d)(\.(\d\d\d))?/);
			if (!matches)
				return undefined;

			date.setHours(
				parseInt(matches[1], 10),
				parseInt(matches[2], 10),
				parseInt(matches[3], 10),
				parseInt(matches[5] || "0", 10));
			return date;
		}



		public getValueString():string
		{
			var date = this.getValueDate();
			return date ? this.convertDate(date) : "";
		}
	}
}

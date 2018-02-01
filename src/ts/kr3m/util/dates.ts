/// <reference path="../util/regex.ts"/>
/// <reference path="../util/stringex.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.util
{
	/*
		Klasse für verschiedene zeit- und datumsbezogene
		Funktionen, insbesondere solche für MySQL Daten
		und Zeitstempel. Im Normalfall sollen Zeiten auf
		dem Server immer für die UTC Zeitzone angegeben
		werden, im Client nicht - das kommt alles aber
		stark auf den Verwendungszweck an.
	*/
	export class Dates
	{
		public static USE_UTC = false;



		/*
			Gibt das Datum von date als String in der
			Form "YYYY-MM-DD" zurück.
		*/
		public static getDateString(
			date:Date,
			useUTC:boolean = Dates.USE_UTC):string
		{
			if (useUTC)
			{
				var result:string = date.getUTCFullYear() + "-";
				var month:number = date.getUTCMonth() + 1;
				result += ((month < 10) ? "0" + month : "" + month);
				var day:number = date.getUTCDate();
				result += "-" + ((day < 10) ? "0" + day : "" + day);
				return result;
			}
			else
			{
				var result:string = date.getFullYear() + "-";
				var month:number = date.getMonth() + 1;
				result += ((month < 10) ? "0" + month : "" + month);
				var day:number = date.getDate();
				result += "-" + ((day < 10) ? "0" + day : "" + day);
				return result;
			}
		}



		/*
			Gibt die Uhrzeit von date als String in der
			Form "HH:MM:SS" zurück. Ist useUTC true, wird
			außerdem noch ein Z (für Zulu-Time) angehängt.
			Wird addMilliseconds auf true gesetzt, wird
			die Uhrzeit in der Form "HH:MM:SS.mmm" zurückgegeben.
		*/
		public static getTimeString(
			date:Date,
			useUTC:boolean = Dates.USE_UTC,
			addMilliseconds:boolean = false):string
		{
			if (useUTC)
			{
				var result = "";
				var hours = date.getUTCHours();
				result += ((hours < 10) ? "0" + hours : "" + hours);
				var minutes = date.getUTCMinutes();
				result += ":" + ((minutes < 10) ? "0" + minutes : "" + minutes);
				var seconds = date.getUTCSeconds();
				result += ":" + ((seconds < 10) ? "0" + seconds : "" + seconds);
				if (addMilliseconds)
				{
					var millis = date.getUTCMilliseconds();
					result += "." + ((millis < 10) ? "00" + millis : (millis < 100) ? "0" + millis : "" + millis);
				}
				return result + "Z";
			}
			else
			{
				var result = "";
				var hours = date.getHours();
				result += ((hours < 10) ? "0" + hours : "" + hours);
				var minutes = date.getMinutes();
				result += ":" + ((minutes < 10) ? "0" + minutes : "" + minutes);
				var seconds = date.getSeconds();
				result += ":" + ((seconds < 10) ? "0" + seconds : "" + seconds);
				if (addMilliseconds)
				{
					var millis = date.getMilliseconds();
					result += "." + ((millis < 10) ? "00" + millis : (millis < 100) ? "0" + millis : "" + millis);
				}
				return result;
			}
		}



		/*
			Prinzipiell das gleiche wie new Date(value) aber
			mit dem kleinen Unterschied, dass null zurück gegeben
			wird falls value kein gültiger Datumsstring der
			Form "YYYY-MM-DD hh:mm:ss(.iii)(Z)" oder
			"YYYY-MM-DDThh:mm(:ss(.iii))(+OO:oo)" ist. Außerdem
			funktioniert es im Internet Explorer und berücksichtigt
			UTC Zeiten wenn ein (Z) am Ende hängt.
		*/
		public static getDateFromDateTimeString(
			value:string):Date
		{
			if (!value || typeof value != "string")
				return null;

			var matches = StringEx.captureNamed(value, kr3m.REGEX_TIMESTAMP, kr3m.REGEX_TIMESTAMP_GROUPS);
			if (!matches)
				return null;

			matches.seconds = matches.seconds || "0";
			matches.milliseconds = matches.milliseconds || "0";

			var date = new Date();
			if (matches.timezone == "Z")
			{
				date.setUTCFullYear(
					parseInt(matches.year, 10),
					parseInt(matches.month, 10) - 1,
					parseInt(matches.day, 10));
				date.setUTCHours(
					parseInt(matches.hours, 10),
					parseInt(matches.minutes, 10),
					parseInt(matches.seconds, 10),
					parseInt(matches.milliseconds, 10));
			}
			else if (matches.timezone && matches.timezone.length == 6)
			{
				var hourOffset = parseInt(matches.timezone.slice(1, 3), 10);
				var minuteOffset = parseInt(matches.timezone.slice(4, 5), 10);
				if (matches.timezone.charAt(0) == "-")
				{
					hourOffset *= -1;
					minuteOffset *= -1;
				}
				date.setUTCFullYear(
					parseInt(matches.year, 10),
					parseInt(matches.month, 10) - 1,
					parseInt(matches.day, 10));
				date.setUTCHours(
					parseInt(matches.hours, 10) - hourOffset,
					parseInt(matches.minutes, 10) - minuteOffset,
					parseInt(matches.seconds, 10),
					parseInt(matches.milliseconds, 10));
			}
			else
			{
				date.setFullYear(
					parseInt(matches.year, 10),
					parseInt(matches.month, 10) - 1,
					parseInt(matches.day, 10));
				date.setHours(
					parseInt(matches.hours, 10),
					parseInt(matches.minutes, 10),
					parseInt(matches.seconds, 10),
					parseInt(matches.milliseconds, 10));
			}
			return date;
		}



		/*
			Basically the same thing as new Date(value) but with
			a few small (but convenient) changes:
			- returns null if value is not a valid date string  instead of throwing an exception
			- works on Internet Explorer
			- returns consistend result across browsers and treats value as a local date instead of a UTC date as some browsers do
		*/
		public static getDateFromDateString(value:string):Date
		{
			if (!value || typeof value != "string")
				return null;

			var matches = value.match(/^(\d\d\d\d)\-(\d\d)\-(\d\d)$/);
			if (!matches)
				return null;

			var date = new Date();
			date.setFullYear(
				parseInt(matches[1], 10),
				parseInt(matches[2], 10) - 1,
				parseInt(matches[3], 10));
			date.setHours(0, 0, 0, 0);
			return date;
		}



		/*
			Gibt date als String in der Form
			"YYYY-MM-DD HH:MM:SS" zurück. Ist useUTC true,
			wird außerdem noch ein Z (für Zulu-Time) angehängt.
		*/
		public static getDateTimeString(
			date:Date,
			useUTC:boolean = Dates.USE_UTC,
			addMilliseconds:boolean = false):string
		{
			return this.getDateString(date, useUTC) + " " + this.getTimeString(date, useUTC, addMilliseconds);
		}



		public static getToday(
			useUTC:boolean = Dates.USE_UTC):string
		{
			return this.getDateString(new Date(), useUTC);
		}



		public static getYesterday(
			useUTC:boolean = Dates.USE_UTC):string
		{
			var date:Date = new Date();
			date.setUTCDate(date.getUTCDate() - 1);
			return this.getDateString(date, useUTC);
		}



		public static getTomorrow(
			useUTC:boolean = Dates.USE_UTC):string
		{
			var date:Date = new Date();
			date.setUTCDate(date.getUTCDate() + 1);
			return this.getDateString(date, useUTC);
		}



		public static getNow(
			useUTC:boolean = Dates.USE_UTC):string
		{
			return this.getDateTimeString(new Date(), useUTC);
		}



		public static areSameDay(a:Date, b:Date):boolean
		{
			if (a.getUTCFullYear() != b.getUTCFullYear())
				return false;

			if (a.getUTCMonth() != b.getUTCMonth())
				return false;

			if (a.getUTCDate() != b.getUTCDate())
				return false;

			return true;
		}



		/*
			Gibt ein Datum zurück, welches von date aus gesehen
			count Tage in der Vergangenheit liegt.
		*/
		public static getSomeDaysAgo(
			date:Date, count:number):Date
		{
			var newDate = new Date(date.getTime());
			newDate.setUTCDate(newDate.getUTCDate() - count);
			return newDate;
		}



		/*
			Gibt ein Datum zurück, welches von date aus gesehen
			count Monate in der Vergangenheit liegt.
		*/
		public static getSomeMonthsAgo(
			date:Date, count:number):Date
		{
			var newDate = new Date(date.getTime());
			newDate.setUTCMonth(newDate.getUTCMonth() - count);
			return newDate;
		}



		/*
			Berechnet, wie viele (volle) Jahre seit birthday
			vergangen sind.
		*/
		public static getAgeInYears(
			birthday:Date):number
		{
			if (!birthday)
				return -1;

			var now = new Date();
			var years = now.getFullYear() - birthday.getFullYear();
			var months = now.getMonth() - birthday.getMonth();
			var days = now.getDate() - birthday.getDate();
			var age = years;
			if ((months < 0) || (months == 0 && days < 0))
				--age;
			return age;
		}



		/*
			Das gleiche wie Math.max aber für Date-Objekte
			statt für Nummern.
		*/
		public static max(...dates:Date[]):Date
		{
			if (dates.length == 0)
				return null;

			var result = dates[0];
			for (var i = 1; i < dates.length; ++i)
				if (dates[i] > result)
					result = dates[i];
			return result;
		}



		/*
			Das gleiche wie Math.min aber für Date-Objekte
			statt für Nummern.
		*/
		public static min(...dates:Date[]):Date
		{
			if (dates.length == 0)
				return null;

			var result = dates[0];
			for (var i = 1; i < dates.length; ++i)
				if (dates[i] < result)
					result = dates[i];
			return result;
		}



		/*
			Gibt zurück, in welcher Kalenderwoche das gegebene
			Datum liegt. Vorsicht: die Kalenderwoche kann sich
			auf das vergangene Jahr beziehen wenn es um die erste
			Januarwoche geht. Siehe auch getCalendarWeekYear.
		*/
		public static getCalendarWeek(
			date:Date = new Date(), useUTC:boolean = Dates.USE_UTC):number
		{
			if (useUTC)
			{
				var currentThursday = new Date(date.getTime() + (3 - ((date.getUTCDay() + 6) % 7)) * 86400000);
				var yearOfThursday = currentThursday.getUTCFullYear();
				var offset = new Date(0);
				offset.setUTCFullYear(yearOfThursday, 0, 4);
				var firstThursday = new Date(offset.getTime() +(3 - ((offset.getUTCDay() + 6) % 7)) * 86400000);
				var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
				return weekNumber;
			}
			else
			{
				var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
				var yearOfThursday = currentThursday.getFullYear();
				var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() +(3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
				var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
				return weekNumber;
			}
		}



		/*
			Gibt zurück, zu welchem Jahr die Kalenderwoche gehört,
			in dem date liegt. Siehe auch getCalendarWeek.
		*/
		public static getCalendarWeekYear(
			date:Date = new Date(), useUTC:boolean = Dates.USE_UTC):number
		{
			var year = useUTC ? date.getUTCFullYear() : date.getFullYear();
			var week = Dates.getCalendarWeek(date, useUTC);
			if (week < 52)
				return year;

			return date.getMonth() > 6 ? year : year - 1;
		}



		public static getFirstOfWeek(
			date:Date = new Date(), useUTC:boolean = Dates.USE_UTC):Date
		{
			var result = new Date(date.getTime());
			if (useUTC)
			{
				result.setUTCDate(result.getUTCDate() - (result.getUTCDay() + 6) % 7);
				result.setUTCHours(0, 0, 0, 0);
			}
			else
			{
				result.setDate(result.getDate() - (result.getDay() + 6) % 7);
				result.setHours(0, 0, 0, 0);
			}
			return result;
		}



		public static getFirstOfMonth(
			date:Date,
			useUTC:boolean = Dates.USE_UTC):Date
		{
			var result = new Date(date.getTime());
			if (useUTC)
			{
				result.setUTCDate(1);
				result.setUTCHours(0, 0, 0, 0);
			}
			else
			{
				result.setDate(1);
				result.setHours(0, 0, 0, 0);
			}
			return result;
		}



		public static getLastOfMonth(
			date:Date,
			useUTC:boolean = Dates.USE_UTC):Date
		{
			var result = new Date(date.getTime());
			if (useUTC)
			{
				result.setUTCDate(1);
				result.setUTCMonth(result.getUTCMonth() + 1);
				result.setUTCDate(0);
				result.setUTCHours(0, 0, 0, 0);
			}
			else
			{
				result.setDate(1);
				result.setMonth(result.getMonth() + 1);
				result.setDate(0);
				result.setHours(0, 0, 0, 0);
			}
			return result;
		}



		/*
			Gibt true zurück wenn Datum a und Datum b nicht mehr als
			threshold ms auseinander liegen.
		*/
		public static areClose(a:Date, b:Date, threshold:number = 1000):boolean
		{
			if (!a || !b)
				return false;

			return Math.abs(a.getTime() - b.getTime()) <= threshold;
		}



		/*
			Gibt zurück wie viele Tage der aktuelle Monat von date
			hat.
		*/
		public static getMonthDays(date:Date = new Date()):number
		{
			var temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			return temp.getDate();
		}



		/*
			Gibt ein Datum zurück, das den gegebenen Zeitraum in
			der Zukunft liegt - oder in der Vergangenheit, bei Monaten.
			Es werden die normalen getter / setter des Date-Objektes
			verwendet um entsprechende Zeiträume zu bestimmen.

			Mit dem Wert isCapped kann man steuern, ob es am Ende von
			Monaten zu "Überläufen" in den nächsten Monat kommen kann,
			wenn die Rechnung zu einem ungültigen Datumswert kommen
			würde. Ist isCapped = false, dann werden bei einem "Überlauf"
			entsprechend viele Tage des nächsten Monats mitberücksichtigt.
			Z.B. wäre 31.01.2014 + 1 Monat = 03.03.2014 (weil es keinen
			31.02. gibt). Das ist das Standardverhalten von
			JavaScript-Date-Objekten. Ist statt dessen isCapped = true,
			dann verhält sich delta wie es MySQL tut und 31.01.2014 + 1
			Monat = 28.02.2014. true ist die Standardeinstellung.
		*/
		public static delta(
			date:Date,
			years = 0,
			months = 0,
			days = 0,
			hours = 0,
			minutes = 0,
			seconds = 0,
			milliSeconds = 0,
			isCapped = true):Date
		{
			var result = new Date(date.getTime());
			result.setUTCFullYear(result.getUTCFullYear() + years);
			if (isCapped)
			{
				var oldMonth = result.getUTCMonth();
				result.setUTCMonth(oldMonth + months);
				var newMonth = result.getUTCMonth();
				if ((oldMonth + months) % 12 != newMonth)
					result.setUTCDate(0);
			}
			else
			{
				result.setUTCMonth(result.getUTCMonth() + months);
			}
			result.setUTCDate(result.getUTCDate() + days);
			result.setUTCHours(result.getUTCHours() + hours);
			result.setUTCMinutes(result.getUTCMinutes() + minutes);
			result.setUTCSeconds(result.getUTCSeconds() + seconds);
			result.setUTCMilliseconds(result.getUTCMilliseconds() + milliSeconds);
			return result;
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var xmas = new Date(2016, 11, 24, 12, 0, 0);
	var offset = xmas.getHours() - xmas.getUTCHours();
	var D = kr3m.util.Dates;
	new kr3m.unittests.Suite("kr3m.util.Dates")
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString I", () => D.getDateFromDateTimeString("Hamster"), null))
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString II", () => D.getDateFromDateTimeString("2016-12-24 12:34:56"), new Date(2016, 11, 24, 12, 34, 56)))
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString III", () => D.getDateFromDateTimeString("2016-12-24 12:34:56Z"), new Date(2016, 11, 24, 12 + offset, 34, 56)))
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString IV", () => D.getDateFromDateTimeString("2016-12-24 12:34:56+02:00"), new Date(2016, 11, 24, 10 + offset, 34, 56)))
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString V", () => D.getDateFromDateTimeString("2016-12-24 12:34:56-02:00"), new Date(2016, 11, 24, 14 + offset, 34, 56)))
	.add(new kr3m.unittests.CaseSync("getDateFromDateTimeString VI", () => D.getDateFromDateTimeString("2016-12-24 12:34"), new Date(2016, 11, 24, 12, 34)))
	.add(new kr3m.unittests.CaseSync("getDateTimeString I", () => D.getDateTimeString(xmas, false), "2016-12-24 12:00:00"))
	.add(new kr3m.unittests.CaseSync("getDateTimeString II", () => D.getDateTimeString(xmas, false, true), "2016-12-24 12:00:00.000"))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek I", () => D.getCalendarWeek(new Date(2017, 0, 1), false), 52))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek II", () => D.getCalendarWeek(new Date(2017, 0, 2), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek III", () => D.getCalendarWeek(new Date(2017, 0, 3), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek IV", () => D.getCalendarWeek(new Date(2017, 0, 4), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek V", () => D.getCalendarWeek(new Date(2017, 0, 5), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek VI", () => D.getCalendarWeek(new Date(2017, 0, 6), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek VII", () => D.getCalendarWeek(new Date(2017, 0, 7), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek VIII", () => D.getCalendarWeek(new Date(2017, 0, 8), false), 1))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek IX", () => D.getCalendarWeek(new Date(2017, 0, 9), false), 2))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek X", () => D.getCalendarWeek(new Date(2017, 0, 23), false), 4))
	.add(new kr3m.unittests.CaseSync("getCalendarWeek XI", () => D.getCalendarWeek(new Date(2017, 11, 31), false), 52))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear I", () => D.getCalendarWeekYear(new Date(2017, 0, 1), false), 2016))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear II", () => D.getCalendarWeekYear(new Date(2017, 0, 2), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear III", () => D.getCalendarWeekYear(new Date(2017, 0, 3), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear IV", () => D.getCalendarWeekYear(new Date(2017, 0, 4), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear V", () => D.getCalendarWeekYear(new Date(2017, 0, 5), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear VI", () => D.getCalendarWeekYear(new Date(2017, 0, 6), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear VII", () => D.getCalendarWeekYear(new Date(2017, 0, 7), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear VIII", () => D.getCalendarWeekYear(new Date(2017, 0, 8), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear IX", () => D.getCalendarWeekYear(new Date(2017, 0, 9), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear X", () => D.getCalendarWeekYear(new Date(2017, 0, 23), false), 2017))
	.add(new kr3m.unittests.CaseSync("getCalendarWeekYear XI", () => D.getCalendarWeekYear(new Date(2017, 11, 31), false), 2017))

	.run();
}, 1);
//# /UNITTESTS

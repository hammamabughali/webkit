/// <reference path="../../util/dates.ts"/>
/// <reference path="../../util/util.ts"/>



module kr3m.mulproc.cronjobs
{
	function getNextStartDate(parts:string[], after:Date):Date
	{
		var temp = new Date(after.getTime());
		temp.setSeconds(0, 0);
		temp.setMinutes(temp.getMinutes() + 1);
		var finished = false;

		var minutes = parseInt(parts[0], 10);
		var hours = parseInt(parts[1], 10);
		var day = parseInt(parts[2], 10);
		var month = parseInt(parts[3], 10) - 1;
		var weekDay = parseInt(parts[4], 10);
		var year = parseInt(parts[5], 10);

		while (!finished)
		{
			if (parts[0] != "*" && temp.getMinutes() != minutes)
			{
				if (temp.getMinutes() > minutes)
					temp.setHours(temp.getHours() + 1);
				temp.setMinutes(minutes);
			}
			if (parts[1] != "*" && temp.getHours() != hours)
			{
				if (temp.getHours() > hours)
				{
					temp.setHours(hours);
					temp.setDate(temp.getDate() + 1);
					temp.setMinutes(0);
					continue;
				}
				temp.setHours(hours, 0);
				continue;
			}
			if (parts[4] != "*" && temp.getDay() != weekDay)
			{
				var deltaDays = weekDay - temp.getDay();
				if (deltaDays < 0)
					deltaDays += 7;
				temp.setDate(temp.getDate() + deltaDays);
				temp.setHours(0, 0);
				continue;
			}
			if (parts[2] != "*" && temp.getDate() != day)
			{
				if (temp.getDate() > day || kr3m.util.Dates.getMonthDays(temp) < day)
				{
					temp.setMonth(temp.getMonth() + 1);
					temp.setDate(1);
					temp.setHours(0, 0);
					continue;
				}
				temp.setDate(day);
				temp.setHours(0, 0);
				continue;
			}
			if (parts[3] != "*" && temp.getMonth() != month)
			{
				if (temp.getMonth() > month)
				{
					temp.setMonth(12 - temp.getMonth() + month)
					temp.setDate(1);
					temp.setHours(0, 0);
					continue;
				}
				temp.setMonth(month);
				temp.setDate(1);
				temp.setHours(0, 0);
				continue;
			}
			if (parts[5] != "*" && temp.getFullYear() != year)
			{
				if (temp.getFullYear() > year)
					return undefined;

				temp.setMonth(month);
				temp.setDate(1);
				temp.setHours(0, 0);
			}
			finished = true;
		}
		return temp;
	}



	export function getNextStart(pattern:string, after?:Date):Date
	{
		function toValues(part:string):string[]
		{
			var values = part.split(",").map((m) => m.replace(/\?/g, "*"));
			for (var i = 0; i < values.length; ++i)
			{
				var rangeParts = values[i].split("-");
				if (rangeParts.length == 2)
				{
					var from = parseInt(rangeParts[0], 10);
					var to = parseInt(rangeParts[1], 10);
					var rangeValues = kr3m.util.Util.fill(to - from + 1, (j) => j + from).map((j) => j.toString());
					values.splice(i--, 1, ...rangeValues);
				}
			}
			return values;
		}

		var parts = pattern.split(/\s+/).map(toValues);
		if (parts.length < 6)
			parts.push(["*"]);

		after = after || new Date();
		var result:Date;
		var totalCount = parts.reduce((total, subParts) => total * subParts.length, 1);
		for (var i = 0; i < totalCount; ++i)
		{
			var offset = i;
			var params = ["", "", "", "", "", ""];
			for (var j = 0; j < params.length; ++j)
			{
				var myOffset = offset % parts[j].length;
				offset = Math.floor(offset / parts[j].length);
				params[j] = parts[j][myOffset];
			}
			var temp = getNextStartDate(params, after);
			if (temp && (!result || result > temp))
				result = temp;
		}
		return result;
	}
}

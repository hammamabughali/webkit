/// <reference path="../util/dates.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.util
{
	/*
		Slightly extended JSON codec class. In most cases
		it behaves just like the normal JSON-class in
		javascript. The main difference is that it restores
		Date objects from JSON-code and offers several
		convenience functions.
	*/
	export class Json
	{
		/*
			Checks whether obj is part of a cyclical graph / has
			(sub-)properties referencing higher-level properties.
			If not, it just returns obj. If yes, it returns a clone
			of obj where those proplematic sub-properties are
			replaced by the string "[CYCLICAL]".
		*/
		public static breakCircular(obj:any):any
		{
			if (!obj || typeof obj != "object" || obj instanceof Date)
				return obj;

			var found:any[] = [];
			var broken:any[] = [];
			var workset1:any[] = [obj];
			while (workset1.length > 0)
			{
				let current = workset1.shift();
				found.push(current);
				for (let key in current)
				{
					if (typeof current[key] != "object" || current[key] instanceof Date)
						continue;

					if (found.indexOf(current[key]) >= 0)
						broken.push(current[key]);
					else
						workset1.push(current[key]);
				}
			}

			if (broken.length == 0)
				return obj;

			var clone:any = typeof obj["length"] == "number" ? [] : {};
			var workset2:{prefix:string, value:any}[] = [{prefix : "", value : obj}];
			while (workset2.length > 0)
			{
				let current = workset2.shift();
				for (let key in current.value)
				{
					if (broken.indexOf(current.value[key]) >= 0)
					{
						Util.setProperty(clone, current.prefix + key, "[CYCLICAL]");
						continue;
					}

					if (typeof current.value[key] != "object" || current.value[key] instanceof Date)
						Util.setProperty(clone, current.prefix + key, current.value[key]);
					else
						workset2.push({value : current.value[key], prefix : current.prefix + key + "."});
				}
			}
			return clone;
		}



		/*
			Basically the same thing as JSON.stringify(). It can
			be given an optional breakCircular parameter. If that
			is set to true, Json.breakCircular will first be
			called on the input obj before it is stringified.
		*/
		public static encode(obj:any, breakCircular = false):string
		{
			if (breakCircular)
				obj = Json.breakCircular(obj);
			return JSON.stringify(obj);
		}



		/*
			Basically the same thing as encode, but returns a JSON-string
			that is easier to read for humans. Line-breaks and indentation
			are used to achieve that goal. The result is still valid JSON.
			This method is slower than encode and the result is slightly
			larger.
		*/
		public static encodeNice(obj:any, padding = "", breakCircular = false):string
		{
			if (breakCircular)
				obj = Json.breakCircular(obj);

			if (typeof obj == "object" && !(obj instanceof Date))
			{
				var json = "";
				if (typeof obj.length == "number")
				{
					if (obj.length === 0)
						return padding + "[]";

					json += padding + "[";
					for (var i = 0; i < obj.length; ++i)
						json += "\n" + Json.encodeNice(obj[i], padding + "\t") + ",";

					if (obj.length > 0)
						json = json.slice(0, -1);

					json += "\n" + padding + "]";
				}
				else
				{
					json += padding + "{";
					for (var ind in obj)
					{
						if (typeof obj[ind] == "object" && !(obj instanceof Date))
							json += "\n\t" + padding + "\"" + ind + "\":\n" + Json.encodeNice(obj[ind], padding + "\t") + ",";
						else
							json += "\n\t" + padding + "\"" + ind + "\":" + Json.encode(obj[ind]) + ",";
					}
					if (json.slice(-1) == ",")
						json = json.slice(0, -1);
					json += "\n" + padding + "}";
				}
				return json;
			}
			else
			{
				return padding + Json.encode(obj);
			}
		}



		/*
			Replaces all special character in the given json
			string with their escaped counterparts. This isn't
			required in most cases but can make a difference in
			some edge cases when many special chars or file formats
			are involved.
		*/
		public static escapeSpecialChars(json:string):string
		{
			return json.replace(/[\u0080-\uffff]/g, char => "\\u" + ("0000" + char.charCodeAt(0).toString(16)).slice(-4));
		}



		private static reviver(key:string, computed:any):any
		{
			if (typeof computed == "string")
			{
				var date = kr3m.util.Dates.getDateFromDateTimeString(computed)
				if (date)
					return date;
			}
			return computed;
		}



		public static isJSON(text:string):boolean
		{
			if (!text)
				return false;

			try
			{
				JSON.parse(text);
				return true;
			}
			catch(e)
			{
				return false;
			}
		}



		/*
			Basically the same thing as JSON.parse(). The two most
			important differences are that decode returns Date objects
			for properties that match stringified Date objects and
			that no exception is thrown for invalid json code - null
			is returned instead.
		*/
		public static decode(json:string):any
		{
			if (!json)
				return null;

			try
			{
				return JSON.parse(json, Json.reviver);
			}
			catch(e)
			{
//# DEBUG
				console.error(json);
				console.error(e);
//# /DEBUG
				return null;
			}
		}



		/*
			Combines several JSON-strings into a single one. Each given JSON-string
			is decoded, then all of them are merged using kr3m.util.Util.mergeAssoc.
			The result is once again encoded and returned as result.
		*/
		public static mergeAssoc(...jsons:string[]):string
		{
			var objs = jsons.map(j => Json.decode(j));
			var result = Util.mergeAssoc(...objs);
			return Json.encode(result);
		}
	}
}

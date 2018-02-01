/// <reference path="../constants.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/dates.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>



//# DEPRECATED: kr3m.util.CsvHelper is deprecated. Please use kr3m.csv.Parser and kr3m.csv.Generator instead.
module kr3m.util
{
	export class CsvHelper
	{
		public static QUOTE = "\"";
		public static SEPERATOR = ";";



		private static parseRaw(text:string):any[][]
		{
			var raw:any[][] = [[]];

			var inQuotes = false;
			var inValue = false;
			var rawValue:string = "";

			var q = CsvHelper.QUOTE;
			var s = CsvHelper.SEPERATOR;

			var emit = () =>
			{
				raw[raw.length - 1].push(rawValue);
				inQuotes = false;
				inValue = false;
				rawValue = "";
			}

			for (var i = 0; i < text.length; ++i)
			{
				var t = text.charAt(i);
				switch (t)
				{
					case "\\":
						if (inQuotes && text.charAt(i + 1) == q)
						{
							rawValue += q;
							++i;
						}
						break;

					case q:
						if (inQuotes)
						{
							if (text.charAt(i + 1) == q)
							{
								rawValue += q;
								++i;
							}
							else
							{
								emit();
								inQuotes = false;
							}
						}
						else if (!inValue)
						{
							rawValue = "";
							inQuotes = true;
						}
						else
						{
							rawValue += t;
						}
						break;

					case s:
						if (inQuotes)
							rawValue += t;
						else if (text.charAt(i - 1) != q)
							emit();
						break;

					case "\n":
						if (inQuotes)
							rawValue += t;
						else if (inValue)
						{
							emit();
							raw.push([]);
						}
						else
							raw.push([]);
						break;

					default:
						rawValue += t;
						inValue = true;
						break;
				}
			}

			if (raw.length == 1 && raw[0].length == 0)
				return [];

			for (var i = 0; i < raw.length; ++i)
			{
				if (raw[i].length == 0)
					raw.splice(i--, 1);
			}

			return raw;
		}



		private static parseText(
			text:string,
			readHeaders:boolean,
			keyMapping:any):any[]
		{
			var self = CsvHelper;
			text = StringEx.stripBom(text).replace(/\r/g, "");
			var rawData = self.parseRaw(text);
			if (rawData.length == 0)
				return [];

			var data:any[] = [];
			if (readHeaders)
			{
				if (rawData.length < 2)
					return [];

				var headers:any = {};
				for (var i = 0; i < rawData[0].length; ++i)
					headers[rawData[0][i]] = i;

				if (!keyMapping)
				{
					keyMapping = {};
					for (var h in headers)
						keyMapping[h] = h;
				}

				for (var i = 1; i < rawData.length; ++i)
				{
					var row:any = {};
					for (var h in keyMapping)
						row[h] = rawData[i][headers[h]];
					data.push(row);
				}
			}
			else
			{
				if (keyMapping)
				{
					for (var i = 0; i < rawData.length; ++i)
					{
						var row:any = {};
						for (var j = 0; j < keyMapping.length; ++j)
							row[keyMapping[j]] = rawData[i][j];
						data.push(row);
					}
				}
				else
				{
					data = rawData;
				}
			}
			return data;
		}



		public static loadFromFile(
			filePath:string,
			callback:(data:any[]) => void,
			readHeaders:boolean = true,
			keyMapping?:any):void
		{
			fsLib.readFile(filePath, {encoding:"utf8"}, (error:Error, content:string) =>
			{
				var data = CsvHelper.parseText(content, readHeaders, keyMapping);
				callback(data);
			});
		}



		public static loadFromFileSync(
			filePath:string,
			readHeaders:boolean = true,
			keyMapping?:any):any[]
		{
			var content:string = fsLib.readFileSync(filePath, {encoding:"utf8"});
			var data = CsvHelper.parseText(content, readHeaders, keyMapping);
			return data;
		}



		private static getKeys(data:any[], keyMapping?:any):any
		{
			var keys:any = {};
			if (keyMapping)
			{
				keys = keyMapping;
			}
			else
			{
				for (var i = 0; i < data.length; ++i)
				{
					for (var j in data[i])
					{
						if (typeof data[i][j] != "function")
							keys[j] = j;
					}
				}
			}
			return keys;
		}



		private static buildHeaders(keys:any):string
		{
			return '"' + StringEx.joinValues(keys, '";"') + '"\n';
		}



		private static buildData(data:any[], keys:any, formatters:any):string
		{
			formatters = formatters || {};
			var text = "";
			for (var i = 0; i < data.length; ++i)
			{
				var values:string[] = [];
				for (var j in keys)
				{
					var value = Util.getProperty(data[i], j);
					var formatter = formatters[j];
					if (formatter)
						values.push(formatter(value, data[i]));
					else if (value === undefined || value === null)
						values.push("");
					else if (value instanceof Date)
						values.push(Dates.getDateTimeString(value));
					else
						values.push(value.toString().replace(/\"/g, '""'));
				}
				text += '"' + values.join('";"') + '"\n';
			}
			return text;
		}



		public static buildSaveText(
			data:any[],
			writeHeaders:boolean,
			keyMapping?:any,
			formatters?:any):string
		{
			var keys = CsvHelper.getKeys(data, keyMapping);
			var text = StringEx.BOM;
			if (writeHeaders)
				text += CsvHelper.buildHeaders(keys);
			text += CsvHelper.buildData(data, keys, formatters);
			return text;
		}



		public static saveToFile(
			data:any[], filePath:string,
			callback:() => void,
			writeHeaders:boolean = true, keyMapping?:any, formatters?:any):void
		{
			var text = CsvHelper.buildSaveText(data, writeHeaders, keyMapping, formatters);
			fsLib.writeFile(filePath, text, callback);
		}



		public static appendToFile(
			data:any[], filePath:string,
			callback:() => void,
			keyMapping?:any, formatters?:any):void
		{
			var keys = CsvHelper.getKeys(data, keyMapping);
			var text = CsvHelper.buildData(data, keys, formatters);
			fsLib.appendFile(filePath, text, callback);
		}



		public static saveToFileSync(
			data:any[],
			filePath:string,
			writeHeaders:boolean = true,
			keyMapping?:any,
			formatters?:any):void
		{
			var text = CsvHelper.buildSaveText(data, writeHeaders, keyMapping, formatters);
			fsLib.writeFileSync(filePath, text);
		}
	}
}

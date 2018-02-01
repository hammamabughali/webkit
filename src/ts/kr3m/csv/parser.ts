/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>

//# !CLIENT
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/stringex.ts"/>
//# /!CLIENT



module kr3m.csv
{
	export class Parser
	{
		protected i:number;
		protected knownNewLine:number;
		protected rawCsv:string;

		public readKeys = true;
		public seperator = ";";
		public quotation = "\"";



		protected eat():string
		{
			return this.rawCsv.charAt(this.i++);
		}



		private skipSeperator():void
		{
			if (this.rawCsv.charAt(this.i) == this.seperator)
				++this.i;
		}



		private unescape(text:string):string
		{
			var token = this.quotation + this.quotation;
			var pos = -1;
			while ((pos = text.indexOf(token, pos + 1)) >= 0)
				text = text.slice(0, pos) + text.slice(pos + 1);
			return text;
		}



		private readRawValue():string
		{
			var inQuotes = false;
			var t:string;
			var start = this.i;
			while (t = this.eat())
			{
				if (t == this.quotation)
				{
					if (inQuotes)
					{
						if (this.rawCsv.charAt(this.i) != this.quotation)
						{
							var end = this.i - 1;
							this.skipSeperator();
							this.knownNewLine = this.i;
							return this.rawCsv.slice(start, end);
						}
						else
						{
							++this.i;
						}
					}
					else
					{
						inQuotes = true;
						start = this.i;
					}
				}
				else if (t == this.seperator)
				{
					if (!inQuotes)
					{
						var end = this.i - 1;
						return this.rawCsv.slice(start, end);
					}
				}
				else if (t == "\r" || t == "\n")
				{
					if (!inQuotes)
					{
						--this.i;
						var unknown = this.knownNewLine != this.i;
						this.knownNewLine = this.i;
						return (start < this.i) ? this.rawCsv.slice(start, this.i) : unknown ? "" : undefined;
					}
				}
				else if (!t)
				{
					return (start < this.i) ? this.rawCsv.slice(start, this.i - 1) : undefined;
				}
			}
			return (start < this.i - 1) ? this.rawCsv.slice(start, this.i - 1) : undefined;
		}



		private skipNewline():void
		{
			while (this.rawCsv.charAt(this.i) == "\r" || this.rawCsv.charAt(this.i) == "\n")
				++this.i;
		}



		private readLine():string[]
		{
			this.skipNewline();
			var line:string[] = [];
			var value:string;
			while ((value = this.readRawValue()) !== undefined)
				line.push(this.unescape(value));
			return line;
		}



		public parse(rawCsv:string):any[]
		{
			//# TODO: replace his hack for handling trailing empty strings with a proper parser fix
			this.rawCsv = rawCsv.replace(new RegExp("(" + this.seperator + ")(\\r\\n)", "g"), "$1" + this.quotation + this.quotation + "$2");
			this.i = 0;
			this.knownNewLine = -1;
			var result:any[] = [];
			var line:string[];
			if (this.readKeys)
			{
				var keys = this.readLine();
				while ((line = this.readLine()).length)
				{
					if (line.length != keys.length)
					{
						logError(keys);
						logError(line);
						throw new Error("syntax error in csv string: value count doesn't match key count");
					}

					var obj:any = {};
					for (var i = 0; i < keys.length; ++i)
						kr3m.util.Util.setProperty(obj, keys[i], line[i]);

					result.push(obj);
				}
			}
			else
			{
				while ((line = this.readLine()).length)
					result.push(line);
			}
			return result;
		}
	}



	export function parseString(rawCsv:string):any
	{
		var parser = new kr3m.csv.Parser();
		return parser.parse(rawCsv);
	}



//# !CLIENT
	export function parseLocalFile(
		path:string,
		callback:(content:any[]) => void,
		errorCallback?:Callback):void
	{
		fsLib.readFile(path, {encoding : "utf8"}, (err:Error, rawCsv:string) =>
		{
			if (err)
			{
				if (errorCallback)
					return errorCallback();

				logError(err);
				return callback(undefined);
			}

			var parser = new kr3m.csv.Parser();
			rawCsv = kr3m.util.StringEx.stripBom(rawCsv);
			callback(parser.parse(rawCsv));
		});
	}
//# /!CLIENT
}

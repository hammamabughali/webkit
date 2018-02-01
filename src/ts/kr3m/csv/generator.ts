/// <reference path="../types.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>

//# !CLIENT
/// <reference path="../util/file.ts"/>
//# /!CLIENT



module kr3m.csv
{
	export class Generator
	{
		public seperator = ";";
		public quotation = "\"";
		public newLine = "\n";
		public writeHeaders = true;
		public quoteAll = false;
		public hiddenColumns:string[] = [];

		private json:any[];
		private keys:string[];



		private collectKeys():void
		{
			this.keys = [];
			for (var i = 0; i < this.json.length; ++i)
				this.keys = kr3m.util.Util.merge(this.keys, Object.keys(this.json[i]));
			this.keys = kr3m.util.Util.difference(this.keys, this.hiddenColumns);
		}



		private escape(value:any):string
		{
			var text = (value !== undefined && value !== null) ? value.toString() : "";
			var quote = this.quoteAll
				|| text.indexOf(this.seperator) >= 0
				|| text.indexOf(this.quotation) >= 0
				|| text.indexOf(this.newLine) >= 0;
			if (quote)
			{
				var reg = new RegExp(this.quotation, "g");
				text = text.replace(reg, this.quotation + this.quotation);
				text = this.quotation + text + this.quotation;
			}
			return text;
		}



		public generate(json:any[]):string
		{
			this.json = json;

			var csv = "";
			this.collectKeys();
			if (this.writeHeaders)
			{
				var parts:string[] = [];
				for (var j = 0; j < this.keys.length; ++j)
					parts.push(this.escape(this.keys[j]));
				csv += parts.join(this.seperator) + this.newLine;
			}
			for (var i = 0; i < json.length; ++i)
			{
				var parts:string[] = [];
				for (var j = 0; j < this.keys.length; ++j)
					parts.push(this.escape(json[i][this.keys[j]]));
				csv += parts.join(this.seperator) + this.newLine;
			}
			return csv;
		}
	}



	export function generateString(json:any[], options?:{hiddenColumns:string[]}):string
	{
		var generator = new Generator();
		if (options)
		{
			generator.hiddenColumns = options.hiddenColumns || generator.hiddenColumns;
		}
		return generator.generate(json);
	}



//# !CLIENT
	export function generateLocalFile(
		path:string,
		json:any[],
		callback:SuccessCallback):void
	{
		var encoded = kr3m.util.StringEx.BOM + generateString(json);
		kr3m.util.File.createFileFolder(path, (success) =>
		{
			if (!success)
				return callback(false);

			fsLib.writeFile(path, encoded, {encoding : "utf8"}, (err:Error) =>
			{
				if (err)
					logError(err);

				callback(!err);
			});
		});
	}
//# /!CLIENT



//# !CLIENT
	export function appendToLocalFile(
		path:string,
		json:any[],
		callback:SuccessCallback):void
	{
		var generator = new Generator();
		generator.writeHeaders = false;
		var encoded = generator.generate(json);
		fsLib.appendFile(path, encoded, {encoding : "utf8"}, (err:Error) =>
		{
			if (err)
				logError(err);

			callback(!err);
		});
	}
//# /!CLIENT
}

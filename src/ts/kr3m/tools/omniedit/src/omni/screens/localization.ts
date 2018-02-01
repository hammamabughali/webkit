/// <reference path="../../../../../async/join.ts"/>
/// <reference path="../../../../../async/loop.ts"/>
/// <reference path="../../../../../csv/generator.ts"/>
/// <reference path="../../../../../csv/parser.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/abstractscreen.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/ui/button.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/widgets/podtable.ts"/>
/// <reference path="../../../../../util/json.ts"/>
/// <reference path="../../../../../xml/parser.ts"/>



module omni.screens
{
	export class Localization extends omni.AbstractScreen
	{
		private table:omni.widgets.PodTable;



		constructor(manager:kr3m.ui.ScreenManager)
		{
			super(manager, "localization");
			this.addClass("podTable");

			this.fileName = "localization";

			var buttons = new kr3m.ui.Element(this);
			this.table = new omni.widgets.PodTable(this);
			new omni.ui.Button(buttons, "NEW", () => this.table.setData([{id : "APP_TITLE", de : "Anwendungsname"}]));
			new omni.ui.Button(buttons, "ADD_LANGUAGE", () => this.table.addKey());
			new omni.ui.Button(buttons, "ADD_STRING", () => this.table.addEntry());
			new omni.ui.Button(buttons, "SAVE", () => this.save());
			this.onHotkey("s", () => this.save());
			this.table.setData([{id : "APP_TITLE", de : "Anwendungsname"}]);
		}



		private generateLuaContent(data:any[]):string
		{
			var lua = kr3m.util.StringEx.BOM;
			if (data.length == 0)
				return lua;

			for (var lang in data[0])
			{
				if (lang != "id")
				{
					var locale = lang.length > 2 ? lang : lang.toLowerCase() + lang.toUpperCase();
					lua += "if GetLocale() == \"" + locale + "\" then\n";
					for (var i = 0; i < data.length; ++i)
						lua += "\t" + data[i].id + " = \"" + data[i][lang] + "\"\n";
					lua += "end\n\n\n\n";
				}
			}

			return lua;
		}



		private save():void
		{
			this.clearDownloads();

			var data = this.table.getData();
			data.sort((a, b) => (a.id || "").toLowerCase().localeCompare((b.id || "").toLowerCase()));
			var byLang:any = {};
			for (var lang in data[0])
				byLang[lang] = kr3m.util.Util.gather(data, lang);

			var ids = byLang["id"] || [];
			var count = ids.length;
			for (var lang in byLang)
			{
				if (lang == "id")
					continue;

				var xml = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<texts>\n";
				for (var i = 0; i < count; ++i)
					xml += "\t<text id=\"" + ids[i] + "\"><![CDATA[" + byLang[lang][i] + "]]></text>\n";
				xml += "</texts>";

				this.addDownload("lang_" + lang + ".xml", xml, "text/xml;charset=utf-8");

				var json:{[id:string]:string} = {};
				for (var i = 0; i < count; ++i)
					json[ids[i]] = byLang[lang][i];

				this.addDownload("lang_" + lang + ".json", kr3m.util.Json.encodeNice(json), "text/json;charset=utf-8");
			}

			var csv = kr3m.util.StringEx.BOM + kr3m.csv.generateString(data);
			this.addDownload(this.fileName + ".csv", csv, "text/csv;charset=utf-8");

			var lua = this.generateLuaContent(data);
			this.addDownload(this.fileName + ".lua", lua, "text/lua;charset=utf-8");
		}



		private handleDroppedJson(
			fileName:string, content:string, changes:any[],
			callback:() => void):void
		{
			var pat = /^lang_(\w\w)\.json$/i;
			var matches = fileName.match(pat);
			if (!matches)
				return callback();

			var lang = matches ? matches[1] : "xx";

			var data = kr3m.util.Json.decode(content);
			if (!data)
				return callback();

			for (var id in data)
			{
				var change = kr3m.util.Util.getBy(changes, "id", id);
				if (!change)
				{
					change = {id : id};
					changes.push(change);
				}
				change[lang] = data[id];
			}
			callback();
		}



		private handleDroppedXml(
			fileName:string, content:string, changes:any[],
			callback:() => void):void
		{
			var pat = /^lang_(\w\w)\.xml$/i;
			var matches = fileName.match(pat);
			if (!matches)
				return callback();

			var lang = matches ? matches[1] : "xx";

			var texts = kr3m.xml.parseString(content);
			if (!texts || !texts.text)
				return callback();

			texts = texts.text;
			for (var i = 0; i < texts.length; ++i)
			{
				var id = texts[i]._attributes.id;
				var value = texts[i]._data;
				var change = kr3m.util.Util.getBy(changes, "id", id);
				if (!change)
				{
					change = {id : id};
					changes.push(change);
				}
				change[lang] = value;
			}
			callback();
		}



		private handleDroppedCsv(
			fileName:string, content:string, changes:any[],
			callback:() => void):void
		{
			var pat = /\.csv$/i;
			var matches = fileName.match(pat);
			if (!matches)
				return callback();

			var data = kr3m.csv.parseString(content);
			if (!data)
				return callback();

			for (var i = 0; i < data.length; ++i)
			{
				var id = data[i].id;
				var change = kr3m.util.Util.getBy(changes, "id", id);
				if (!change)
				{
					change = {id : id};
					changes.push(change);
				}
				for (var lang in data[i])
					change[lang] = data[i][lang];
			}
			callback();
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			var changes:any[] = [];
			kr3m.async.Loop.forEach(files, (file:kr3m.util.ClientFile, next:() => void) =>
			{
				file.getTextContent((content:string) =>
				{
					var join = new kr3m.async.Join();
					this.handleDroppedJson(file.name, content, changes, join.getCallback());
					this.handleDroppedXml(file.name, content, changes, join.getCallback());
					this.handleDroppedCsv(file.name, content, changes, join.getCallback());
					join.addCallback(next);
				});
			}, () =>
			{
				for (var i = 0; i < changes.length; ++i)
					this.table.upsert(changes[i]);
				this.table.sortBy("id");
				this.table.redraw();
			});
		}
	}
}

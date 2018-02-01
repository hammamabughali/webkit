/// <reference path="../../../../../csv/generator.ts"/>
/// <reference path="../../../../../csv/parser.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/abstractscreen.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/ui/button.ts"/>
/// <reference path="../../../../../tools/omniedit/src/omni/widgets/podtable.ts"/>
/// <reference path="../../../../../ui/ex/checkboxgroup.ts"/>
/// <reference path="../../../../../util/json.ts"/>
/// <reference path="../../../../../util/stringex.ts"/>
/// <reference path="../../../../../xml/generator.ts"/>
/// <reference path="../../../../../xml/parser.ts"/>



module omni.screens
{
	export class PodTable extends omni.AbstractScreen
	{
		private table:omni.widgets.PodTable;
		private tagsPopup:kr3m.ui.Element;

		private xmlRootName = "root";
		private xmlElementName = "item";



		constructor(manager:kr3m.ui.ScreenManager)
		{
			super(manager, "podTable");
			this.addClass("podTable");

			this.fileName = "data";

			this.tagsPopup = new kr3m.ui.Element(this);
			this.tagsPopup.addClass("tagsPopup");
			this.tagsPopup.hide();

			var buttons = new kr3m.ui.Element(this);
			this.table = new omni.widgets.PodTable(this);
			this.table.setData([{col0 : ""}]);
			new omni.ui.Button(buttons, "NEW", () => this.table.setData([{col0 : ""}]));
			new omni.ui.Button(buttons, "ADD_ROW", () => this.table.addEntry());
			new omni.ui.Button(buttons, "ADD_COL", () => this.table.addKey());
			new omni.ui.Button(buttons, "VISIBLE_COLUMNS", () => this.showHideColumnsPopup());
			this.onHotkey("r", () => this.showHideColumnsPopup());
			new omni.ui.Button(buttons, "DELETE_COLUMNS", () => this.showDeleteColumnsPopup());
			new omni.ui.Button(buttons, "SAVE", () => this.save());
			this.onHotkey("s", () => this.save());
		}



		private showHideColumnsPopup():void
		{
			this.tagsPopup.removeAllChildren();
			var columns = this.table.getKeys();
			var visible = this.table.getVisibleColumns();
			var selected:string[] = [];
			for (var i = 0; i < visible.length; ++i)
				selected.push(columns.indexOf(visible[i]).toString());
			var tags = new kr3m.ui.ex.CheckboxGroup(this.tagsPopup, columns);
			tags.select(selected);
			new omni.ui.CloseButton(this.tagsPopup, () =>
			{
				selected = tags.getSelectedValues();
				visible = [];
				for (var i = 0; i < selected.length; ++i)
					visible.push(columns[selected[i]]);
				this.table.setVisibleColumns(visible);
				this.closeAsPopup(this.tagsPopup);
			});
			this.showAsPopup(this.tagsPopup);
		}



		private showDeleteColumnsPopup():void
		{
			this.tagsPopup.removeAllChildren();
			var columns = this.table.getKeys();
			var tags = new kr3m.ui.ex.CheckboxGroup(this.tagsPopup, columns);
			new omni.ui.CloseButton(this.tagsPopup, () =>
			{
				var selected = tags.getSelectedValues();
				var deleted:string[] = [];
				for (var i = 0; i < selected.length; ++i)
					deleted.push(columns[selected[i]]);
				this.table.deleteColumns(deleted);
				this.closeAsPopup(this.tagsPopup);
			});
			this.showAsPopup(this.tagsPopup);
		}



		private save():void
		{
			this.clearDownloads();
			var data = this.table.getData(true);

			var json = kr3m.util.Json.encodeNice(data);
			this.addDownload(this.fileName + ".json", json, "text/json");

			var rootNode:any = {};
			rootNode._tag = this.xmlRootName;
			rootNode[this.xmlElementName] = data;
			var xml = kr3m.xml.generateString(rootNode);
			this.addDownload(this.fileName + ".xml", xml, "text/xml");

			var flatData = this.table.getData(false);
			var csv = kr3m.util.StringEx.BOM + kr3m.csv.generateString(flatData);
			this.addDownload(this.fileName + ".csv", csv, "text/csv;charset=utf-8");
		}



		public handleDroppedFiles(files:kr3m.util.ClientFile[]):void
		{
			var pat = /\.(xml|json|csv)$/i;
			kr3m.async.Loop.forEach(files, (file:kr3m.util.ClientFile, next:() => void) =>
			{
				var matches = file.name.match(pat);
				if (!matches)
					return next();

				var ext = matches ? matches[1] : "";
				if (ext != "xml" && ext != "json" && ext != "csv")
					return next();

				this.setFileName(file.name);
				file.getTextContent((content:string) =>
				{
					if (ext == "json")
					{
						var data = kr3m.util.Json.decode(content);
						if (data)
							this.table.setData(data);
					}
					else if (ext == "xml")
					{
						var data = kr3m.xml.parseString(content);
						if (data)
						{
							for (var i in data)
							{
								if (i.charAt(0) != "_" && typeof data[i].length == "number")
								{
									this.xmlRootName = data._tag;
									this.xmlElementName = i;
									this.table.setData(data[i]);
									return;
								}
							}
						}
					}
					else if (ext == "csv")
					{
						var data = kr3m.csv.parseString(content);
						if (data)
							this.table.setData(data);
					}
				});
			});
		}
	}
}

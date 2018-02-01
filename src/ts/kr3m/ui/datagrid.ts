/// <reference path="../async/loop.ts"/>
/// <reference path="../ui/table.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.ui
{
	/*
		Eine Tabelle mit erweiterten Funktionen zum Darstellen
		von größeren Datenmengen. Sie bietet unter Anderem:
		Sortierung, Filterung und automatische Formatierung
		der Werte in den Daten.
	*/
	export class DataGrid extends kr3m.ui.Table
	{
		private map:any = null;
		private data:any = null;
		private filterFunc:(dataItem:any) => boolean = null;
		private serviceFunc:(offset:number, limit:number, callback:(data:any[]) => void) => void = null;
		private redrawCallbacks:Array<(visibleItemCount:number) => void> = [];

		private currentSortField:string = null;
		private ascending:boolean = false;
		private visibleItemCount:number = 0;

		private renderHeader:boolean = true;
		private noDataMessage:string = null;



		constructor(parent, attributes:any = {})
		{
			super(parent, attributes);
			this.filterFunc = this.defaultFilterFunc;
		}



		public setNoDataMessage(message:string):void
		{
			this.noDataMessage = message;
			if (!this.hasData())
				this.redraw();
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.addClass("datagrid");
		}



		public showHeader(show:boolean):void
		{
			this.renderHeader = show;
			this.redraw();
		}



		public sortBy(field:string, ascending:boolean = true):void
		{
			this.currentSortField = field;
			this.ascending = ascending;
			this.redraw();
		}



		private onSortClicked(field:string):void
		{
			if (this.currentSortField == field)
			{
				this.ascending = !this.ascending;
			}
			else
			{
				this.currentSortField = field;
				this.ascending = true;
			}
			this.redraw();
		}



		/*
			Das hier ist die Standardformatierungsfunktion für
			Inhalte im Datagrid. Sie ist hier vor allem drin,
			damit man die Parameter sehen kann, die für
			Formatter benötigt werden. value ist der Wert, der
			formatiert werden soll, cell ist die Zelle, in die
			das formatierte Ergebnis eingetragen werden soll
			und item ist das Datenobjekt, das alle Attribute
			des aktuellen Datenobjektes enthält (u.A. auch den
			unter value übergebenen Wert).

			Wenn ein Formatter einen Wert zurück gibt, dann wird
			dieser als Inhalt der Zelle eingetragen. Alternativ
			können auch einfach neue kr3m.ui-Elemente erzeugt und
			an cell angehängt werden - in diesem Fall einfach kein
			Ergebnis zurückgeben.
		*/
		private defaultFormatter(value:any, cell:kr3m.ui.Cell, item:any):any
		{
			return value;
		}



		private redrawHeader():void
		{
			var header = new kr3m.ui.Element(this, null, "thead");
			var row = new kr3m.ui.Row(header, {"class" : "row0"});
			var x = 0;
			for (var i in this.map)
			{
				if (this.map[i].hidden)
					continue;

				var cell = new kr3m.ui.CellHeader(row, this.map[i].caption, {"class" : "row0 col" + (x++)});
				if (typeof this.map[i].canSort != "undefined" && this.map[i].canSort)
				{
					cell.addClass("sortable");
					cell.on("click", this.onSortClicked.bind(this, i));
					if (i == this.currentSortField)
					{
						if (this.ascending)
							cell.addClass("ascending");
						else
							cell.addClass("descending");
					}
				}
			}
		}



		private redrawContent():void
		{
			this.visibleItemCount = 0;
			var body = new kr3m.ui.Element(this, null, "tbody");
			for (var j = 0; j < this.data.length; ++j)
			{
				if (this.filterFunc(this.data[j]))
				{
					++this.visibleItemCount;
					var row = new kr3m.ui.Row(body, {"class" : "row" + (j + 1)});
					var x = 0;
					for (var i in this.map)
					{
						if (this.map[i].hidden)
							continue;

						var attributes = this.map[i].attributes || {};
						var cell = new kr3m.ui.Cell(row, attributes);
						cell.addClass("row" + (j + 1));
						cell.addClass("col" + (x++));

						var formatter = this.map[i].formatter || this.defaultFormatter;
						var formatterInput = kr3m.util.Util.getProperty(this.data[j], i);
						var formatterResult = formatter(formatterInput, cell, this.data[j]);
						if (typeof formatterResult != "undefined")
							cell.setText(formatterResult);

						if (typeof this.map[i].onClick != "undefined")
							cell.on("click", this.map[i].onClick.bind(this, this.data[j], i));
					}
				}
			}
		}



		public getVisibleItemCount():number
		{
			return this.visibleItemCount;
		}



		private redrawNoDataMessage():void
		{
			if (this.noDataMessage)
			{
				var body = new kr3m.ui.Element(this, null, "tbody");
				var row = new kr3m.ui.Row(body);
				var cell = new kr3m.ui.Cell(row, {"class" : "noData"});
				cell.setText(this.noDataMessage);
			}
		}



		public hasData():boolean
		{
			return this.data && this.data.length > 0;
		}



		public redraw(
			callback:(visibleItemCount:number) => void = null):void
		{
			this.removeAllChildren();

			if (!this.data)
				return;

			if (this.currentSortField)
				kr3m.util.Util.sortBy(this.data, this.currentSortField, this.ascending);

			if (this.renderHeader && this.hasData())
				this.redrawHeader();

			if (this.hasData())
				this.redrawContent();
			else
				this.redrawNoDataMessage();

			for (var i = 0; i < this.redrawCallbacks.length; ++i)
				this.redrawCallbacks[i](this.visibleItemCount);

			if (callback)
				callback(this.visibleItemCount);
		}



		public addRedrawCallback(callback:(visibleItemCount:number) => void):void
		{
			this.redrawCallbacks.push(callback);
		}



		/*
			Das hier ist die Standardfilterfunktion des Datagrids,
			die true für alle dataItem Objekte zurück gibt. D.h.
			sie filtert nichts aus sondern zeigt einfach alles an.
			Mit setFilter kann eine andere Filterfunktion eingestellt
			werden.
		*/
		private defaultFilterFunc(dataItem:any):boolean
		{
			return true;
		}



		/*
			Mit setFilter kann eine Funktion beim Datagrid hinterlegt
			werden, die einzelne Elemente der Daten von der Anzeige
			ausschließen kann. Jedes Mal, wenn das Datagrid aktualisiert
			wird, wird die Filterfunktion für jedes Element / dataItem in
			den Daten aufgerufen. Alle Elemente, für welche die Funktion
			true zurück gibt werden angezeigt, alle anderen werden
			ausgeblendet. setFilter kann mit null als Parameter aufgerufen
			werden, in diesem Fall wird das Standardverhalten wieder
			hergestellt.
		*/
		public setFilter(filterFunc:(dataItem:any) => boolean):void
		{
			this.filterFunc = filterFunc || this.defaultFilterFunc;
		}



		/*
			Siehe setMappedData.
		*/
		public setData(data:any[]):void
		{
			this.data = data;
			this.redraw();
		}



		public addData(data:any[]):void
		{
			this.data = this.data.concat(data);
			this.redraw();
		}



		public reload(callback:(itemCount:number) => void = null):void
		{
			this.data = [];
			this.redraw();
			var offset = 0;
			var limit = 20;
			kr3m.async.Loop.loop((loopCallback:(doAgain:boolean) => void) =>
			{
				this.serviceFunc(offset, limit, (dataChunk:any[]) =>
				{
					this.addData(dataChunk);
					offset += limit;
					loopCallback(dataChunk.length >= limit);
				});
			}, () =>
			{
				if (callback)
					callback(this.getVisibleItemCount());
			});
		}



		public setDataServiceFunction(serviceFunc:(offset:number, limit:number, callback:(data:any[]) => void) => void):void
		{
			this.serviceFunc = serviceFunc;
		}



		/*
			Ändert einen Wert eines Datensatzes in Data. keyValue gibt
			an, welcher Datensatz verändert werden soll und fieldName gibt
			an, welches Attribut verändert werden soll. fieldValue enthält
			den neuen Namen für fieldName. keyName ist der Name der Spalte /
			des Attributes, in welchem nach keyValue gesucht werden soll.

			Es wird nur das Attribut des ersten gefundenen Elementes ersetzt.

			Das Ändern des Datensatzen führt nicht zu einem automatischen
			Aktualisieren des Datagrids. Dafür muss kr3m.util.DataGrid.redraw
			aufgerufen werden. Andernfalls wird das veränderte Element erst
			bei der nächsten Aktualisierung des DataGrids mit dem neuen Wert
			angezeigt.
		*/
		public setDataFieldValue(
			keyValue:any,
			fieldName:string,
			fieldValue:any,
			keyName:string = "id"):void
		{
			if (!this.data)
				return;

			for (var i = 0; i < this.data.length; ++i)
			{
				if (kr3m.util.Util.getProperty(this.data[i], keyName) == keyValue)
				{
					kr3m.util.Util.setProperty(this.data[i], fieldName, fieldValue);
					return;
				}
			}
		}



		/*
			Siehe setMappedData.
		*/
		public setMap(map:any):void
		{
			this.map = map;
			this.currentSortField = null;
			this.ascending = false;
			this.redraw();
		}



		public setColumnVisible(column:string, visible:boolean):void
		{
			this.map[column].hidden = !visible;
			this.redraw();
		}



		/*
			Die Hauptfunktion des Datagrids. Sie erwartet zwei
			Parameter: map und data. data ist der Inhalt, der
			im Datagrid angezeigt werden soll und map ist eine
			Beschreibung, wie dieser Inhalt angezeigt werden soll.

			data muss ein Array von assoziativen Arrays / Objekten
			sein - die Attribute der einzelnen Objekte werden
			als Spalteneinträge im Datagrid angezeigt.

			map enthält eine Beschreibung, wie genau die Daten aus
			data angezeigt werden sollen. Es ist ein assoziatives
			Array, das für jede Spalte, die angezeigt werden soll
			einen Eintrag enhält. Dieser Eintrag kann selbst wieder
			verschiedene der folgenden Optionen beinhalten:
				- caption:string - der Spaltenname
				- canSort:boolean - ob die Spalte durch einen Klick auf ihren Namen sortiert werden kann oder nicht (optional)
				- onClick:(item:any, field:string) => void - eine Funktion, die aufgerufen wird, wenn der Eintrag angeklickt wird (optional)
				- attributes:any - optionale HTML-Attribute, die jedem Eintrag in dieser Spalte hinzugefügt werden (optional)
				- formatter:Function - eine Funktion, die den Inhalt der Spalten stärker verändern kann - siehe defaultFormatter (optional)
				- hidden:boolean - ob die Spalte initial sichtbar ist oder nicht (optional)
		*/
		public setMappedData(map:any, data:any[]):void
		{
			this.map = map;
			this.data = data;
			this.currentSortField = null;
			this.ascending = false;
			this.redraw();
		}
	}
}

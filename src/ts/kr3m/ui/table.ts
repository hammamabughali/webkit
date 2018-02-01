/// <reference path="../ui/cell.ts"/>
/// <reference path="../ui/cellheader.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/row.ts"/>



module kr3m.ui
{
	export class Table extends kr3m.ui.Element
	{
		constructor(parent, attributes:any = {})
		{
			super(parent, null, "table", attributes);
		}



		public addHeaders(...values:any[]):kr3m.ui.Row
		{
			var row = new kr3m.ui.Row(this);
			for (var i = 0; i < values.length; ++i)
				new kr3m.ui.CellHeader(row, values[i] !== undefined ? values[i].toString() : "");
			return row;
		}



		public addEditableHeaders(
			captions:string[],
			inputListener:(offset:number, cell:kr3m.ui.CellHeader) => void):kr3m.ui.Row
		{
			var row = new kr3m.ui.Row(this);
			for (var i = 0; i < captions.length; ++i)
			{
				var cell = new kr3m.ui.CellHeader(row, "");
				cell.setHtml(captions[i]);
				cell.setAttribute("contentEditable", "true");
				cell.on("input", inputListener.bind(null, i, cell));
			}
			return row;
		}



		public addRow(...values:any[]):kr3m.ui.Row
		{
			var y = this.children.length;
			var row = new kr3m.ui.Row(this, {"class" : "row" + y});
			for (var i = 0; i < values.length; ++i)
			{
				var cell = new kr3m.ui.Cell(row, {"class" : "row" + y + " col" + i});
				cell.setText(values[i] !== undefined ? values[i].toString() : "");
			}
			return row;
		}



		public addRowHtml(...values:any[]):kr3m.ui.Row
		{
			var y = this.children.length;
			var row = new kr3m.ui.Row(this, {"class" : "row" + y});
			for (var i = 0; i < values.length; ++i)
			{
				var cell = new kr3m.ui.Cell(row, {"class" : "row" + y + " col" + i});
				cell.setHtml(values[i] !== undefined ? values[i].toString() : "");
			}
			return row;
		}



		public addEditableRow(
			values:any[],
			inputListener:(offset:number, cell:kr3m.ui.Cell) => void):kr3m.ui.Row
		{
			var y = this.children.length;
			var row = new kr3m.ui.Row(this, {"class" : "row" + y});
			for (var i = 0; i < values.length; ++i)
			{
				var cell = new kr3m.ui.Cell(row, {"class" : "row" + y + " col" + i});
				cell.setHtml(values[i] !== undefined ? values[i].toString() : "");
				cell.setAttribute("contentEditable", "true");
				cell.on("input", inputListener.bind(null, i, cell));
			}
			return row;
		}



		public getCell(col:number, row:number):kr3m.ui.Cell
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof kr3m.ui.Row)
				{
					if (row == 0)
					{
						for (var j = 0; j < this.children[i].children.length; ++j)
						{
							if (this.children[i].children[j] instanceof kr3m.ui.Cell)
							{
								if (col == 0)
								{
									return <kr3m.ui.Cell> this.children[i].children[j];
								}
							}
							--col;
						}
					}
					--row;
				}
			}
			return null;
		}



		public getCellHeader(col:number, row:number):kr3m.ui.CellHeader
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof kr3m.ui.Row)
				{
					if (row == 0)
					{
						for (var j = 0; j < this.children[i].children.length; ++j)
						{
							if (this.children[i].children[j] instanceof kr3m.ui.CellHeader)
							{
								if (col == 0)
								{
									return <kr3m.ui.CellHeader> this.children[i].children[j];
								}
							}
							--col;
						}
					}
					--row;
				}
			}
			return null;
		}



		public setData(data:any[], firstRowIsHeader:boolean = false):void
		{
			this.removeAllChildren();
			this.dom.empty();

			if (data.length == 0)
				return;

			var y = 0;
			if (firstRowIsHeader)
			{
				var row = new kr3m.ui.Row(this, {"class" : "row" + y});
				var x = 0;
				for (var key in data[y])
				{
					new kr3m.ui.CellHeader(row, data[y][key], {"class" : "row" + y + " col" + x});
					++x;
				}
				++y;
			}
			for (; y < data.length; ++y)
			{
				var row = new kr3m.ui.Row(this, {"class" : "row" + y});
				var x = 0;
				for (var key in data[y])
				{
					var cell = new kr3m.ui.Cell(row, {"class" : "row" + y + " col" + x});
					cell.setText(data[y][key]);
					++x;
				}
			}
		}



		public setDimensions(cols:number, rows:number, fillHtml?:string):void
		{
			this.removeAllChildren();
			this.dom.empty();

			for (var y = 0; y < rows; ++y)
			{
				var row = new kr3m.ui.Row(this, {"class" : "row" + y});
				for (var x = 0; x < cols; ++x)
				{
					var cell = new kr3m.ui.Cell(row, {"class" : "row" + y + " col" + x});
					if (fillHtml)
						cell.setInnerHtml(fillHtml);
				}
			}
		}



		public setCellHtml(col:number, row:number, html:any):void
		{
			this.dom.find(".row" + row + " .col" + col).html(html);
		}
	}
}

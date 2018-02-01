/// <reference path="../../../../../ui/table.ts"/>
/// <reference path="../../../../../util/validator.ts"/>



module omni.widgets
{
	export class PodTable extends kr3m.ui.Table
	{
		private freeColId:number;

		private keys:string[];
		private data:any[][];

		private hiddenColumns:boolean[] = [];



		constructor(parent:kr3m.ui.Element)
		{
			super(parent);
			this.addClass("podTable");
			this.setData([]);
		}



		public getKeys():string[]
		{
			return this.keys.slice();
		}



		public sortBy(key:string, ascending:boolean = true):void
		{
			var p = this.keys.indexOf(key);
			if (p < 0)
				return;

			kr3m.util.Util.sortBy(this.data, p.toString(), ascending);
		}



		public getVisibleColumns():string[]
		{
			var cols:string[] = [];
			for (var i = 0; i < this.keys.length; ++i)
			{
				if (!this.hiddenColumns[i])
					cols.push(this.keys[i]);
			}
			return cols;
		}



		public setVisibleColumns(visible:string[]):void
		{
			for (var i = 0; i < this.keys.length; ++i)
				this.hiddenColumns[i] = visible.indexOf(this.keys[i]) < 0;
			this.redraw();
		}



		public deleteColumns(columns:string[]):void
		{
			for (var i = 0; i < columns.length; ++i)
			{
				var colId = this.keys.indexOf(columns[i]);
				if (colId < 0)
					continue;

				this.keys.splice(colId, 1);
				for (var j = 0; j < this.data.length; ++j)
					this.data[j].splice(colId, 1);
				if (this.hiddenColumns.length > colId)
					this.hiddenColumns.splice(colId, 1);
			}
			this.redraw();
		}



		public addEditableHeaders(
			captions:string[],
			inputListener:(offset:number, cell:kr3m.ui.CellHeader) => void):kr3m.ui.Row
		{
			var escaped:string[] = [];
			for (var i = 0; i < captions.length; ++i)
			{
				if (!this.hiddenColumns[i])
					escaped.push(kr3m.util.Util.encodeHtml(captions[i].toString()));
			}
			return super.addEditableHeaders(escaped, inputListener);
		}



		public addEditableRow(
			values:any[],
			inputListener:(offset:number, cell:kr3m.ui.Cell) => void):kr3m.ui.Row
		{
			var escaped:string[] = [];
			for (var i = 0; i < values.length; ++i)
			{
				if (!this.hiddenColumns[i])
					escaped.push(kr3m.util.Util.encodeHtml(values[i].toString()));
			}
			return super.addEditableRow(escaped, inputListener);
		}



		public redraw():void
		{
			this.removeAllChildren();
			this.addEditableHeaders(this.keys, this.onHeaderChanged.bind(this));
			for (var i = 0; i < this.data.length; ++i)
				this.addEditableRow(this.data[i], this.onValueChanged.bind(this, i));
		}



		private adjustOffset(offset):number
		{
			for (var i = 0; i <= offset; ++i)
			{
				if (this.hiddenColumns[i])
					++offset;
			}
			return offset;
		}



		private escape(text:string):string
		{
			return text;
		}



		private onHeaderChanged(offset:number, cell:kr3m.ui.CellHeader):void
		{
			offset = this.adjustOffset(offset);
			this.keys[offset] = this.escape(cell.getText());
		}



		private onValueChanged(row:number, col:number, cell:kr3m.ui.Cell):void
		{
			col = this.adjustOffset(col);
			this.data[row][col] = this.escape(cell.getText());
		}



		public addKey(key?:string):void
		{
			key = key || "col" + this.freeColId++;
			if (kr3m.util.Util.contains(this.keys, key))
				return;

			this.keys.push(key);
			for (var i = 0; i < this.data.length; ++i)
				this.data[i].push("");
			this.redraw();
		}



		public addEntry(newEntry?:any, redraw:boolean = true):void
		{
			var entry = [];
			if (newEntry)
			{
				for (var i = 0; i < this.keys.length; ++i)
				{
					var value = newEntry[this.keys[i]] !== undefined ? newEntry[this.keys[i]] : "";
					entry.push(value);
				}
			}
			else
			{
				for (var i = 0; i < this.keys.length; ++i)
					entry.push("");
			}
			this.data.unshift(entry);
			if (redraw)
				this.redraw();
		}



		public upsert(newEntry:any, key:string = "id"):void
		{
			for (var field in newEntry)
			{
				if (!kr3m.util.Util.contains(this.keys, field))
					this.addKey(field);
			}

			var entry = [];
			for (var i = 0; i < this.keys.length; ++i)
				entry.push(newEntry[this.keys[i]]);

			var p = this.keys.indexOf(key);
			var updated = false;
			for (var i = 0; i < this.data.length; ++i)
			{
				if (this.data[i][p] == entry[p])
				{
					for (var j = 0; j < entry.length; ++j)
					{
						if (entry[j] !== undefined)
							this.data[i][j] = entry[j];
					}
					updated = true;
				}
			}
			if (!updated)
				this.addEntry(newEntry, false);
		}



		private collectKeys():void
		{
			var u = kr3m.util.Util;
			this.keys = [];
			for (var i = 0; i < this.data.length; ++i)
			{
				var rowKeys = Object.keys(this.data[i]);
				for (var j = 0; j < rowKeys.length; ++j)
				{
					var value = u.getProperty(this.data[i], rowKeys[j]);
					if (typeof value == "object")
					{
						if (Array.isArray(value))
						{
							rowKeys[j] += "[]";
						}
						else
						{
							var subKeys = Object.keys(value).map(old => rowKeys[j] + "." + old);
							rowKeys = rowKeys.slice(0, j).concat(subKeys).concat(rowKeys.slice(j + 1));
						}
					}
				}
				this.keys = kr3m.util.Util.merge(this.keys, rowKeys);
			}

			for (var i = 0; i < this.keys.length; ++i)
			{
				if (this.keys[i].charAt(0) == "_")
					this.keys.splice(i--, 1);
				else if (this.keys[i].indexOf("._") >= 0)
					this.keys.splice(i--, 1);
			}
		}



		private unmap():void
		{
			var u = kr3m.util.Util;
			for (var i = 0; i < this.data.length; ++i)
			{
				var values:any[] = [];
				for (var j = 0; j < this.keys.length; ++j)
				{
					if (this.keys[j].slice(-2) == "[]" && Array.isArray(this.data[i]))
						var value = u.getProperty(this.data[i], this.keys[j].slice(0, -2)).join(", ");
					else
						var value = u.getProperty(this.data[i], this.keys[j]);
					values.push(value);
				}
				this.data[i] = values;
			}
		}



		public setData(data:any[]):void
		{
			this.freeColId = 1;
			this.hiddenColumns = [];
			this.data = data;
			this.collectKeys();
			this.unmap();
			this.redraw();
		}



		private adjustType(value:string):any
		{
			if (typeof value != "string")
				return value;

			if (value == "true")
				return true;

			if (value == "false")
				return false;

			if (kr3m.util.Validator.isFloat(value))
			{
				var float = parseFloat(value);
				if (!isNaN(float))
					return float;
			}

			return value;
		}



		public getData(flatten:boolean = true):any
		{
			var U = kr3m.util.Util;
			var result:any[] = [];
			for (var i = 0; i < this.data.length; ++i)
			{
				var entry:any = {};
				for (var j = 0; j < this.keys.length; ++j)
				{
					var value = this.data[i][j] !== undefined ? this.data[i][j] : "";
					if (flatten && this.keys[j].slice(-2) == "[]")
					{
						var values = value.split(",").filter(v => v).map(v => this.adjustType(v.trim()));
						U.setProperty(entry, this.keys[j].slice(0, -2), values);
					}
					else
					{
						value = this.adjustType(value);
						if (flatten)
							U.setProperty(entry, this.keys[j], value);
						else
							entry[this.keys[j]] = value;
					}
				}
				result.push(entry);
			}
			return result;
		}
	}
}

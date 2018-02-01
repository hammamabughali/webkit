/// <reference path="../../../../../ui/editbox.ts"/>
/// <reference path="../../../../../ui/table.ts"/>



module omni.widgets
{
	export class PropertySet extends kr3m.ui.Element
	{
		private table:kr3m.ui.Table;
		private editBoxesById:{[id:string]:kr3m.ui.Editbox} = {};



		constructor(parent:kr3m.ui.Element)
		{
			super(parent);
			this.addClass("propertySet");
			this.table = new kr3m.ui.Table(this);
		}



		public add(id:string, captionId:string):void
		{
			var row = new kr3m.ui.Row(this);
			var cell = new kr3m.ui.Cell(row);
			cell.setText(loc(captionId));
			cell = new kr3m.ui.Cell(row);
			this.editBoxesById[id] = new kr3m.ui.Editbox(cell);
		}



		public setProperties(props:{[id:string]:any}):void
		{
			for (var id in props)
			{
				if (this.editBoxesById[id])
					this.editBoxesById[id].setText(props[id]);
			}
		}



		public getProperties():{[id:string]:string}
		{
			var props:{[id:string]:string} = {};
			for (var id in this.editBoxesById)
				props[id] = this.editBoxesById[id].getText();
			return props;
		}
	}
}

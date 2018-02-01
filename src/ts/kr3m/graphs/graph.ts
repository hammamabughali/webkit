/// <reference path="../graphs/math.ts"/>
/// <reference path="../ui/element.ts"/>



module kr3m.graphs
{
	export enum GRID_MODE
	{
		NONE, // es wird kein Raster angezeigt
		STEPS, // es werden Linien nach Schrittabstand gezeigt
		THRESHOLD // auf dem gewünschten Grenzwert wird eine Trennlinie angezeigt
	};



	export class Graph extends kr3m.ui.Element
	{
		private data:any[];
		private legend:string[];
		private columnNames:string[];

		public valueFormatter:(value:number) => string = (value:number) => {return value.toString()};
		public gridSteps:number = 5;



		constructor(parent:kr3m.ui.Element, width:number = 600, height:number = 400)
		{
			super(parent, null, "div", {width:width, height:height});
		}



		public setData(data:any[]):void
		{
			this.data = data;
		}



		public getData():any[]
		{
			return this.data;
		}



		public setLegend(legend:string[]):void
		{
			this.legend = legend;
		}



		public getLegend():string[]
		{
			return this.legend;
		}



		public setColumnNames(columnNames:string[]):void
		{
			this.columnNames = columnNames;
		}



		public getColumnNames():string[]
		{
			return this.columnNames;
		}



		public update():void
		{
			//wird in abgeleiteten Klassen überschrieben
		}
	}
}

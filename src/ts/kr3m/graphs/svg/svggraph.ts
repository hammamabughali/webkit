/// <reference path="../../graphs/graph.ts"/>
/// <reference path="../../images/svgmaker.ts"/>



module kr3m.graphs.svg
{
	export class SvgGraph extends kr3m.graphs.Graph
	{
		protected svg:kr3m.images.SvgMaker;
		protected style:string;



		constructor(parent:kr3m.ui.Element, width:number = 600, height:number = 400)
		{
			super(parent, width, height);
			this.svg = new kr3m.images.SvgMaker(width, height);
		}



		public setStyle(style:string):void
		{
			this.style = style;
		}



		public clear():void
		{
			this.svg.clear();
			if (this.style)
				this.svg.setStyle(this.style);
		}



		public update():void
		{
			this.dom.html(this.svg.flush());
		}
	}
}

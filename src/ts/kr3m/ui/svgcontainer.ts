/// <reference path="../images/svgmaker.ts"/>
/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class SvgContainer extends kr3m.ui.Element
	{
		public svg:kr3m.images.SvgMaker;



		constructor(parent:kr3m.ui.Element, width:number = 600, height:number = 400)
		{
			super(parent, null, "div", {width : width, height : height});
			this.svg = new kr3m.images.SvgMaker(width, height);
		}



		public update():void
		{
			this.dom.html(this.svg.flush());
		}
	}
}

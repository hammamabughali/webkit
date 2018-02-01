/// <reference path="../lib/easeljs.ts"/>
/// <reference path="../ui/canvas.ts"/>



module kr3m.ui
{
	/*
		Wrapper für ein Easel.js Stage Objekt, damit es einfach
		in unserem Framework verwendet werden kann. Der zentrale
		Bezugspunkt für alle weiteren Easel.js Operationen ist
		das öffentliche Stage Objekt.
	*/
	export class EaselJsContainer extends kr3m.ui.Canvas
	{
		public stage:createjs.Stage;



		constructor(parent:kr3m.ui.Element, width:number = 600, height:number = 400, attributes:any = {})
		{
			super(parent, width, height, attributes);
			this.stage = new createjs.Stage(this.getId());
			createjs.Ticker.addEventListener("tick", this.tick.bind(this));
			createjs.Ticker.setFPS(40);
		}



		private tick():void
		{
			this.onEnterFrame();
			this.stage.update();
		}



		public onEnterFrame():void
		{
			//nichts machen, wird in abgeleiteten Klassen überschrieben
		}
	}
}

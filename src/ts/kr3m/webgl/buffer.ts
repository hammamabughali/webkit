/// <reference path="../webgl/canvas.ts"/>



module kr3m.webgl
{
	export class Buffer
	{
		protected canvas:kr3m.webgl.Canvas;
		protected bufferObj:any;



		constructor(canvas:kr3m.webgl.Canvas)
		{
			this.canvas = canvas;

			var gl = this.canvas.getGL();
			this.bufferObj = gl.createBuffer();
		}



		public use():void
		{
			// wird in abgeleiteten Klassen überschrieben
			throw new Error("abstract method call");
		}
	}
}

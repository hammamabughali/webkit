/// <reference path="../lib/webgl.ts"/>
/// <reference path="../ui2/canvas.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../webgl/color.ts"/>
/// <reference path="../webgl/program.ts"/>



module kr3m.webgl
{
	export class Canvas extends kr3m.ui2.Canvas
	{
		protected gl:WebGLRenderingContext;

		public currentProgram:kr3m.webgl.Program;



		constructor(parentNode:kr3m.ui2.ParentTypes, options?:kr3m.ui2.CanvasOptions)
		{
			super(parentNode, options);

			try
			{
				this.gl = this.dom.getContext("webgl") || this.dom.getContext("experimental-webgl");
			}
			catch(e)
			{
				logError("could not create WebGL canvas context");
			}
		}



		public getAspectRatio():number
		{
			return this.getWidth() / this.getHeight();
		}



		public getGL():WebGLRenderingContext
		{
			return this.gl;
		}



		public clear(c:kr3m.webgl.Color):void
		{
			var gl = this.gl;
			gl.clearColor(c.r, c.g, c.b, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	}
}

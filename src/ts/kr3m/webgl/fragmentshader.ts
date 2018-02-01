/// <reference path="../webgl/shader.ts"/>



module kr3m.webgl
{
	export class FragmentShader extends kr3m.webgl.Shader
	{
		constructor(canvas:kr3m.webgl.Canvas)
		{
			super(canvas, canvas.getGL().FRAGMENT_SHADER);
		}



		public setSource(source:string):void
		{
			super.setSource("precision mediump float;\n\n" + source);
		}
	}
}

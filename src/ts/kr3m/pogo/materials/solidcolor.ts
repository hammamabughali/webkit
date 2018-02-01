/// <reference path="../../pogo/material.ts"/>
/// <reference path="../../webgl/color.ts"/>
/// <reference path="../../webgl/fragmentshader.ts"/>
/// <reference path="../../webgl/program.ts"/>
/// <reference path="../../webgl/vertexshader.ts"/>



module pogo.materials
{
	export interface SolidColorOptions extends pogo.MaterialOptions
	{
		color?:kr3m.webgl.Color;
	}



	export class SolidColor extends pogo.Material
	{
		protected options:SolidColorOptions;



		constructor(
			canvas:pogo.Canvas,
			options?:SolidColorOptions)
		{
			super(canvas, options);

			var program = new kr3m.webgl.Program(canvas);

			var vertexCode = //# EMBED(solidcolor_v.glsl, json);
			var vertex = new kr3m.webgl.VertexShader(canvas);
			vertex.setSource(vertexCode);
			program.setVertexShader(vertex);

			var fragmentCode = //# EMBED(solidcolor_f.glsl, json);
			var fragment = new kr3m.webgl.FragmentShader(canvas);
			fragment.setSource(fragmentCode);
			program.setFragmentShader(fragment);

			this.setProgram(program);
			this.setColor(this.options.color || new kr3m.webgl.Color(1, 0, 0));
		}



		public setColor(r:number, g:number, b:number):void;
		public setColor(color:kr3m.webgl.Color):void;
		public setColor():void
		{
			if (arguments.length == 1)
				this.program.setUniformColor("uCol", arguments[0]);
			else
				this.program.setUniformColor("uCol", new kr3m.webgl.Color(arguments[0], arguments[1], arguments[2]));
		}
	}
}

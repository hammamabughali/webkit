/// <reference path="../../pogo/material.ts"/>
/// <reference path="../../webgl/fragmentshader.ts"/>
/// <reference path="../../webgl/program.ts"/>
/// <reference path="../../webgl/vertexshader.ts"/>



module pogo.materials
{
	export interface VertexColorsOptions extends pogo.MaterialOptions
	{
	}



	export class VertexColors extends pogo.Material
	{
		protected options:VertexColorsOptions;



		constructor(
			canvas:pogo.Canvas,
			options?:VertexColorsOptions)
		{
			super(canvas);

			var program = new kr3m.webgl.Program(canvas);

			var vertexCode = //# EMBED(vertexcolors_v.glsl, json);
			var vertex = new kr3m.webgl.VertexShader(canvas);
			vertex.setSource(vertexCode);
			program.setVertexShader(vertex);

			var fragmentCode = //# EMBED(vertexcolors_f.glsl, json);
			var fragment = new kr3m.webgl.FragmentShader(canvas);
			fragment.setSource(fragmentCode);
			program.setFragmentShader(fragment);

			this.setProgram(program);
		}
	}
}

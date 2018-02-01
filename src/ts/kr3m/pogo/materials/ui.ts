/// <reference path="../../pogo/material.ts"/>
/// <reference path="../../pogo/texture.ts"/>
/// <reference path="../../webgl/fragmentshader.ts"/>
/// <reference path="../../webgl/program.ts"/>
/// <reference path="../../webgl/vertexshader.ts"/>



module pogo.materials
{
	export interface UiOptions extends pogo.MaterialOptions
	{
		textureUrl:string;
	}



	export class Ui extends pogo.Material
	{
		protected options:UiOptions;



		constructor(
			canvas:pogo.Canvas,
			options:UiOptions)
		{
			super(canvas, options);

			var program = new kr3m.webgl.Program(canvas);

			var vertexCode = //# EMBED(ui_v.glsl, json);
			var vertex = new kr3m.webgl.VertexShader(canvas);
			vertex.setSource(vertexCode);
			program.setVertexShader(vertex);

			var fragmentCode = //# EMBED(ui_f.glsl, json);
			var fragment = new kr3m.webgl.FragmentShader(canvas);
			fragment.setSource(fragmentCode);
			program.setFragmentShader(fragment);

			var texture = new pogo.Texture(canvas, {url : this.options.textureUrl});
			program.setUniformTexture("uDiffuseMap", texture);

			this.setProgram(program);
		}
	}
}

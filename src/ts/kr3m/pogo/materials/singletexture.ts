/// <reference path="../../pogo/material.ts"/>
/// <reference path="../../pogo/texture.ts"/>
/// <reference path="../../webgl/fragmentshader.ts"/>
/// <reference path="../../webgl/program.ts"/>
/// <reference path="../../webgl/vertexshader.ts"/>



module pogo.materials
{
	export interface SingleTextureOptions extends pogo.MaterialOptions
	{
		textureUrl:string;
	}



	export class SingleTexture extends pogo.Material
	{
		protected options:SingleTextureOptions;



		constructor(
			canvas:pogo.Canvas,
			options:SingleTextureOptions)
		{
			super(canvas, options);

			var program = new kr3m.webgl.Program(canvas);

			var vertexCode = //# EMBED(singletexture_v.glsl, json);
			var vertex = new kr3m.webgl.VertexShader(canvas);
			vertex.setSource(vertexCode);
			program.setVertexShader(vertex);

			var fragmentCode = //# EMBED(singletexture_f.glsl, json);
			var fragment = new kr3m.webgl.FragmentShader(canvas);
			fragment.setSource(fragmentCode);
			program.setFragmentShader(fragment);

			var texture = new pogo.Texture(canvas, {url : this.options.textureUrl, priority : this.options.priority});
			program.setUniformTexture("uDiffuseMap", texture);

			this.setProgram(program);
		}
	}
}

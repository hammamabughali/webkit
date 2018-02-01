/// <reference path="../../pogo/material.ts"/>
/// <reference path="../../pogo/texture.ts"/>
/// <reference path="../../webgl/fragmentshader.ts"/>
/// <reference path="../../webgl/program.ts"/>
/// <reference path="../../webgl/vertexshader.ts"/>



module pogo.materials
{
	export interface BitmapFontOptions extends pogo.MaterialOptions
	{
		fontUrl:string;
	}



	export class BitmapFont extends pogo.Material
	{
		protected options:BitmapFontOptions;



		constructor(
			canvas:pogo.Canvas,
			options:BitmapFontOptions)
		{
			super(canvas, options);
			pogo.assets.getFontMeta(this.options.fontUrl, (meta) =>
			{
				//# TODO: aktuell wird nur eine einzelne Texture-Page unterstützt
				if (meta.pages.length > 1)
					throw new Error("pogo.materials.BitmapFont doesn't support multiple font pages yet");

				var textureUrl = meta.pages[0];

				var program = new kr3m.webgl.Program(canvas);

				var vertexCode = //# EMBED(ui_v.glsl, json);
				var vertex = new kr3m.webgl.VertexShader(canvas);
				vertex.setSource(vertexCode);
				program.setVertexShader(vertex);

				var fragmentCode = //# EMBED(ui_f.glsl, json);
				var fragment = new kr3m.webgl.FragmentShader(canvas);
				fragment.setSource(fragmentCode);
				program.setFragmentShader(fragment);

				var texture = new pogo.Texture(canvas, {url : textureUrl, priority : this.options.priority});
				program.setUniformTexture("uDiffuseMap", texture);

				this.setProgram(program);
			}, this.options.priority);
		}
	}
}

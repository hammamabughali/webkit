/// <reference path="../../pogo/constants.ts"/>
/// <reference path="../../pogo/files/wfo.ts"/>
/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface WaveFrontObjectOptions extends pogo.MeshOptions
	{
		url:string;
	}



	export class WaveFrontObject extends pogo.Mesh
	{
		protected options:WaveFrontObjectOptions;



		constructor(
			canvas:pogo.Canvas,
			options:WaveFrontObjectOptions)
		{
			super(canvas, options);

			pogo.assets.get(this.options.url, (code) =>
			{
				var wfo = new pogo.files.WFO();
				wfo.parse(code);

				var texelBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				texelBuffer.setTexels(wfo.texelData);
				this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

				var vertexBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				vertexBuffer.setVertices(wfo.vertexData);
				this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

				var elementBuffer = new kr3m.webgl.ElementBuffer(canvas);
				elementBuffer.setIndices(wfo.elementData);
				this.setElementBuffer(elementBuffer);

				var normalBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				normalBuffer.setNormals(this.generateNormals(wfo.vertexData, wfo.elementData));
				this.setAttributeBuffer(pogo.AB_NORMAL, normalBuffer);

				this.flags.set("ready");
			});
		}
	}
}

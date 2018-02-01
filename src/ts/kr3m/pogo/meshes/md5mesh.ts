/// <reference path="../../pogo/constants.ts"/>
/// <reference path="../../pogo/files/md5mesh.ts"/>
/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface Md5MeshOptions extends pogo.MeshOptions
	{
		url:string;
	}



	export class Md5Mesh extends pogo.Mesh
	{
		protected options:Md5MeshOptions;



		constructor(
			canvas:pogo.Canvas,
			options:Md5MeshOptions)
		{
			super(canvas, options);

			pogo.assets.get(this.options.url, (code) =>
			{
				var md5 = new pogo.files.Md5Mesh();
				md5.parse(code);

				var texelBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				texelBuffer.setTexels(md5.texelData);
				this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

				var vertexBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				vertexBuffer.setVertices(md5.vertexData);
				this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

				var elementBuffer = new kr3m.webgl.ElementBuffer(canvas);
				elementBuffer.setIndices(md5.elementData);
				this.setElementBuffer(elementBuffer);

				var normalBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				normalBuffer.setNormals(this.generateNormals(md5.vertexData, md5.elementData));
				this.setAttributeBuffer(pogo.AB_NORMAL, normalBuffer);

				this.flags.set("ready");
			}, this.options.priority);
		}
	}
}

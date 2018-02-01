/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface RectangleOptions extends pogo.MeshOptions
	{
		width?:number;
		height?:number;
	}



	export class Rectangle extends pogo.Mesh
	{
		protected options:RectangleOptions;



		constructor(canvas:pogo.Canvas, options:RectangleOptions)
		{
			super(canvas, options);

			var w = this.options.width || 0;
			var h = this.options.height || 0;

			var texelBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			var texels = [ 0, 1, 1, 1, 1, 0, 0, 0 ];
			texelBuffer.setTexels(texels);
			this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

			var vertexBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			var vertices = [ 0, h, 0, w, h, 0, w, 0, 0, 0, 0, 0 ];
			vertexBuffer.setVertices(vertices);
			this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

			var elementBuffer = new kr3m.webgl.ElementBuffer(canvas);
			elementBuffer.setIndices([0, 1, 2, 2, 3, 0]);
			this.setElementBuffer(elementBuffer);

			this.flags.set("ready");
		}



		public setSize(w:number, h:number):void
		{
			var vertexBuffer = this.getAttributeBuffer(pogo.AB_VERTEX);
			var vertices = [ 0, h, 0, w, h, 0, w, 0, 0, 0, 0, 0 ];
			vertexBuffer.updateVertices(vertices);
			this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);
		}
	}
}

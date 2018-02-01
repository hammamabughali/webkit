/// <reference path="../../pogo/constants.ts"/>
/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface BoxOptions extends pogo.MeshOptions
	{
		w:number;
		h:number;
		d:number;
	}



	export class Box extends pogo.Mesh
	{
		protected options:BoxOptions;



		constructor(
			canvas:pogo.Canvas,
			options:BoxOptions)
		{
			super(canvas, options);

			var w = this.options.w / 2;
			var h = this.options.h / 2;
			var d = this.options.d / 2;

			var colorBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			colorBuffer.setColors(
			[
				1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1,
				0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
				0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1,
				1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
				0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
				1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1
			]);
			this.setAttributeBuffer(pogo.AB_COLOR, colorBuffer);

			var texelBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			texelBuffer.setTexels(
			[
				0, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0, 0
			]);
			this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

			var vertexBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			var vertices =
			[
				-w, -h,  d,  w, -h,  d,  w,  h,  d, -w,  h,  d, // front
				w, -h, -d, -w, -h, -d, -w,  h, -d,  w,  h, -d, // back
				-w,  h,  d,  w,  h,  d,  w,  h, -d, -w,  h, -d, // top
				-w, -h, -d,  w, -h, -d,  w, -h,  d, -w, -h,  d, // bottom
				w, -h,  d,  w, -h, -d,  w,  h, -d,  w,  h,  d, // right
				-w, -h, -d, -w, -h,  d, -w,  h,  d, -w,  h, -d  // left
			];
			vertexBuffer.setVertices(vertices);
			this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

			var elementBuffer = new kr3m.webgl.ElementBuffer(canvas);
			var elements =
			[
				0, 1, 2, 2, 3, 0,
				4, 5, 6, 6, 7, 4,
				8, 9, 10, 10, 11, 8,
				12, 13, 14, 14, 15, 12,
				16, 17, 18, 18, 19, 16,
				20, 21, 22, 22, 23, 20
			];
			elementBuffer.setIndices(elements);
			this.setElementBuffer(elementBuffer);

			var normalBuffer = new kr3m.webgl.AttributeBuffer(canvas);
			normalBuffer.setNormals(this.generateNormals(vertices, elements));
			this.setAttributeBuffer(pogo.AB_NORMAL, normalBuffer);

			this.flags.set("ready");
		}
	}
}

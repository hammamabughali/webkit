/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../ui2/canvas2d.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface Scale9Options extends pogo.MeshOptions
	{
		textureUrl:string;

		width?:number;
		height?:number;

		inferPadding?:boolean; // extract padding from png image using bottom row and right column
		padding?:number; // global padding setting
		paddingTop?:number;
		paddingRight?:number;
		paddingBottom?:number;
		paddingLeft?:number;
	}



	export class Scale9 extends pogo.Mesh
	{
		protected options:Scale9Options;

		private static inferredPaddings:{[textureUrl:string]:Scale9Options} = {};



		constructor(
			canvas:pogo.Canvas,
			options:Scale9Options)
		{
			super(canvas, options);
			pogo.assets.get(this.options.textureUrl, (img:HTMLImageElement) =>
			{
				var w = this.options.width || 0;
				var h = this.options.height || 0;

				if (this.options.inferPadding)
				{
					var ifu = 1 / img.naturalWidth;
					var ifv = 1 / img.naturalHeight;

					var inferred = this.inferPaddings(img);
					this.options = kr3m.util.Util.mergeAssoc(this.options, inferred);
				}
				else
				{
					var ifu = 0;
					var ifv = 0;

					this.options.paddingTop = this.options.paddingTop || this.options.padding || 0;
					this.options.paddingRight = this.options.paddingRight || this.options.padding || 0;
					this.options.paddingBottom = this.options.paddingBottom || this.options.padding || 0;
					this.options.paddingLeft = this.options.paddingLeft || this.options.padding || 0;
				}

				var u0 = 0;
				var u1 = this.options.paddingLeft / img.naturalWidth;
				var u2 = (img.naturalWidth - this.options.paddingRight) / img.naturalWidth - ifu;
				var u3 = 1 - ifu;

				var v0 = 0;
				var v1 = this.options.paddingTop / img.naturalHeight;
				var v2 = (img.naturalHeight - this.options.paddingBottom) / img.naturalHeight - ifv;
				var v3 = 1 - ifv;

				var texelBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				var texels =
				[
					u0, v0, u1, v0, u2, v0, u3, v0,
					u0, v1, u1, v1, u2, v1, u3, v1,
					u0, v2, u1, v2, u2, v2, u3, v2,
					u0, v3, u1, v3, u2, v3, u3, v3
				];
				texelBuffer.setTexels(texels);
				this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

				var vertexBuffer = new kr3m.webgl.AttributeBuffer(canvas);
				var vertices = this.getVertexValues(w, h);
				vertexBuffer.setVertices(vertices);
				this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

				var elementBuffer = new kr3m.webgl.ElementBuffer(canvas);
				elementBuffer.setIndices(
				[
					0, 4, 5, 5, 1, 0,
					1, 5, 6, 6, 2, 1,
					2, 6, 7, 7, 3, 2,
					4, 8, 9, 9, 5, 4,
					5, 9, 10, 10, 6, 5,
					6, 10, 11, 11, 7, 6,
					8, 12, 13, 13, 9, 8,
					9, 13, 14, 14, 10, 9,
					10, 14, 15, 15, 11, 10
				]);
				this.setElementBuffer(elementBuffer);

				this.flags.set("ready");
			});
		}



		protected getPaddingRange(data:Uint8ClampedArray):[number, number]
		{
			var start = -1;
			var end = data.length;
			for (var i = 3; i < data.length; i += 4)
			{
				if (data[i] == 0 && data[i + 4] > 0)
					start = Math.floor(i / 4) + 1;
				if (data[i] > 0 && data[ + 4] == 0)
					end = Math.floor((data.length - i - 3) / 4);
			}
			return [start, end];
		}



		protected inferPaddings(img:HTMLImageElement):Scale9Options
		{
			if (Scale9.inferredPaddings[this.options.textureUrl])
				return Scale9.inferredPaddings[this.options.textureUrl];

			var options =
			{
				textureUrl : this.options.textureUrl,
				paddingTop : -1,
				paddingBottom : -1,
				paddingLeft : -1,
				paddingRight : -1
			};

			var canvas = new kr3m.ui2.Canvas2d(null, {width : img.naturalWidth, height : img.naturalHeight});
			canvas.drawImage(img);

			var bottom = canvas.getImageData(0, img.naturalHeight - 1, img.naturalWidth, 1);
			[options.paddingLeft, options.paddingRight] = this.getPaddingRange(bottom.data);
			var right = canvas.getImageData(img.naturalWidth - 1, 0, 1, img.naturalHeight);
			[options.paddingTop, options.paddingBottom] = this.getPaddingRange(right.data);

			Scale9.inferredPaddings[this.options.textureUrl] = options;
			return options;
		}



		protected getVertexValues(w:number, h:number):number[]
		{
			var x0 = 0;
			var x1 = this.options.paddingLeft;
			var x2 = w - this.options.paddingRight;
			var x3 = w;

			var y0 = 0;
			var y1 = this.options.paddingTop;
			var y2 = h - this.options.paddingBottom;
			var y3 = h;

			var vertices =
			[
				x0, y0, 0, x1, y0, 0, x2, y0, 0, x3, y0, 0,
				x0, y1, 0, x1, y1, 0, x2, y1, 0, x3, y1, 0,
				x0, y2, 0, x1, y2, 0, x2, y2, 0, x3, y2, 0,
				x0, y3, 0, x1, y3, 0, x2, y3, 0, x3, y3, 0
			];
			return vertices;
		}



		public setSize(w:number, h:number):void
		{
			this.flags.onceSet("ready", () =>
			{
				var vertexBuffer = this.getAttributeBuffer(pogo.AB_VERTEX);
				var vertices = this.getVertexValues(w, h);
				vertexBuffer.updateVertices(vertices);
				this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);
			});
		}
	}
}

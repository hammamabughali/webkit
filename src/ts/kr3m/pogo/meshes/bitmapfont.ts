/// <reference path="../../pogo/mesh.ts"/>
/// <reference path="../../webgl/attributebuffer.ts"/>
/// <reference path="../../webgl/elementbuffer.ts"/>



module pogo.meshes
{
	export interface BitmapFontOptions extends pogo.MeshOptions
	{
		width?:number;
		height?:number;
		fontUrl:string;
		text?:string;
	}



	export class BitmapFont extends pogo.Mesh
	{
		protected options:BitmapFontOptions;

		private width:number;
		private height:number;
		private fontUrl:string;
		private text:string;
		private meta:pogo.data.FontMeta;
		private textDirty = false;

		private _alignH = pogo.TextAlignH.LEFT;
		private _alignV = pogo.TextAlignV.TOP;
		private _wordWrap = true;
		private _overflowX = false;
		private _overflowY = false;



		constructor(
			canvas:pogo.Canvas,
			options:BitmapFontOptions)
		{
			super(canvas, options);
			this.width = this.options.width || 0;
			this.height = this.options.height || 0;
			this.fontUrl = this.options.fontUrl;
			this.setText(this.options.text);
			pogo.assets.getFontMeta(this.fontUrl, (meta) =>
			{
				this.meta = meta;
				this.flags.set("ready");
			}, this.options.priority);
		}



		public set wordWrap(value:boolean)
		{
			if (this._wordWrap != value)
			{
				this._wordWrap = value;
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public get wordWrap():boolean
		{
			return this._wordWrap;
		}



		public set alignH(value:pogo.TextAlignH)
		{
			if (this._alignH != value)
			{
				this._alignH = value;
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public get alignH():pogo.TextAlignH
		{
			return this._alignH;
		}



		public set alignV(value:pogo.TextAlignV)
		{
			if (this._alignV != value)
			{
				this._alignV = value;
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public get alignV():pogo.TextAlignV
		{
			return this._alignV;
		}



		public set overflowX(value:boolean)
		{
			if (this._overflowX != value)
			{
				this._overflowX = value;
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public get overflowX():boolean
		{
			return this._overflowX;
		}



		public set overflowY(value:boolean)
		{
			if (this._overflowY != value)
			{
				this._overflowY = value;
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public get overflowY():boolean
		{
			return this._overflowY;
		}



		private pushGlyph(
			vs:number[],
			ts:number[],
			es:number[],
			l:number,
			r:number,
			t:number,
			b:number,
			x:number,
			y:number,
			w:number,
			h:number):void
		{
			var element = vs.length / 3;

			vs.push(l); vs.push(t); vs.push(0);
			vs.push(l); vs.push(b); vs.push(0);
			vs.push(r); vs.push(b); vs.push(0);
			vs.push(r); vs.push(t); vs.push(0);

			ts.push(x); ts.push(y);
			ts.push(x); ts.push(y + h);
			ts.push(x + w); ts.push(y + h);
			ts.push(x + w); ts.push(y);

			es.push(element);
			es.push(element + 1);
			es.push(element + 2);
			es.push(element + 2);
			es.push(element + 3);
			es.push(element);
		}



		private placeGlyphs(
			lineData:any[],
			vertices:number[],
			texels:number[],
			elements:number[]):void
		{
			for (var y = 0; y < lineData.length; ++y)
			{
				var px = lineData[y].x;
				var py = lineData[y].y;

				if (!this._overflowY)
				{
					if (py >= this.height)
						continue;

					if (py + lineData[y].h <= 0)
						continue;
				}

				for (var x = 0; x < lineData[y].text.length; ++x)
				{
					if (!this._overflowX && px >= this.width)
						continue;

					var charCode = lineData[y].text.charCodeAt(x);
					var char = this.meta.chars[charCode];
					if (!char)
					{
						logDebug("font", this.meta.url, "doesn't support character", lineData[y].text[x]);
						continue;
					}

					var l = px + char.xoffset;
					var r = l + char.width;
					var t = py + char.yoffset;
					var b = t + char.height;

					var cx = char.x;
					var cy = char.y;
					var cw = char.width;
					var ch = char.height;

					if (!this._overflowX)
					{
						if (r < 0)
						{
							px += char.xadvance;
							continue;
						}
						if (l < 0)
						{
							var f = -l / (r - l);
							l = 0;
							cx += cw * f;
							cw *= (1 - f);
						}
						if (r > this.width)
						{
							var f = (this.width - l) / (r - l);
							r = this.width;
							cw *= f;
						}
					}

					if (!this._overflowY)
					{
						if (t < 0)
						{
							var f = -t / (b - t);
							t = 0;
							cy += ch * f;
							ch *= (1 - f);
						}

						if (b > this.height)
						{
							var f = (this.height - t) / (b - t);
							b = this.height;
							ch *= f;
						}
					}

					this.pushGlyph(vertices, texels, elements, l, r, t, b, cx, cy, cw, ch);
					px += char.xadvance;
				}
			}

			for (var i = 0; i < texels.length; i += 2)
			{
				texels[i] /= this.meta.scaleW;
				texels[i + 1] /= this.meta.scaleH;
			}
		}



		private getLineWidth(line:string):number
		{
			var width = 0;
			for (var i = 0; i < line.length; ++i)
			{
				var charCode = line.charCodeAt(i);
				var char = this.meta.chars[charCode];
				if (char)
					width += char.xadvance;
			}
			return width;
		}



		private wrapWords(raw:string[]):string[]
		{
			var spaceWidth = this.meta.chars[32].xadvance;
			var wrapped:string[] = [];
			for (var i = 0; i < raw.length; ++i)
			{
				var words = raw[i].split(" ");
				var word = words.shift();
				var width = this.getLineWidth(word);
				var line = word;
				while (words.length > 0)
				{
					word = words.shift();
					var wordWidth = this.getLineWidth(word);
					if (width + spaceWidth + wordWidth <= this.width)
					{
						line += " " + word;
						width += spaceWidth + wordWidth;
					}
					else
					{
						wrapped.push(line);
						line = word;
						width = wordWidth;
					}
				}
				wrapped.push(line);
			}
			return wrapped;
		}



		private layoutLines():any[]
		{
			var lines:any[] = [];
			lines = this.text.split("\n");

			if (this._wordWrap)
				lines = this.wrapWords(lines);

			for (var i = 0; i < lines.length; ++i)
			{
				lines[i] =
				{
					text : lines[i],
					x : 0,
					y : i * this.meta.lineHeight,
					w : this.getLineWidth(lines[i]),
					h : this.meta.lineHeight
				};
			}

			if (this._alignH == pogo.TextAlignH.CENTER)
			{
				for (var i = 0; i < lines.length; ++i)
					lines[i].x = (this.width - lines[i].w) / 2;
			}
			else if (this._alignH == pogo.TextAlignH.RIGHT)
			{
				for (var i = 0; i < lines.length; ++i)
					lines[i].x = this.width - lines[i].w;
			}

			if (this._alignV == pogo.TextAlignV.CENTER)
			{
				var lastLine = lines[lines.length - 1];
				var offset = (this.height - lastLine.y - lastLine.h) / 2;
				for (var i = 0; i < lines.length; ++i)
					lines[i].y += offset;
			}
			else if (this._alignV == pogo.TextAlignV.BOTTOM)
			{
				var lastLine = lines[lines.length - 1];
				var offset = this.height - lastLine.y - lastLine.h;
				for (var i = 0; i < lines.length; ++i)
					lines[i].y += offset;
			}

			return lines;
		}



		private updateText():void
		{
			var texels:number[] = [];
			var vertices:number[] = [];
			var elements:number[] = [];

			var lineData = this.layoutLines();
			this.placeGlyphs(lineData, vertices, texels, elements);

			var texelBuffer = this.getAttributeBuffer(pogo.AB_TEXEL0) || new kr3m.webgl.AttributeBuffer(this.canvas);
			texelBuffer.setTexels(texels);
			this.setAttributeBuffer(pogo.AB_TEXEL0, texelBuffer);

			var vertexBuffer = this.getAttributeBuffer(pogo.AB_VERTEX) || new kr3m.webgl.AttributeBuffer(this.canvas);
			vertexBuffer.setVertices(vertices);
			this.setAttributeBuffer(pogo.AB_VERTEX, vertexBuffer);

			var elementBuffer = this.getElementBuffer() || new kr3m.webgl.ElementBuffer(this.canvas);
			elementBuffer.setIndices(elements);
			this.setElementBuffer(elementBuffer);
		}



		public setText(text:string):void
		{
			if (this.text != text)
			{
				this.text = text || "";
				this.textDirty = true;
				this.touchCanvas();
			}
		}



		public render(program:kr3m.webgl.Program):void
		{
			if (!this.meta)
				return;

			if (this.textDirty)
			{
				this.updateText();
				this.textDirty = false;
			}

			super.render(program);
		}
	}
}

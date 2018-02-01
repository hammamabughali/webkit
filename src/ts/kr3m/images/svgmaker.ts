/// <reference path="../images/color.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.images
{
	/*
		Hilfsklasse, um möglichst einfach SVG-Bilder
		(Scalar Vector Graphics) programmatisch im
		Browser zu erzeugen.

		Die meisten Funktionen gibt es in zwei Varianten.
		Die erste Variante verwendet die aktuellen
		Einstellungen des SvgMaker-Objektes (z.B. Zeichenfarbe
		oder Füllfarbe) um die einzelnen Grafikelemente
		zu zeichnen. Die Varianten, die auf CSS enden überlassen
		die optischen Details völlig dem CSS und erwarten
		entsprechend als ersten Parameter immer eine CSS Klasse.
	*/
	export class SvgMaker
	{
		private static freeId:number = 0;

		private content:string;
		private width:number;
		private height:number;

		private fillColor = new Color(255, 255, 255);

		private strokeColor = new Color(0, 0, 0);
		private strokeWidth:number = 1;

		private tempFunctionNames:string[] = [];

		public imageUrlPrefix = "";



		private getFreeId():string
		{
			return "kr3mSVG" + (SvgMaker.freeId++);
		}



		constructor(imageWidth = 640, imageHeight = 480)
		{
			this.width = imageWidth;
			this.height = imageHeight;
			this.clear();
		}



		public getWidth():number
		{
			return this.width;
		}



		public getHeight():number
		{
			return this.height;
		}



		public clear():this
		{
			for (var i = 0; i < this.tempFunctionNames.length; ++i)
				delete window[this.tempFunctionNames[i]];
			this.tempFunctionNames = [];

			this.content = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" version="1.1" width="' + this.width + '" height="' + this.height + '">';
			return this;
		}



		public setStyle(style:string):this
		{
			this.content += '<style type="text/css"><![CDATA[ ' + style + ' ]]></style>';
			return this;
		}



		public resetFillColor():this
		{
			this.fillColor = new Color(255, 255, 255);
			return this;
		}



		public setFillColor(color:Color):this
		{
			this.fillColor = color;
			return this;
		}



		public resetStrokeColor():this
		{
			this.strokeColor = new Color(0, 0, 0);
			return this;
		}



		public setStrokeColor(color:Color):this
		{
			this.strokeColor = color;
			return this;
		}



		public resetStrokeWidth():this
		{
			this.strokeWidth = 1;
			return this;
		}



		public setStrokeWidth(strokeWidth:number):this
		{
			this.strokeWidth = strokeWidth;
			return this;
		}



		public fillFill(params:any):void
		{
			params["fill"] = 'rgb(' + this.fillColor.r + ',' + this.fillColor.g + ',' + this.fillColor.b + ')';
			params["fill-opacity"] = this.fillColor.a / 255;
		}



		private fillStroke(params:any):void
		{
			params["stroke-width"] = this.strokeWidth;
			params["stroke"] = 'rgb(' + this.strokeColor.r + ',' + this.strokeColor.g + ',' + this.strokeColor.b + ')';
			params["stroke-opacity"] = this.strokeColor.a / 255;
		}



		private addElement(
			tag:string,
			params:any,
			content:string = null,
			close:boolean = true):void
		{
			var newLine = '<' + tag + ' ';

			if (params["clip-path"])
				params["clip-path"] = "url(#" + params["clip-path"] + ")";

			newLine += kr3m.util.StringEx.joinAssoc(params, '" ', '="') + '"';

			if (content)
			{
				newLine += '>' + content;
				if (close)
					newLine += '</' + tag + '>';
			}
			else
			{
				newLine += close ? '/>' : '>';
			}

			this.content += newLine;
		}



		public line(fromX:number, fromY:number, toX:number, toY:number):this
		{
			var params = {"x1":fromX, "y1":fromY, "x2":toX, "y2":toY};
			this.fillStroke(params);
			this.addElement("line", params);
			return this;
		}



		public lineCSS(
			className:string,
			fromX:number,
			fromY:number,
			toX:number,
			toY:number):this
		{
			var params =
			{
				x1 : fromX,
				y1 : fromY,
				x2 : toX,
				y2 : toY,
				class : className
			};
			this.addElement("line", params);
			return this;
		}



		public rectangle(
			x:number,
			y:number,
			width:number,
			height:number):this
		{
			var params =
			{
				x : x,
				y : y,
				width : width,
				height : height
			};
			this.fillFill(params);
			this.fillStroke(params);
			this.addElement("rect", params);
			return this;
		}



		public rectangleCSS(
			className:string,
			x:number,
			y:number,
			width:number,
			height:number):this
		{
			var params =
			{
				x : x,
				y : y,
				width : width,
				height : height,
				class : className
			};
			this.addElement("rect", params);
			return this;
		}



		public circle(x:number, y:number, r:number):this
		{
			var params =
			{
				cx : x,
				cy : y,
				r : r
			};
			this.fillFill(params);
			this.fillStroke(params);
			this.addElement("circle", params);
			return this;
		}



		public circleCSS(className:string, x:number, y:number, r:number):this
		{
			var params =
			{
				cx : x,
				cy : y,
				r : r,
				class : className
			};
			this.addElement("circle", params);
			return this;
		}



		public text(text:string, x:number, y:number, size:number = 20):this
		{
			if (!text)
				return this;

			var params =
			{
				x : x,
				y : y,
				"font-size" : size
			};
			this.fillStroke(params);
			this.fillFill(params);
			var parts = text.split("\n");
			for (var i = 0; i < parts.length; ++i)
			{
				this.addElement("text", params, parts[i]);
				params.y += size;
			}
			return this;
		}



		public textCSS(
			className:string,
			text:string,
			x:number,
			y:number,
			size?:number):this
		{
			if (!text)
				return this;

			var params =
			{
				x : x,
				y : y,
				class : className
			};
			if (size)
				params["font-size"] = size;

			var parts = text.split("\n");
			for (var i = 0; i < parts.length; ++i)
			{
				this.addElement("text", params, parts[i]);
				params.y += size;
			}
			return this;
		}



		public polygon(coordinates:number[]):this
		{
			var points = "";
			for (var i = 0; i < coordinates.length; i += 2)
				points += coordinates[i] + ',' + coordinates[i + 1] + ' ';

			var params =
			{
				points : points
			};
			this.fillFill(params);
			this.fillStroke(params);
			this.addElement("polygon", params);
			return this;
		}



		public polyLine(coordinates:number[]):this
		{
			var points = "";
			for (var i = 0; i < coordinates.length; i += 2)
				points += coordinates[i] + ',' + coordinates[i + 1] + ' ';

			var params =
			{
				fill : "none",
				points : points
			};
			this.fillStroke(params);
			this.addElement("polyline", params);
			return this;
		}



		public polyLineCSS(className:string, coordinates:number[]):this
		{
			var points = "";
			for (var i = 0; i < coordinates.length; i += 2)
				points += coordinates[i] + ',' + coordinates[i + 1] + ' ';
			var params =
			{
				"fill" : "none",
				"points" : points,
				"class" : className
			};
			this.addElement("polyline", params);
			return this;
		}



		public mouseEventBox(
			x:number, y:number, width:number, height:number,
			handler:(eventName:string) => void):SvgMaker
		{
			var tempFuncName = this.getFreeId();
			this.tempFunctionNames.push(tempFuncName);
			window[tempFuncName] = handler;
			var params =
			{
				x : x,
				y : y,
				width : width,
				height : height,
				"fill-opacity" : 0,
				onmouseover : tempFuncName + "('mouseover')",
				onmouseout : tempFuncName + "('mouseout')"
			};
			this.addElement("rect", params);
			return this;
		}



		public startGroup(name:string, className?:string):this
		{
			var params:any = {"name" : name};

			if (className !== undefined)
				params["class"] = className;

			this.addElement("g", params, null, false);
			return this;
		}



		public endGroup():this
		{
			this.content += "</g>";
			return this;
		}



		public startClipPath(id:string):this
		{
			var params:any = {id:id};
			this.addElement("defs><clipPath", params, null, false);
			return this;
		}



		public endClipPath():this
		{
			this.content += "</clipPath></defs>";
			return this;
		}



		public drawImage(
			imageUrl:string,
			x:number,
			y:number,
			w:number,
			h:number,
			params?:any):this
		{
			params = params || {};
			params["xlink:href"] = this.imageUrlPrefix + imageUrl;
			params["x"] = x + "px";
			params["y"] = y + "px";
			params["width"] = w + "px";
			params["height"] = h + "px";
			this.addElement("image", params);
			return this;
		}



		public flush():string
		{
			return this.content + '</svg>';
		}



		public flushDataUrl():string
		{
			return "data:image/svg+xml;utf8," + this.flush();
		}
	}
}

/// <reference path="../../geom/axisalignedrectangle2d.ts"/>
/// <reference path="../../graphs/svg/svggraph.ts"/>
/// <reference path="../../util/tokenizer.ts"/>



module kr3m.graphs.svg
{
	export class LineGraph extends SvgGraph
	{
		private dataRect = new kr3m.geom.AxisAlignedRectangle2d();

		private min:number;
		private max:number;

		public textScaleFactor = 1;

		public emphasizeLastValue = false;
		public emphasisLocalization = "EMPHASIS";

		public legendSizeThreshold = 4;

		public gridMode:kr3m.graphs.GRID_MODE = kr3m.graphs.GRID_MODE.NONE;
		public gridThreshold:number;

		public isInteractive = false;

		public tooltipLocalization = "TOOLTIP";
		public tooltipWidth = 100;
		public tooltipHeight = 50;



		constructor(parent:kr3m.ui.Element, width = 600, height = 400)
		{
			super(parent, width, height);
		}



		public drawLegend():void
		{
			var legend = this.getLegend();
			if (!legend)
				return;

			if (legend.length > this.legendSizeThreshold)
			{
				var legendWidth = Math.floor(this.dataRect.w / 3);
				var itemHeight = Math.floor(this.dataRect.h / legend.length);
				itemHeight = Math.min(itemHeight, 20);
				var itemWidth = Math.floor(legendWidth * 0.8);
				var itemSize = Math.floor(itemHeight * 0.8);
				this.dataRect.squeezeLeft(legendWidth);

				var x = this.dataRect.right() + legendWidth - itemWidth;
				for (var i = 0; i < legend.length; ++i)
				{
					var y = Math.floor((i + 0.5) * itemHeight);
					this.svg
						.rectangleCSS("legendDataset" + i, x, y, itemSize, itemSize)
						.textCSS("legendText" + i, kr3m.util.Util.encodeHtml(legend[i]), x + itemSize * 2, y + itemSize, itemSize);
				}
			}
			else
			{
				var legendHeight = Math.floor(this.dataRect.h / 15);
				legendHeight = Math.min(legendHeight, 30);
				var itemWidth = Math.floor(this.dataRect.w / (legend.length + 1));
				var itemSize = Math.floor(legendHeight * 0.8);
				var itemOffset = legendHeight - itemSize;
				this.dataRect.squeezeUp(legendHeight);

				var y = this.dataRect.bottom() + itemOffset;
				for (var i = 0; i < legend.length; ++i)
				{
					var x = Math.floor((i + 0.5) * itemWidth);
					this.svg
						.rectangleCSS("legendDataset" + i, x, y, itemSize, itemSize)
						.textCSS("legendText" + i, kr3m.util.Util.encodeHtml(legend[i]), x + itemSize + itemOffset, y + itemSize);
				}
			}
		}



		public getTextHeight():number
		{
			return Math.floor(this.textScaleFactor * Math.min(this.dataRect.h / 10, this.dataRect.w / 50));
		}



		public drawScale():void
		{
			var scaleWidth = Math.floor(this.dataRect.w / 10);
			this.dataRect.squeezeRight(scaleWidth);
			var textHeight = this.getTextHeight();

			this.svg
				.lineCSS("scale", this.dataRect.x, this.dataRect.y, this.dataRect.x, this.dataRect.bottom())
				.lineCSS("scale", this.dataRect.x, this.dataRect.bottom(), this.dataRect.right(), this.dataRect.bottom())
				.lineCSS("scale", this.dataRect.x, this.dataRect.y, this.dataRect.x - scaleWidth * 0.1, this.dataRect.y)
				.lineCSS("scale", this.dataRect.x, this.dataRect.bottom(), this.dataRect.x - scaleWidth * 0.1, this.dataRect.bottom())
				.textCSS("scaleCaptionMax", this.valueFormatter(this.max), this.dataRect.x - textHeight, this.dataRect.y + textHeight, textHeight)
				.textCSS("scaleCaptionMin", this.valueFormatter(this.min), this.dataRect.x - textHeight, this.dataRect.bottom(), textHeight);
		}



		public getValueX(offset:number):number
		{
			var data = this.getData();
			var w = this.dataRect.w / (data[0].length - 1);
			var x = this.dataRect.x + w * offset;
			return x;
		}



		public getValueY(value:number):number
		{
			var scaleY = (this.max > this.min) ? this.dataRect.h / (this.max - this.min) : 0;
			return this.dataRect.bottom() - (value - this.min) * scaleY;
		}



		public drawGrid():void
		{
			var data = this.getData();
			if (!data)
				return;

			var x1 = this.dataRect.x;
			var x2 = x1 + this.dataRect.w;

			if (this.gridMode == kr3m.graphs.GRID_MODE.STEPS)
			{
				var stepSize = (this.max - this.min) / this.gridSteps;
				for (var i = 0; i <= this.gridSteps; ++i)
				{
					var y = this.getValueY(this.min + i * stepSize);
					this.svg.lineCSS("gridLine", x1, y, x2, y);
				}
			}

			if (this.gridMode == kr3m.graphs.GRID_MODE.THRESHOLD)
			{
				var textHeight = this.getTextHeight();
				var y = this.getValueY(this.gridThreshold);
				this.svg
					.rectangleCSS("gridThreshold", x1, y, this.dataRect.w, this.dataRect.bottom() - y)
					.lineCSS("gridLine", x1, this.dataRect.y, x2, this.dataRect.y)
					.lineCSS("gridLine", x1, this.dataRect.bottom(), x2, this.dataRect.bottom())
					.lineCSS("gridLine", x1, y, x2, y)
					.textCSS("scaleCaptionThreshold", this.valueFormatter(this.gridThreshold), x1 - textHeight, y, textHeight);
			}
		}



		public prepareDataDrawing():void
		{
			if (this.emphasizeLastValue)
				this.dataRect.squeezeLeft(50);
		}



		public drawData():void
		{
			var data = this.getData();
			if (!data)
				return;

			var offsetX = this.dataRect.x;
			var offsetY = this.dataRect.bottom();

			var textHeight = this.getTextHeight();

			for (var i = 0; i < data.length; ++i)
			{
				var scaleX = this.dataRect.w / (data[i].length - 1);

				var points:number[] = [];
				for (var j = 0; j < data[i].length; ++j)
				{
					var px = offsetX + j * scaleX;
					var py = this.getValueY(data[i][j]);

					points.push(px);
					points.push(py);
				}
				this.svg.polyLineCSS("dataset" + i, points);

				if (this.emphasizeLastValue)
				{
					this.svg.circleCSS("emphasis" + i, px, py, textHeight * 0.7);
					if (data[i][data[i].length - 1] > (this.max + this.min) / 2)
						this.svg.textCSS("emphasisCaption" + i, this.emphasisLocalization, px, py + textHeight + textHeight, textHeight);
					else
						this.svg.textCSS("emphasisCaption" + i, this.emphasisLocalization, px, py - textHeight - 2 * textHeight, textHeight);
				}
			}
		}



		private drawHoverTriggers():void
		{
			var data = this.getData();
			var w = this.dataRect.w / (data[0].length - 1);
			for (var i = 0; i < data[0].length; ++i)
			{
				var x = this.getValueX(i) - w * 0.5;
				this.svg.mouseEventBox(x, this.dataRect.y, w, this.dataRect.h, this.onMouseTooltip.bind(this, i));
			}
		}



		private getTooltipText(dataset:number, offset:number):string
		{
			var data = this.getData();
			if (!data)
				return "NO DATA";

			var columnNames = this.getColumnNames();

			var tokens =
			{
				VALUE: this.valueFormatter(data[dataset][offset]),
				COL: columnNames ? columnNames[offset] : offset.toString()
			};
			return tokenize(this.tooltipLocalization, tokens);
		}



		private drawToolTips():void
		{
			var data = this.getData();
			var y = this.dataRect.bottom() - this.tooltipHeight;
			var h = this.tooltipHeight;

			var tts = this.getTextHeight();
			var ttp = tts / 2;

			var d = this.tooltipHeight / 3;
			var shift = d / Math.sqrt(2);

			for (var i = 0; i < data[0].length; ++i)
			{
				var x = this.getValueX(i + 1) + 2;
				var points:number[];
				if (i > data[0].length / 2)
				{
					x -= 2 * (2 + shift) + this.tooltipWidth;
					points = [x + this.tooltipWidth - 1, y + d, x + this.tooltipWidth - 1, y + 2 * d, x  + this.tooltipWidth + shift, y + 1.5 * d];
				}
				else
				{
					points = [x + 1, y + d, x + 1, y + 2 * d, x - shift, y + 1.5 * d];
				}

				this.svg
					.startGroup("tooltip" + i, "tooltip")
					.rectangleCSS("background", x, y, this.tooltipWidth, h)
					.polyLineCSS("background", points)
					.textCSS("caption", this.getTooltipText(0, i), x + ttp, y + ttp + tts, tts)
					.endGroup();
			}
		}



		private addInteractivityFront():void
		{
			var data = this.getData();
			if (!data || !this.isInteractive)
				return;
//# CLIENT
			this.drawToolTips();
			this.drawHoverTriggers();
//# /CLIENT
//# !CLIENT
			//# TODO: interactivity doesn't work yet for server generated graphs
//# /!CLIENT
		}



		private drawHoverHighlight():void
		{
			var data = this.getData();
			for (var i = 0; i < data[0].length; ++i)
			{
				var x = this.getValueX(i);
				this.svg
					.startGroup("tooltip" + i, "highlight")
					.rectangleCSS("", x - 1, this.dataRect.y, 2, this.dataRect.h)
					.endGroup();
			}
		}



		private addInteractivityBack():void
		{
			var data = this.getData();
			if (!data || !this.isInteractive)
				return;

//# CLIENT
			this.drawHoverHighlight();
//# /CLIENT
//# !CLIENT
			//# TODO: interactivity doesn't work yet for server generated graphs
//# /!CLIENT
		}



		private onMouseTooltip(index:number, eventName:string):void
		{
			var data = this.getData();
			if (!data)
				return;

			var tooltipDom = this.dom.find("[name='tooltip" + index + "']");
			tooltipDom.attr("style", (eventName == "mouseover") ? "visibility:visible" : "visibility:hidden");
		}



		private prepareDrawing():void
		{
			var data = this.getData();

			var padding = 3;

			this.dataRect.x = padding;
			this.dataRect.y = padding;
			this.dataRect.w = this.svg.getWidth() - 2 * padding;
			this.dataRect.h = this.svg.getHeight() - 2 * padding;

			this.min = Infinity;
			this.max = -Infinity;
			for (var i = 0; i < data.length; ++i)
			{
				for (var j = 0; j < data[i].length; ++j)
				{
					if (data[i][j] > this.max)
						this.max = data[i][j];
					if (data[i][j] < this.min)
						this.min = data[i][j];
				}
			}
			this.min = getNiceMinimum(this.min, this.max, this.gridSteps);
			this.max = getNiceMaximum(this.min, this.max, this.gridSteps);
		}



		public validData():boolean
		{
			var data = this.getData();
			if (data.length < 1 || data[0].length < 2)
				return false;

			var first = data[0][0];
			for (var i = 0; i < data.length; ++i)
			{
				for (var j = 0; j < data[i].length; ++j)
				{
					if (data[i][j] != first)
						return true;
				}
			}
			return false;
		}



		public update():void
		{
			if (!this.validData())
				return;

			this.prepareDrawing();
			this.clear();

			this.drawLegend();
			this.drawScale();
			this.drawGrid();

			//# TODO: draw column names if given and interactivity is off

			this.prepareDataDrawing();
			this.addInteractivityBack();
			this.drawData();
			this.addInteractivityFront();

			super.update();
		}



		public flush():string
		{
			this.update();
			return this.svg.flush();
		}
	}
}

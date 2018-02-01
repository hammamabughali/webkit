/// <reference path="../../graphs/ascii/abstract.ts"/>



//# EXPERIMENTAL
module kr3m.graphs.ascii
{
	export class Bars extends Abstract
	{
		public maxValue:number;



		public log():void
		{
			var canvas = new TextCanvas(this.width, this.height);

			var graphY = 1;
			var graphH = this.height - 2;
			var blocks = this.data[0].length;
			var blockWidth = Math.floor(this.width / blocks);
			var legendY = this.height - this.legend.length;
			graphH -= this.legend.length;
			var maxValue = this.maxValue;
			if (maxValue === undefined)
			{
				maxValue = this.data[0][0];
				for (var y = 0; y < this.data.length; ++y)
				{
					for (var x = 0; x < this.data[y].length; ++x)
						maxValue = Math.max(maxValue, this.data[y][x]);
				}
			}

			canvas
				.box(0, 0, blocks * blockWidth, 1)
				.text(0, 0, this.formatter(maxValue) + " ")
				.box(0, legendY - 1, blocks * blockWidth, 1)
				.text(0, legendY - 1, this.formatter(0) + " ");

			for (var y = 0; y < this.data.length; ++y)
			{
				canvas.setColor(this.colors[y % this.colors.length]);
				for (var x = 0; x < this.data[y].length; ++x)
				{
					var f = this.data[y][x] / maxValue;
					var outX = x * blockWidth + 1;
					var outW = blockWidth - 2;
					var outH = Math.round(graphH * f);
					var outY = graphY + graphH - outH;
					canvas.box(outX, outY, outW, outH);
				}
			}

			for (var y = 0; y < this.legend.length; ++y)
			{
				canvas.setColor(this.colors[y % this.colors.length]);
				for (var x = 0; x < this.legend[y].length; ++x)
				{
					var outX = x * blockWidth + Math.floor((blockWidth - this.legend[y][x].length) / 2);
					var outY = legendY + y;
					canvas.text(outX, outY, this.legend[y][x]);
				}
			}

			canvas.log();
		}
	}
}
//# /EXPERIMENTAL

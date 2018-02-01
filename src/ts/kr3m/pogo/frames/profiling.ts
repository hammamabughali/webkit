/// <reference path="../../pogo/frame.ts"/>
/// <reference path="../../pogo/frames/bitmapfont.ts"/>
/// <reference path="../../util/json.ts"/>



//# PROFILING
module pogo.frames
{
	export interface ProfilingOptions extends pogo.FrameOptions
	{
	}



	export class Profiling extends pogo.Frame
	{
		protected options:ProfilingOptions;

		private driverInfo = "";
		private text:pogo.frames.BitmapFont;
		private averages:{[name:string]:number} = {};



		constructor(
			parentOrCanvas:pogo.Canvas|pogo.Entity2d,
			options?:ProfilingOptions)
		{
			super(parentOrCanvas, options);
			this.initDriverInfo();
			this.text = new pogo.frames.BitmapFont(parentOrCanvas,
			{
				width : this.options.width,
				height : this.options.height,
				fontUrl : "fonts/small.fnt",
				text : this.driverInfo,
				priority : this.options.priority || -10
			});
			this.text.overflowX = true;
			this.text.overflowY = true;
			this.text.wordWrap = false;
		}



		private initDriverInfo():void
		{
			var gl = this.canvas.getGL();
			var keys = ["VENDOR", "VERSION", "SHADING_LANGUAGE_VERSION"];
			for (var i = 0; i < keys.length; ++i)
				this.driverInfo += keys[i] + ": " + gl.getParameter(gl[keys[i]]) + "\n";
		}



		public update(data:pogo.TickData):void
		{
			super.update(data);

			for (var i in this.canvas.profile)
			{
				this.averages[i] = ((this.averages[i] || 0) * 10 + this.canvas.profile[i]) / 11;
				this.canvas.profile[i] = 0;
			}

			this.averages["fps"] = ((this.averages["fps"] || 0) * 60 + 1 / data.delta) / 61;

			var text = this.driverInfo;
			for (var i in this.averages)
				text += i + " = " + this.averages[i].toFixed(1) + "\n";
			this.text.setText(text);
		}
	}
}
//# /PROFILING

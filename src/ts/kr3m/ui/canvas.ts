/// <reference path="../ui/element.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.ui
{
	export class Canvas extends kr3m.ui.Element
	{
		protected canvas:any;

		protected width:number;
		protected height:number;

		private adjustWidth = false;
		private adjustHeight = false;
		private isFullScreen = false;

		private isListening = false;
		private frameListeners:Array<(delta:number) => void> = [];
		private nextFrameListeners:Array<(delta:number) => void> = [];
		private lastFrameTime:number;
		private isFrameRenderingPaused = false;



		/*
			If width and / or height are set to 0 the Canvas object will
			automatically alter its size to fill its parent element's
			width and / or height 100%.
		*/
		constructor(parent:kr3m.ui.Element, width:number = 640, height:number = 480, attributes:any = {})
		{
			super();

			this.width = width;
			this.adjustWidth = width <= 0;
			if (!this.adjustWidth)
				attributes.width = width;

			this.height = height;
			this.adjustHeight = height <= 0;
			if (!this.adjustHeight)
				attributes.height = height;

			attributes.id = attributes.id || kr3m.ui.Element.getFreeId();

			super(parent, null, "canvas", attributes);
			if (!parent)
			{
				$("body").append(this.dom);
				this.dom.hide();
			}

			this.canvas = document.getElementById(attributes.id);
			this.checkSize();
		}



		public setSize(width:number, height:number):void
		{
			if (this.width != width)
			{
				this.width = width;
				this.adjustWidth = width <= 0;
				if (!this.adjustWidth)
					this.setAttribute("width", width);
			}

			if (this.height != height)
			{
				this.height = height;
				this.adjustHeight = height <= 0;
				if (!this.adjustHeight)
					this.setAttribute("height", height);
			}
		}



		public getSize():[number, number]
		{
			return [this.width, this.height];
		}



		protected onCanvasSize():void
		{
			this.setAttribute("width", this.width);
			this.setAttribute("height", this.height);
		}



		public getNaturalWidth():number
		{
			return this.getWidth() || kr3m.util.StringEx.parseIntSafe(this.getAttribute("width"));
		}



		public getNaturalHeight():number
		{
			return this.getHeight() || kr3m.util.StringEx.parseIntSafe(this.getAttribute("height"));
		}



		protected checkSize():void
		{
			var isFs = this.isInFullScreen();

			if (!this.parent)
				return;

			var changed = false;

			var par = this.parent.dom.get(0);
			var win = $(window);

			if (this.adjustWidth)
			{
				var width = isFs ? win.width() : par.clientWidth;
				if (width != this.width)
				{
					this.width = width;
					changed = true;
				}
			}
			if (this.adjustHeight)
			{
				var height = isFs ? win.height() : par.clientHeight;
				if (height != this.height)
				{
					this.height = height;
					changed = true;
				}
			}
			if (changed)
				this.onCanvasSize();
		}



		public onFrame(listener:(delta:number) => void):void
		{
			this.frameListeners.push(listener);
			this.listen();
		}



		public onNextFrame(listener:(delta:number) => void):void
		{
			this.nextFrameListeners.push(listener);
			this.listen();
		}



		public pauseFrameRendering():void
		{
			this.isFrameRenderingPaused = true;
		}



		public resumeFrameRendering():void
		{
			this.isFrameRenderingPaused = false;
		}



		protected listen():void
		{
			if (this.isListening)
				return;

			this.isListening = true;

			var requestFunc = window.requestAnimationFrame || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"];
			requestFunc = requestFunc || function(callback:Function) { setTimeout(callback, 1000 / 60); };

			this.lastFrameTime = Date.now();

			var tick = () =>
			{
				this.checkSize();

				var now = Date.now();
				var delta = (now - this.lastFrameTime) / 1000;
				this.lastFrameTime = now;

				if (!this.isFrameRenderingPaused)
				{
					var nextListeners = this.nextFrameListeners;
					this.nextFrameListeners = [];

					for (var i = 0; i < nextListeners.length; ++i)
						nextListeners[i](delta);

					for (var i = 0; i < this.frameListeners.length; ++i)
						this.frameListeners[i](delta);
				}

				requestFunc(tick);
			};

			requestFunc(tick);
		}



		public getDataUrl(mimeType:string = "image/png"):string
		{
			return this.canvas.toDataURL(mimeType);
		}
	}
}

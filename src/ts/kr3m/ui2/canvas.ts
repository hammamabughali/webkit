/// <reference path="../model/eventdispatcher.ts"/>
/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface CanvasOptions extends ElementOptions
	{
		width?:number; // fixed width (in pixels) for the canvas' content (not necessarily the element's width)
		height?:number; // fixed height (in pixels) for the canvas' content (not necessarily the element's height)
		autoSize?:boolean; // whether to automatically adjust the content's (render-)size to the element's size
	}



	export class Canvas extends Element
	{
		public static readonly EVENT_FRAME = "frame";
		public static readonly EVENT_SIZE = "size";

		private isTicking = false;
		private lastFrameTime:number;
		private isFrameRenderingPaused = false;
		private delta = 0;
		private eventDispatcher = new kr3m.model.EventDispatcher();

		protected options:CanvasOptions;

		protected width = -1;
		protected height = -1;
		protected oldWidth = -1;
		protected oldHeight = -1;

		protected dom:HTMLCanvasElement;



		constructor(parentNode:ParentTypes, options?:CanvasOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "canvas"}));

			if (this.options.width)
				this.width = this.options.width;

			if (this.options.height)
				this.height = this.options.height;

			this.checkSize();
		}



		public getDomElement():HTMLCanvasElement
		{
			return this.dom;
		}



		public setSize(width:number, height:number):void
		{
			this.width = width;
			this.height = height;
			this.options.autoSize = false;
			this.checkSize();
		}



		public getWidth():number
		{
			return parseInt(this.getAttribute("width"), 10);
		}



		public getHeight():number
		{
			return parseInt(this.getAttribute("height"), 10);
		}



		public getDelta():number
		{
			return this.delta;
		}



		protected checkSize():void
		{
			if (this.options.autoSize)
			{
				var rect = this.dom.getBoundingClientRect();
				this.width = rect.width;
				this.height = rect.height;
			}

			if (this.width != this.oldWidth || this.height != this.oldHeight)
			{
				this.setAttribute("width", this.width);
				this.setAttribute("height", this.height);
				this.eventDispatcher.dispatch(Canvas.EVENT_SIZE);
			}

			this.oldWidth = this.width;
			this.oldHeight = this.height;
		}



		protected startTicking():void
		{
			if (this.isTicking)
				return;

			this.isTicking = true;

			var requestFunc = window.requestAnimationFrame || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"];
			requestFunc = requestFunc || function(callback:Function) { setTimeout(callback, 1000 / 30); };

			this.lastFrameTime = Date.now();

			var tick = () =>
			{
				this.checkSize();

				var now = Date.now();
				this.delta = (now - this.lastFrameTime) / 1000;
				this.lastFrameTime = now;

				if (!this.isFrameRenderingPaused)
					this.eventDispatcher.dispatch(Canvas.EVENT_FRAME);

				requestFunc(tick);
			};

			requestFunc(tick);
		}



		public on(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			if (eventName == Canvas.EVENT_FRAME)
			{
				this.eventDispatcher.on(eventName, <any> listener);
				this.startTicking();
			}
			else if (eventName == Canvas.EVENT_SIZE)
			{
				this.eventDispatcher.on(eventName, <any> listener);
			}
			else
			{
				super.on(eventName, listener);
			}
		}



		public once(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			if (eventName == Canvas.EVENT_FRAME)
			{
				this.eventDispatcher.once(eventName, <any> listener);
				this.startTicking();
			}
			else if (eventName == Canvas.EVENT_SIZE)
			{
				this.eventDispatcher.once(eventName, <any> listener);
			}
			else
			{
				super.on(eventName, listener);
			}
		}



		public off(
			eventName:string,
			listener:EventListenerOrEventListenerObject):void
		{
			if (eventName == Canvas.EVENT_FRAME || eventName == Canvas.EVENT_SIZE)
				this.eventDispatcher.off(<any> listener);
			else
				super.off(eventName, listener);
		}



		public pauseFrameRendering():void
		{
			this.isFrameRenderingPaused = true;
		}



		public resumeFrameRendering():void
		{
			this.isFrameRenderingPaused = false;
		}



		/*
			Takes a screenshot of the current content and saves it as
			an image of the given mimeType. Then it returns a data
			URL of that image. This can then be used to display the
			image in another element or to download it from the
			browser.
		*/
		public getContentDataUrl(mimeType = "image/png"):string
		{
			return this.dom.toDataURL(mimeType);
		}
	}
}

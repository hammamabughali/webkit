/// <reference path="../ui2/element.ts"/>
/// <reference path="../util/usermedia.ts"/>



module kr3m.ui2
{
	export interface VideoOptions extends ElementOptions
	{
		src?:string;
		autoplay?:boolean;
	}



	/*
		See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
	*/
	export class Video extends Element
	{
		protected options:VideoOptions;

		protected dom:HTMLVideoElement;
		protected captureCanvas:HTMLCanvasElement;



		constructor(parentNode:ParentTypes, options?:VideoOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "video"}));
			this.initOptionsAttributes("src", "autoplay");
		}



		public setSrc(src:string):void
		{
			this.setAttribute("src", src);
		}



		public setUrl(url:string):void
		{
			this.setSrc(url);
		}



		public getSrc():string
		{
			return this.getAttribute("src");
		}



		public getUrl():string
		{
			return this.getSrc();
		}



		public getDomElement():HTMLVideoElement
		{
			return this.dom;
		}



		public showWebCamFeed(
			playAudio = false,
			callback?:SuccessCallback):void
		{
			var um = kr3m.util.UserMedia.getInstance();
			um.feedCameraIntoVideo(this.dom, playAudio, callback);
		}



		public getNaturalWidth():number
		{
			return this.dom.videoWidth;
		}



		public getNaturalHeight():number
		{
			return this.dom.videoHeight;
		}



		public takeScreenShot(
			callback:(dataUrl:string) => void,
			mimeType = "image/jpeg"):void
		{
			if (!this.captureCanvas)
			{
				this.captureCanvas = document.createElement("canvas");
				this.captureCanvas.width = this.getNaturalWidth();
				this.captureCanvas.height = this.getNaturalHeight();
			}

			var context = this.captureCanvas.getContext("2d");
			context.drawImage(this.dom, 0, 0);

			var result = this.captureCanvas.toDataURL(mimeType);
			callback(result);
		}
	}
}

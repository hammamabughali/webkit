/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface ImgOptions extends ElementOptions
	{
		src?:string;
		caption?:string;
		title?:string;
		alt?:string;
	}



	export class Img extends Element
	{
		protected options:ImgOptions;

		protected dom:HTMLImageElement;



		constructor(parentNode:ParentTypes, options?:ImgOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "img"}));
			this.initOptionsAttributes("src", "alt", "title");

			if (this.options.caption)
			{
				this.setAttribute("title", this.options.title || this.options.caption);
				this.setAttribute("alt", this.options.alt || this.options.caption);
			}
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



		public getNaturalWidth():number
		{
			return this.dom.naturalWidth;
		}



		public getNaturalHeight():number
		{
			return this.dom.naturalHeight;
		}
	}
}

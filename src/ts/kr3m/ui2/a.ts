/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export interface AOptions extends ElementOptions
	{
		caption?:string;
		download?:boolean|string;
		href?:string;
		target?:string;
	}



	export class A extends Element
	{
		protected options:AOptions;



		constructor(parentNode:ParentTypes, options?:AOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "a"}));
			this.initOptionsAttributes("href", "target", "download");

			if (this.options.caption)
				this.setHtml(this.options.caption);
		}



		public setTarget(target:string):void
		{
			this.setAttribute("target", target);
		}



		public setUrl(url:string):void
		{
			this.setAttribute("href", url);
		}



		public setHref(url:string):void
		{
			this.setUrl(url);
		}
	}
}

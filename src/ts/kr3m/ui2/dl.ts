/// <reference path="../ui2/dd.ts"/>
/// <reference path="../ui2/dt.ts"/>
/// <reference path="../ui2/element.ts"/>



module kr3m.ui2
{
	export class Dl extends Element
	{
		constructor(parentNode:ParentTypes, options?:ElementOptions)
		{
			super(parentNode, kr3m.util.Util.mergeAssoc(options, {tagName : "dl"}));
		}



		public addTitle(html?:string):Dt
		{
			var dt = new Dt(this);
			if (html)
				dt.setHtml(html);
			return dt;
		}



		public addDefinition(html?:string):Dd
		{
			var dd = new Dd(this);
			if (html)
				dd.setHtml(html);
			return dd;
		}



		public addContent(content:{[title:string]:{toString:() => string}}):void
		{
			for (var title in content)
			{
				this.addTitle(title);
				this.addDefinition(content[title].toString());
			}
		}
	}
}

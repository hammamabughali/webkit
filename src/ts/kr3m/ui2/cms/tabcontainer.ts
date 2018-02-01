/// <reference path="../../ui2/a.ts"/>
/// <reference path="../../ui2/cms/css.ts"/>
/// <reference path="../../ui2/ex/screenmanager.ts"/>



module kr3m.ui2.cms
{
	export class TabContainer extends kr3m.ui2.ex.ScreenManager
	{
		protected tabs:kr3m.ui2.A[] = [];



		constructor(parentNode:HTMLElement|Element, options?:ElementOptions)
		{
			super(parentNode, options);
			this.addClass("tabContainer");
		}



		public addTabs(tabNames:{[link:string]:string}):void
		{
			for (var link in tabNames)
			{
				var a = new kr3m.ui2.A(null, {caption : tabNames[link], href : "#" + link, classes : "tab"});
				this.parentElement.insertBefore(a, this);
				this.tabs.push(a);
			}
		}



		public showScreen(name:string, data?:any):void
		{
			super.showScreen(name, data);
			for (var i = 0; i < this.tabs.length; ++i)
			{
				//# FIXME: this is extremely bad for more complex layouts - move tabs into tabcontainer itself
				if (this.tabs[i].getAttribute("href") == "#" + name)
					this.tabs[i].addClass("selected");
				else
					this.tabs[i].removeClass("selected");
			}
		}
	}
}

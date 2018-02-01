/// <reference path="../../ui2/div.ts"/>
/// <reference path="../../ui2/ex/screen.ts"/>



module kr3m.ui2.ex
{
	export class ScreenManager extends kr3m.ui2.Div
	{
		constructor(parentNode:HTMLElement|Element, options?:ElementOptions)
		{
			super(parentNode, options);
			this.addClass("screenManager");
		}



		public addScreen(
			name:string,
			options?:kr3m.ui2.ElementOptions):Screen
		{
			options = options || <kr3m.ui2.ElementOptions> {};
			options.name = name;
			return new Screen(this, options);
		}



		public hasScreen(name:string):boolean
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i].getName() == name)
					return true;
			}
			return false;
		}



		public showScreen(name:string, data?:any):void
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof Screen)
				{
					var screen = <Screen> this.children[i];
					if (screen.getName() == name)
					{
						if (screen.firstRefresh)
							screen.refreshInit(data);
						screen.refresh(data);
						screen.firstRefresh = false;
						screen.show();
					}
					else if (screen.isVisible())
					{
						screen.hide();
					}
				}
			}
		}
	}
}

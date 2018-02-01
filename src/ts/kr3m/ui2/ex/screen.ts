/// <reference path="../../ui2/div.ts"/>
/// <reference path="../../ui2/ex/screenmanager.ts"/>



module kr3m.ui2.ex
{
	export class Screen extends kr3m.ui2.Div
	{
		public firstRefresh = true;

		protected parentElement:ScreenManager;



		constructor(
			manager:ScreenManager,
			options:kr3m.ui2.ElementOptions)
		{
			super(manager, options);
			this.addClass("screen");
		}



		protected transitionIn(
			callback?:Callback):void
		{
			callback && callback();
		}



		public refreshInit(data?:any):void
		{
			// overwritten in derived classes
		}



		public refresh(data?:any):void
		{
			// overwritten in derived classes
		}



		public show():void
		{
			super.show();
			this.transitionIn();
		}



		protected transitionOut(
			callback?:Callback):void
		{
			callback && callback();
		}



		public hide():void
		{
			this.transitionOut(() => super.hide());
		}
	}
}

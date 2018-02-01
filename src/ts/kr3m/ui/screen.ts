/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/screenmanager.ts"/>



module kr3m.ui
{
	export class Screen extends kr3m.ui.Element
	{
		private name:string;
		private firstTransition = true;



		constructor(parent:kr3m.ui.ScreenManager, name:string, attributes:Object = {"class":"screen"})
		{
			super(parent, null, "div", attributes);
			this.name = name;
		}



		public getTrackingPart():string
		{
			return this.name;
		}



		public getName():string
		{
			return this.name;
		}



		public setName(name:string):void
		{
			this.name = name;
		}



		public show():void
		{
			if (this.firstTransition)
			{
				this.dom.show();
				this.firstTransition = false;
			}
			else
			{
				this.transitionIn();
			}
		}



		public transitionIn():void
		{
			this.dom.show();
			this.onTransitionInComplete();
		}



		public onTransitionInComplete():void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		public hide():void
		{
			if (this.firstTransition)
			{
				this.dom.hide();
				this.firstTransition = false;
			}
			else
			{
				if (this.isVisible())
					this.transitionOut();
				else
					this.dom.hide();
			}
		}



		public transitionOut():void
		{
			this.dom.hide();
			this.onTransitionOutComplete();
		}



		public onTransitionOutComplete():void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		public getManager():kr3m.ui.ScreenManager
		{
			return <kr3m.ui.ScreenManager> this.parent;
		}



		/*
			Wird vor dem erten onRefresh() aufgerufen.
		*/
		public onInitialRefresh(data?:any):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		/*
			Wird vor jedem show() aufgerufen oder wenn sich
			Deeplinking-Parameter ändern.
		*/
		public onRefresh(data?:any):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		/*
			Bequemlichkeitsfunktion, um nicht immer
				this.getManager().showScreenRecursive(screenName, data)
			schreiben zu müssen.
		*/
		public showScreen(screenName:string, data?:any):void
		{
			var manager = this.getManager();
			if (manager)
				manager.showScreenRecursive(screenName, data);
		}
	}
}

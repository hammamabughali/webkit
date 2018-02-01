/// <reference path="../ui/button.ts"/>
/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	//# FIXME: NYI
	export class Carousel extends kr3m.ui.Element
	{
		private paneContainer:kr3m.ui.Element;
		private buttonContainer:kr3m.ui.Element;

		private transitionDelay:number = 5000;
		private timer:number;



		constructor(parent:any, width:number, height:number)
		{
			super(parent, null, "div");
			this.addClass("carousel");
			this.callOnStage(() =>
			{
				this.paneContainer = new kr3m.ui.Element(null, null, "div", {"class":"paneContainer", style:"width:" + width + "px; height:" + height + "px; overflow:hidden; position:relative;"});
				super.addChild(this.paneContainer);
				this.buttonContainer = new kr3m.ui.Element(null, null, "div", {"class":"buttonContainer"});
				super.addChild(this.buttonContainer);

				this.startTransitionTimer();
			});
		}



		private startTransitionTimer():void
		{
			this.timer = setTimeout(this.showNext.bind(this), this.transitionDelay);
		}



		private showNext():void
		{
			//# FIXME: NYI
		}



		public addChild(child:kr3m.ui.Element):void
		{
			this.paneContainer.addChild(child);
			child.dom.css({position:"absolute", top:0, left:0});
			var button = new kr3m.ui.Button(this.buttonContainer, "", "carouselButton", this.onNavButtonClicked.bind(this));
		}



		private onNavButtonClicked():void
		{
			//# FIXME: NYI onNavButtonClicked
			log("onNavButtonClicked");
		}
	}
}

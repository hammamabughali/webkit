/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	export class Button extends kr3m.ui.Element
	{
		private handler:(event?:JQueryEventObject) => void;



		constructor(
			parent:kr3m.ui.Element,
			caption:string = "",
			className:string = "",
			handler:() => void = null)
		{
			super(parent, null, "div", {tabindex:"0"});
			this.callOnStage(() =>
			{
				if (caption != "")
					this.setHtml(caption);

				if (className != "")
					this.addClass(className);

				this.handler = handler;
				this.on("click", (event?:JQueryEventObject) =>
				{
					if (this.handler && this.isEnabled())
						this.handler(event);
				});

				if (!this.getAttribute("tabindex"))
					this.setAttribute("tabindex", "0");
			});
		}



		public setText(text:string):void
		{
			this.dom.text(text);
		}



		public setHtml(html:string):void
		{
			this.dom.html(html);
		}



		public select():void
		{
			this.addClass("selected");
		}



		public deselect():void
		{
			this.removeClass("selected");
		}



		public setSelected(selected:boolean):void
		{
			if (selected)
				this.select();
			else
				this.deselect();
		}



		public isSelected():boolean
		{
			return this.hasClass("selected");
		}



		/*
			Legt eine Funktion fest, die immer aufgerufen wird,
			wenn der User den Knopf klickt. Um die Funktion wieder
			zu entfernen, einfach mit null als handler aufrufen.
		*/
		public setClickHandler(handler:(event?:JQueryEventObject) => void):void
		{
			this.handler = handler;
		}
	}
}

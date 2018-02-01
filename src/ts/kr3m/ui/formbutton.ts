/// <reference path="../ui/element.ts"/>



module kr3m.ui
{
	/*
		Normaler HTML Button - in den meisten Fällen ist
		es besser, kr3m.ui.Button statt diesem hier
		zu verwenden - außer wenn es schnell gehen muß oder
		der Button in einem Formular verwendet werden soll
		und entsprechende Funktionalitäten mit sich bringen
		soll.
	*/
	export class FormButton extends kr3m.ui.Element
	{
		private handler:() => void;



		constructor(parent:kr3m.ui.Element, caption?:string, handler?:() => void)
		{
			super(parent, null, "button");
			this.callOnStage(() =>
			{
				if (caption)
					this.setText(caption);

				this.handler = handler;
				this.on("click", () =>
				{
					if (this.handler && this.isEnabled())
						this.handler();
				});
			});
		}



		public setText(text:string):void
		{
			this.dom.text(text);
		}



		public setClickHandler(handler:() => void):void
		{
			this.handler = handler;
		}
	}
}

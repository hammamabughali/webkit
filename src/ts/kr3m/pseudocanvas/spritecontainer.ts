/// <reference path="../ui/element.ts"/>



module kr3m.pseudocanvas
{
	export class SpriteContainer extends kr3m.ui.Element
	{
		constructor(parent)
		{
			super(parent, null, 'div');
		}



		public updateStyles():void
		{
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof kr3m.pseudocanvas.SpriteContainer)
				{
					var child = <kr3m.pseudocanvas.SpriteContainer> this.children[i];
					child.updateStyles();
				}
			}
		}



		public dispatchEnterFrame(passedTime:number):void
		{
			this.onEnterFrame(passedTime);
			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.children[i] instanceof kr3m.pseudocanvas.SpriteContainer)
				{
					var child = <kr3m.pseudocanvas.SpriteContainer> this.children[i];
					child.dispatchEnterFrame(passedTime);
				}
			}
		}



		public onEnterFrame(passedTime:number):void
		{
			//nichts machen, wird in abgeleiteten Klassen überschrieben
		}
	}
}

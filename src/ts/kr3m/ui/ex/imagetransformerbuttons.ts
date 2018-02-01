/// <reference path="../../ui/ex/imagetransformerabstract.ts"/>
/// <reference path="../../ui/formbutton.ts"/>



module kr3m.ui.ex
{
	export class ImageTransformerButtons extends ImageTransformerAbstract
	{
		private buttons:kr3m.ui.Element;

		public moveDeltaX = 10;
		public moveDeltaY = 10;
		public zoomFactor = 1.25;
		public rotateDelta = 5;



		constructor(
			parent:kr3m.ui.Element,
			width:number, height:number)
		{
			super(parent, width, height);
			this.addClass("imageTransformer");

			this.buttons = new kr3m.ui.Element(this);
			this.buttons.addClass("buttons");

			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_MOVE_LEFT"), () => this.move(-this.moveDeltaX, 0)).addClass("moveLeft");
			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_MOVE_UP"), () => this.move(0, -this.moveDeltaY)).addClass("moveUp");
			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_MOVE_RIGHT"), () => this.move(this.moveDeltaX, 0)).addClass("moveRight");
			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_MOVE_DOWN"), () => this.move(0, this.moveDeltaY)).addClass("moveDown");

			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_ZOOM_IN"), () => this.zoom(this.zoomFactor)).addClass("zoomIn");
			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_ZOOM_OUT"), () => this.zoom(1 / this.zoomFactor)).addClass("zoomOut");

			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_ROTATE_CCW"), () => this.rotate(-this.rotateDelta)).addClass("rotateCcw");
			new kr3m.ui.FormButton(this.buttons, loc("BUTTON_ROTATE_CW"), () => this.rotate(this.rotateDelta)).addClass("rotateCw");
		}



		public setLocked(locked:boolean):void
		{
			this.buttons.setVisible(!locked);
		}



		private move(deltaX:number, deltaY:number):void
		{
			this.matrix.translate(deltaX, deltaY);
			this.draw();
		}



		private zoom(factor:number):void
		{
			var x = this.canvas.getNaturalWidth() / 2;
			var y = this.canvas.getNaturalHeight() / 2;
			this.matrix.scaleFrom(factor, x, y);
			this.draw();
		}



		private rotate(angle:number):void
		{
			var x = this.canvas.getNaturalWidth() / 2;
			var y = this.canvas.getNaturalHeight() / 2;
			this.matrix.rotateAround(angle, x, y);
			this.draw();
		}
	}
}

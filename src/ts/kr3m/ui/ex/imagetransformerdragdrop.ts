/// <reference path="../../ui/ex/imagetransformerabstract.ts"/>
/// <reference path="../../ui/ex/radiobutton.ts"/>
/// <reference path="../../ui/formbutton.ts"/>



module kr3m.ui.ex
{
	export class ImageTransformerDragDrop extends ImageTransformerAbstract
	{
		private deltaMatrix:kr3m.math.Matrix2x3;

		private translateRadio:kr3m.ui.ex.RadioButton;
		private rotateRadio:kr3m.ui.ex.RadioButton;
		private scaleRadio:kr3m.ui.ex.RadioButton;

		private dragging = false;
		private startX = 0;
		private startY = 0;
		private mode = "TRANSLATE";



		constructor(
			parent:kr3m.ui.Element,
			width:number, height:number,
			source:kr3m.ui.Image|string)
		{
			super(parent, width, height, source);

			this.canvas.css("cursor", "move");

			this.canvas.on("mousedown", this.startDrag.bind(this));
			this.canvas.on("mouseup", this.endDrag.bind(this));
			this.canvas.on("mousemove", this.drag.bind(this));

			this.translateRadio = new kr3m.ui.ex.RadioButton(this, "transformMode", loc("TRANSLATE"), "transformRadio translate");
			this.translateRadio.on("change", this.changeMode.bind(this, "TRANSLATE"));
			this.rotateRadio = new kr3m.ui.ex.RadioButton(this, "transformMode", loc("ROTATE"), "transformRadio rotate");
			this.rotateRadio.on("change", this.changeMode.bind(this, "ROTATE"));
			this.scaleRadio = new kr3m.ui.ex.RadioButton(this, "transformMode", loc("SCALE"), "transformRadio scale");
			this.scaleRadio.on("change", this.changeMode.bind(this, "SCALE"));
		}



		private changeMode(mode:string):void
		{
			this.mode = mode;
			this.dragging = false;
		}



		private startDrag(evt:any):void
		{
			var x = evt.offsetX;
			var y = evt.offsetY;
			this.deltaMatrix = this.matrix.clone();
			this.startX = x;
			this.startY = y;
			this.dragging = true;
		}



		private drag(evt:any):void
		{
			if (!this.dragging)
				return;

			var x = evt.offsetX;
			var y = evt.offsetY;
			var dx = x - this.startX;
			var dy = y - this.startY;

			this.deltaMatrix.setFrom(this.matrix);

			switch (this.mode)
			{
				case "TRANSLATE":
					this.deltaMatrix.translate(x - this.startX, y - this.startY);
					break;

				case "ROTATE":
					var angle = kr3m.math.RAD_2_DEG * Math.atan2(dy, dx);
					this.deltaMatrix.rotateAround(angle, this.startX, this.startY);
					break;

				case "SCALE":
					var sx = 1 + 2 * dx / this.canvas.getNaturalWidth();
					var sy = 1 - 2 * dy / this.canvas.getNaturalHeight();
					this.deltaMatrix.scaleXYFrom(sx, sy, this.startX, this.startY);
					break;
			}

			this.draw(this.deltaMatrix);
		}



		private endDrag(evt:any):void
		{
			var x = evt.offsetX;
			var y = evt.offsetY;
			this.matrix.setFrom(this.deltaMatrix);
			this.draw();
			this.dragging = false;
		}



		private cancelDrag(evt:any):void
		{
			this.draw();
			this.dragging = false;
		}



		public reset():void
		{
			this.mode = "TRANSLATE";
			this.translateRadio.setChecked(true);
			this.dragging = false;

			super.reset();
		}
	}
}

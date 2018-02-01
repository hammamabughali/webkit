module pogo
{
	export class Keyboard
	{
		protected pressed:{[keyCode:number]:boolean} = {};



		constructor(
			protected canvas:pogo.Canvas)
		{
			this.canvas.setAttribute("tabIndex", 1);
			this.canvas.focus();

			this.canvas.on("keydown", this.onKeyDown.bind(this));
			this.canvas.on("keyup", this.onKeyUp.bind(this));
			this.canvas.on("blur", this.onBlur.bind(this));
		}



		private onBlur():void
		{
			this.pressed = {};
		}



		private onKeyDown(evt:KeyboardEvent):void
		{
			this.pressed[evt.keyCode] = true;
		}



		private onKeyUp(evt:KeyboardEvent):void
		{
			this.pressed[evt.keyCode] = false;
		}



		public isDown(keyCode:number):boolean
		{
			return this.pressed[keyCode] || false;
		}
	}
}

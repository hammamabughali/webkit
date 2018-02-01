/// <reference path="keyboard.ts"/>



module gf.utils
{
	export const LEFT:number = 37;
	export const UP:number = 38;
	export const RIGHT:number = 39;
	export const DOWN:number = 40;

	export class DebugDisplay
	{
		private static currentDisplay: gf.display.IDisplay;



		public static add(display: gf.display.IDisplay):void
		{
			if (!display["data"]) display["data"] = {};

			display["data"].buttonMode = display.buttonMode;
			display["data"].interactive = display.interactive;
			display["data"].interactiveChildren = display.interactiveChildren;

			display.buttonMode = true;
			display.interactive = true;
			display.interactiveChildren = true;

			display["data"].downListener = (e: PIXI.interaction.InteractionEvent) =>
			{
				log(display);
				if (this.currentDisplay)
				{
					this.removeMovement(this.currentDisplay);
				}
				this.currentDisplay = <gf.display.IDisplay>e.target;
				this.addMovement(display);
				this.onDown(e);
			};

			display["data"].upListener = (e: PIXI.interaction.InteractionEvent) =>
			{
				this.onUp(e);
			};

			display.on("mousedown touchstart", display["data"].downListener);
			display.on("mouseup mouseupoutside touchend touchendoutside", display["data"].upListener);

			const bounds: PIXI.Rectangle = display.getLocalBounds();

			let debug: gf.display.Graphics = new gf.display.Graphics(display.game);
			debug.lineStyle(2, 0xff00ff, 0.5);
			debug.f(0xff00ff, 0).dr(bounds.x, bounds.y, bounds.width, bounds.height).ef();

			display.addChild(debug);
			display["data"].debug = debug;
		}



		public static update(display: gf.display.IDisplay):void
		{
			if (!display["data"].debug) return;

			let debug: gf.display.Graphics = display["data"].debug;
			debug.c();

			const bounds: PIXI.Rectangle = display.getLocalBounds();

			debug.lineStyle(2, 0xff00ff, 0.5);
			debug.f(0xff00ff, 0).dr(bounds.x, bounds.y, bounds.width, bounds.height).ef();
		}



		public static remove(display: gf.display.IDisplay)
		{
			if (!display["data"] || !display["data"].debug) return;

			display.removeChild(display["data"].debug);
			display.buttonMode = display["data"].buttonMode;
			display.interactive = display["data"].interactive;
			display.interactiveChildren = display["data"].interactiveChildren;

			this.removeMovement(display);

			display.off("mousedown touchstart", display["data"].downListener);
			display.off("mouseup mouseupoutside touchend touchendoutside", display["data"].upListener);
		}



		private static addMovement(display: gf.display.IDisplay):void
		{
			display["data"].movementLeft = () =>
			{
				display.x -= 1;
				log(display.x + ", " + display.y, display);
			};

			display["data"].movementRight = () =>
			{
				display.x += 1;
				log(display.x + ", " + display.y, display);
			};

			display["data"].movementUp = () =>
			{
				display.y -= 1;
				log(display.x + ", " + display.y, display);
			};

			display["data"].movementDown = () =>
			{
				display.y += 1;
				log(display.x + ", " + display.y, display);
			};

			display["data"].leftId = gf.utils.Keyboard.add(() => display["data"].movementLeft(), gf.utils.LEFT);
			display["data"].rightId = gf.utils.Keyboard.add(() => display["data"].movementRight(), gf.utils.RIGHT);
			display["data"].upId = gf.utils.Keyboard.add(() => display["data"].movementUp(), gf.utils.UP);
			display["data"].downId = gf.utils.Keyboard.add(() => display["data"].movementDown(), gf.utils.DOWN);
		}



		private static removeMovement(display: gf.display.IDisplay):void
		{
			gf.utils.Keyboard.remove([display["data"].leftId, display["data"].rightId, display["data"].upId, display["data"].downId]);
		}



		private static onDown(e: PIXI.interaction.InteractionEvent):void
		{
			this.onDragStart(e);
		}



		private static onMove(e: PIXI.interaction.InteractionEvent):void
		{
			let display: gf.display.IDisplay = <gf.display.IDisplay>e.target;
			if (display["data"].isDragging)
			{
				this.onDragMove(e);
			}
			else
			{
				this.onDragStart(e);
			}
		}



		private static onUp(e: PIXI.interaction.InteractionEvent):void
		{
			let display: gf.display.IDisplay = <gf.display.IDisplay>e.target;
			if (display["data"].isDragging)
			{
				this.onDragStop(e);
				display.removeListener("mousemove", display["data"].moveListener);
				display.removeListener("touchmove", display["data"].moveListener);
			}
		}



		private static onDragStart(e: PIXI.interaction.InteractionEvent):void
		{
			let display: gf.display.IDisplay = <gf.display.IDisplay>e.target;
			display["data"].isDragging = true;
			display["data"].dragData = e.data;

			display["data"].dragStart = display["data"].dragData.getLocalPosition(display).clone();

			display["data"].moveListener = (e: PIXI.interaction.InteractionEvent) =>
			{
				this.onMove(e);
			};
			display.on("mousemove touchmove", display["data"].moveListener);
		}



		private static onDragMove(e: PIXI.interaction.InteractionEvent):void
		{
			let display: gf.display.IDisplay = <gf.display.IDisplay>e.target;
			if (display["data"].isDragging)
			{
				let position: PIXI.Point = e.data.getLocalPosition(display.parent);
				display.x = Math.round(position.x - display["data"].dragStart.x);
				display.y = Math.round(position.y - display["data"].dragStart.y);
			}
		}



		private static onDragStop(e: PIXI.interaction.InteractionEvent):void
		{
			let display: gf.display.IDisplay = <gf.display.IDisplay>e.target;
			display["data"].isDragging = false;
			log(display.x + ", " + display.y, display);
		}
	}
}

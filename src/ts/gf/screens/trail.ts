/// <reference path="../overlays/episodes.ts"/>
/// <reference path="../screens/screen.ts"/>
/// <reference path="../utils/mousewheel.ts"/>



module gf.screens
{
	export class Trail extends gf.screens.Screen
	{
		public static NAME:string = "trail";

		public mouseWheel:gf.utils.MouseWheel;
		public trail:any;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.mouseWheel = new gf.utils.MouseWheel();
		}



		protected init():void
		{
			this.addTrail();

			this.game.storage.on(gf.DATA, this.trail.update, this);
		}



		protected addTrail():void
		{
			this.trail = new this.game.client.config.TrailClass(this.game);
			this.trail.onLevelSelect.add(this.onLevelSelect, this);
			this.addChild(this.trail);
		}



		protected onLevelSelect():void
		{
			track("Trail-Level-" + this.game.levels.currentLevel.id);
			this.game.stage.header.hide();
			this.game.overlays.show("detail");
		}



		protected move(value:number)
		{
			this.trail.move(0, value);
		}



		public onMouseWheel(e:any):void
		{
			if (e.delta > 0)
			{
				this.move(100);
			}
			else if (e.delta < 0)
			{
				this.move(-100);
			}
		}



		public transitionIn():void
		{
			super.transitionIn();

			this.trail.update();
			this.mouseWheel.on(gf.utils.MOUSE_WHEEL, this.onMouseWheel, this);
		}



		public transitionOut():void
		{
			super.transitionOut();

			this.trail.update();
			this.mouseWheel.off(gf.utils.MOUSE_WHEEL, this.onMouseWheel, this);
		}
	}
}

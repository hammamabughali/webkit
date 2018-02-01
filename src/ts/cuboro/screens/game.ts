/// <reference path="../../cuboro/core/interaction.ts"/>
/// <reference path="../../cuboro/core/playground.ts"/>
/// <reference path="../../cuboro/ui/bottommenu.ts"/>
/// <reference path="../../cuboro/ui/layers.ts"/>
/// <reference path="../../cuboro/ui/marblerun.ts"/>
/// <reference path="../../cuboro/ui/movemenu.ts"/>
/// <reference path="../../cuboro/ui/rotatemenu.ts"/>
/// <reference path="../../gf/screens/game.ts"/>



module cuboro.screens
{
	export class Game extends gf.screens.Game
	{
		public bottomMenu: cuboro.ui.BottomMenu;
		public interaction: cuboro.core.Interaction;
		public layers: cuboro.ui.Layers;
		public marbleRun: cuboro.ui.MarbleRun;
		public moveMenu: cuboro.ui.MoveMenu;
		public playground: cuboro.core.Playground;
		public rotateMenu: cuboro.ui.RotateMenu;



		public init():void
		{
			this.interaction = new cuboro.core.Interaction(this.game);
			this.addChild(this.interaction);

			this.playground = new cuboro.core.Playground(this);

			this.marbleRun = new cuboro.ui.MarbleRun(this);
			this.addChild(this.marbleRun);

			this.moveMenu = new cuboro.ui.MoveMenu(this.playground);
			this.addChild(this.moveMenu);

			this.rotateMenu = new cuboro.ui.RotateMenu(this.playground);
			this.addChild(this.rotateMenu);

			this.layers = new cuboro.ui.Layers(this);
			this.layers.y = this.game.stage.header.bottom;
			this.addChild(this.layers);

			this.bottomMenu = new cuboro.ui.BottomMenu(this);
			this.addChild(this.bottomMenu);
		}



		public transitionInComplete():void
		{
			super.transitionInComplete();

			this.game.stage.header.trackMenu.show();
		}



		public transitionOutComplete():void
		{
			super.transitionOutComplete();

			this.playground.stop();
			this.game.stage.header.trackMenu.hide();
		}
	}
}

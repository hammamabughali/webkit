/// <reference path="../screens/screen.ts"/>
/// <reference path="../ui/button.ts"/>



module gf.screens
{
	export class Game extends gf.screens.Screen
	{
		public static NAME:string = "game";

		public btPause: gf.ui.Button;



		public start():void
		{
		}



		public transitionIn():void
		{
			super.transitionIn();

			this.start();
		}
	}
}

/// <reference path="message.ts"/>



module gf.overlays
{
	export class EpisodeUnlocked extends gf.overlays.Message
	{
		public btContinue: gf.ui.Button;



		public init():void
		{
			super.init();

			this.addBtContinue();
		}



		protected addBtContinue():void
		{
		}
	}
}

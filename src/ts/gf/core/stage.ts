module gf.core
{
	export class Stage extends gf.display.Container
	{
		public footer:any;
		public header:any;



		constructor(game:gf.core.Game)
		{
			super(game);

			this.name = "stage";
			this.interactive = true;
			this.game.on(gf.RESIZE, this.onResize, this);
		}



		public addFooter():void
		{
			if (!this.game.client.config.FooterClass) return;

			this.footer = new this.game.client.config.FooterClass(this.game);
			this.footer.interactive = true;
			this.addChild(this.footer);
		}



		public addHeader():void
		{
			if (!this.game.client.config.HeaderClass) return;

			this.header = new this.game.client.config.HeaderClass(this.game);
			this.header.interactive = true;
			this.addChild(this.header);
		}
	}
}

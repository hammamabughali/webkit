/// <reference path="../../gf/client.ts"/>
/// <reference path="../../gf/ui/trail/trail.ts"/>
/// <reference path="../../kr3m/util/browser.ts"/>



module gf.core
{
	export class Config extends PIXI.utils.EventEmitter
	{
		public FooterClass:any = null;
		public HeaderClass:any = null;
		public TrailClass:any = gf.ui.trail.Trail;
		public TrailTileClass:any;

		public appName:string = "";
		public assetsResolution:number = 2;
		public cacheBuster:string = "";
		public canvasDomId:string = "";
		public consoleExists:boolean = !(typeof console === "undefined" || typeof log === "undefined" || typeof log.apply === "undefined");
		public custom:any = {};
		public customerUrl:string = "";
		public debug:boolean = false;
		public forceCanvas:boolean = false;
		public forceWebGL:boolean = false;
		public hasEndless:boolean = true;
		public hasFooter:boolean = true;
		public hasHeader:boolean = true;
		public hasInbox:boolean = true;
		public hasLives:boolean = true;
		public hasLogin:boolean = true;
		public hasRaffle:boolean = false;
		public highscoreLimit:number = 7;
		public isIframe:boolean = false;
		public isMobile:boolean = PIXI.utils.isMobile.tablet || PIXI.utils.isMobile.phone;
		public language:string = "de";
		public musicUrl:string = "";
		public muteFxDefault:boolean = false;
		public muteMusicDefault:boolean = false;
		public ogUrl:string = "";
		public overlays: { name:string, "class":any }[];
		public queries:any = {};
		public renderType:string = gf.RENDER_TYPE_DEFAULT;
		public resolution:number = gf.utils.Resolution.getResolution();
		public roundPixels:boolean = false;
		public screens: { name:string, "class":any }[];
		public shareUrl:string = "";
		public targetWindow:any = window;
		public transparent:boolean = true;
		public unlockedLevels:number = 1;
		public useCAS:boolean = true;
		public version:string = "";



		constructor()
		{
			super();

			const queryValues = kr3m.util.Browser.getQueryValues();
			for (let name in queryValues)
			{
				if (typeof this[name] != "undefined")
					this[name] = queryValues[name];
			}
		}



		public addAssets(main:gf.Client):void
		{
		}



		/*
			Game is now running. Add custom stuff here (background etc.).
				@param game
		*/
		public onRun(game:gf.core.Game):void
		{
		}
	}
}

/// <reference path="../cuboro/overlays/account.ts"/>
/// <reference path="../cuboro/overlays/addsets.ts"/>
/// <reference path="../cuboro/overlays/changepassword.ts"/>
/// <reference path="../cuboro/overlays/contact.ts"/>
/// <reference path="../cuboro/overlays/finishregister.ts"/>
/// <reference path="../cuboro/overlays/forgotpassword.ts"/>
/// <reference path="../cuboro/overlays/imprint.ts"/>
/// <reference path="../cuboro/overlays/loader.ts"/>
/// <reference path="../cuboro/overlays/login.ts"/>
/// <reference path="../cuboro/overlays/lowquality.ts"/>
/// <reference path="../cuboro/overlays/message.ts"/>
/// <reference path="../cuboro/overlays/newcomment.ts"/>
/// <reference path="../cuboro/overlays/publish.ts"/>
/// <reference path="../cuboro/overlays/register.ts"/>
/// <reference path="../cuboro/overlays/trackdetails.ts"/>
/// <reference path="../cuboro/overlays/trackdetailsingame.ts"/>
/// <reference path="../cuboro/screens/game.ts"/>
/// <reference path="../cuboro/screens/start.ts"/>
/// <reference path="../cuboro/ui/footer.ts"/>
/// <reference path="../cuboro/ui/header.ts"/>
/// <reference path="../gf/core/config.ts"/>
/// <reference path="../kr3m/util/browser.ts"/>



module cuboro
{
	export class Config extends gf.core.Config
	{
		public FooterClass:any = cuboro.ui.Footer;
		public HeaderClass:any = cuboro.ui.Header;

		public canvasDomId:string = "game";
		public cheat:boolean = false;
		public hasEndless:boolean = false;
		public hasInbox:boolean = false;
		public hasLives:boolean = false;
		public hasLogin:boolean = false;
		public lowQuality:boolean = false;
		public muteFxDefault:boolean = true;
		public muteMusicDefault:boolean = true;
		public roundPixels:boolean = true;
		public useAntiAlias:boolean = true;
		public useCAS:boolean = false;

		public overlays:any[] =
		[
			cuboro.overlays.Account,
			cuboro.overlays.AddSets,
			cuboro.overlays.ChangePassword,
			cuboro.overlays.Contact,
			cuboro.overlays.FinishRegister,
			cuboro.overlays.ForgotPassword,
			cuboro.overlays.Imprint,
			cuboro.overlays.Loader,
			cuboro.overlays.Login,
			cuboro.overlays.LowQuality,
			cuboro.overlays.Message,
			cuboro.overlays.NewComment,
			cuboro.overlays.Publish,
			cuboro.overlays.Register,
			cuboro.overlays.TrackDetails,
			cuboro.overlays.TrackDetailsIngame
		];

		public screens:any[] =
		[
			cuboro.screens.Game,
			cuboro.screens.Start
		];



		public addAssets(client:Client)
		{
			client.game.loader.json("language", "js/data/lang_" + this.language + ".json");
			client.game.loader.json("sets", "js/data/sets.json");
			client.game.loader.atlas("sprites", "img/sprites.png", "js/data/sprites.json");
			client.game.loader.atlas("sprites-sets", "img/sprites-sets.png", "js/data/sprites-sets.json");
			client.game.loader.woff("avenir", "fonts/avenir-book-webfont.woff");
			client.game.loader.woff("avenir-heavy", "fonts/avenir-heavy-webfont.woff");
			client.game.loader.image("logo", "img/logo.png");
			client.game.loader.image("icon_new_track", "img/icon_new_track.png");
			client.game.loader.image("icon_contest", "img/icon_contest.png");
		}



		public onRun(game: gf.core.Game):void
		{
		}
	}
}

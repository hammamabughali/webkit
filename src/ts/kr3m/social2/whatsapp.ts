/// <reference path="../social2/socialnetwork.ts"/>
/// <reference path="../util/browser.ts"/>



module kr3m.social2
{
	export class WhatsApp extends kr3m.social2.SocialNetwork
	{
		public isAvailable():boolean
		{
			return kr3m.util.Browser.isIPhone();
		}



		public getID():string
		{
			return "whatsApp";
		}



		public getName():string
		{
			return "WhatsApp";
		}



		public getSMBUrl(shareText:string, shareUrl:string):string
		{
			var text = encodeURIComponent(shareText + "\n" + shareUrl);
			return "WhatsApp://send?text=" + text;
		}
	}
}

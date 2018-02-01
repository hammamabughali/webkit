/// <reference path="../social2/socialnetwork.ts"/>



module kr3m.social2
{
	export class GooglePlus extends kr3m.social2.SocialNetwork
	{
		public getID():string
		{
			return "googlePlus";
		}



		public getName():string
		{
			return "Google+";
		}



		public getSMBUrl(shareText:string, shareUrl:string):string
		{
			shareUrl = encodeURIComponent(shareUrl);
			return "https://plus.google.com/share?url=" + shareUrl;
		}
	}
}

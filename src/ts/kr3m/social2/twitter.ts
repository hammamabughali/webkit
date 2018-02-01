/// <reference path="../social2/socialnetwork.ts"/>



module kr3m.social2
{
	export class Twitter extends kr3m.social2.SocialNetwork
	{
		public getID():string
		{
			return "twitter";
		}



		public getName():string
		{
			return "Twitter";
		}



		public getSMBUrl(shareText:string, shareUrl:string):string
		{
			var text = encodeURIComponent(shareText + "\n" + shareUrl);
			return "https://twitter.com/intent/tweet?source=webclient&text=" + text;
		}
	}
}

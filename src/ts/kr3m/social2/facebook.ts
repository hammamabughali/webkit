/// <reference path="../social2/socialnetwork.ts"/>
/// <reference path="../util/url.ts"/>



module kr3m.social2
{
	export class Facebook extends kr3m.social2.SocialNetwork
	{
		public getID():string
		{
			return "facebook";
		}



		public getName():string
		{
			return "Facebook";
		}



		public getSMBUrl(shareText:string, shareUrl:string):string
		{
			shareUrl = encodeURIComponent(shareUrl);
			shareText = encodeURIComponent(shareText);
			return "https://www.facebook.com/sharer/sharer.php?u=" + shareUrl+"&ogdescription="+shareText;
		}
	}
}

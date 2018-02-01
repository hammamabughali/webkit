/// <reference path="../social/socialnetwork.ts"/>



//# DEPRECATED: kr3m.social.GooglePlus ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class GooglePlus extends kr3m.social.SocialNetwork
	{
		constructor(shareUrl:string)
		{
			super("gplus", "https://plus.google.com/share?url=##sclink##", shareUrl);
		}
	}
}

/// <reference path="../social/socialnetwork.ts"/>



//# DEPRECATED: kr3m.social.Pinterest ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class Pinterest extends kr3m.social.SocialNetwork
	{
		constructor(shareUrl:string)
		{
			super("pinterest", "http://pinterest.com/pin/create/button/?url=##sclink##&media=##picture##&description=##text##", shareUrl);
		}
	}
}

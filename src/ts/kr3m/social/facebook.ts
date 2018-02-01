/// <reference path="../social/socialnetwork.ts"/>



//# DEPRECATED: kr3m.social.Facebook ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class Facebook extends kr3m.social.SocialNetwork
	{
		constructor(shareUrl:string)
		{
			super("facebook", "https://www.facebook.com/sharer/sharer.php?t=##title##&u=##sclink##", shareUrl);
		}
	}
}

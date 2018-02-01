/// <reference path="socialnetwork.ts"/>



//# DEPRECATED: kr3m.social.Twitter ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class Twitter extends kr3m.social.SocialNetwork
	{
		constructor(shareUrl:string)
		{
			super("twitter", "https://twitter.com/intent/tweet?source=webclient&text=##text##+##link##", shareUrl);
		}
	}
}

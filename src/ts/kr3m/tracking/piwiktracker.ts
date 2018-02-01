//# DEPRECATED

/// <reference path="../tracking/tracker.ts"/>

declare var _paq:any; // Piwik Neu
declare var piwikTracker:any; // Piwik Alt



module kr3m.tracking
{
	export class PiwikTracker extends Tracker
	{
		public trackAction(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			if (typeof _paq != "undefined")
			{
				_paq.push(['trackPageView', '/' + pageId + '/' + actionId]);
			}
			else if (typeof piwikTracker != "undefined")
			{
				piwikTracker.trackPageView('/' + pageId + '/' + actionId);
			}
		}
	}
}

//# /DEPRECATED

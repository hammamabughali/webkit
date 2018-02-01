//# DEPRECATED

/// <reference path="../app/application.ts"/>
/// <reference path="../tracking/tracker.ts"/>

declare var _gaq; // Google Analytics
declare var _gagAccountIds:string; // Google Analytics IDs falls mehr als eine



module kr3m.tracking
{
	export class GoogleAnalyticsTracker extends Tracker
	{
		public trackAction(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			if (typeof _gaq != "undefined")
			{
				if (_gagAccountIds && _gagAccountIds.indexOf(",") >= 0)
				{
					var parts = _gagAccountIds.split(",");
					for (var i = 0; i < parts.length; ++i)
					{
						_gaq.push(['_setAccount', parts[i]]);
						_gaq.push(['_trackPageview', '/' + pageId + '/' + actionId]);
					}
				}
				else
				{
					_gaq.push(['_trackPageview', '/' + pageId + '/' + actionId]);
				}
			}
		}
	}
}

//# /DEPRECATED

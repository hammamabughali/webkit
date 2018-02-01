//# DEPRECATED

/// <reference path="../app/application.ts"/>
/// <reference path="../tracking/googleanalyticstracker.ts"/>
/// <reference path="../tracking/ivwtracker.ts"/>
/// <reference path="../tracking/piwiktracker.ts"/>
/// <reference path="../tracking/useractiontracker.ts"/>
/// <reference path="../util/browser.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.tracking
{
	export class Track
	{
		public static enabled:boolean = true;

		private static trackers:Array<kr3m.tracking.Tracker>;
		private static lastPageId:string = null;
		private static lastActionId:string = null;



		public static initTrackers(app:kr3m.app.Application):void
		{
			if (app.config.ivw)
				app.config.ivw.protocol = app.getProtocol();

			kr3m.tracking.Track.trackers = [];
			kr3m.tracking.Track.trackers.push(new UserActionTracker(app));
			kr3m.tracking.Track.trackers.push(new PiwikTracker(app));
			kr3m.tracking.Track.trackers.push(new GoogleAnalyticsTracker(app));
			kr3m.tracking.Track.trackers.push(new IvwTracker(app));
		}



		public static track(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			if (kr3m.tracking.Track.enabled)
			{
				for (var i = 0; i < kr3m.tracking.Track.trackers.length; ++i)
				{
					try
					{
						if (pageId !== kr3m.tracking.Track.lastPageId)
							kr3m.tracking.Track.trackers[i].trackPage(pageId, ivw);
						kr3m.tracking.Track.trackers[i].trackAction(pageId, actionId, ivw);
					}
					catch(e)
					{
						log("kr3m.tracking.Track.track: error in one of the trackers!");
						log(e.toString());
					}
				}

				kr3m.tracking.Track.lastPageId = pageId;
				kr3m.tracking.Track.lastActionId = actionId;
			}
		}



		/*
			Bitte die Track.track()-Methode statt dieser hier verwenden!
			@DEPRECATED
		*/
		public static trackUri(uri:string, ivw:string = null):void
		{
			var split = uri.split("/");
			var last = split.pop();

			kr3m.tracking.Track.track(split.join("/"), last, ivw);
		}
	}
}



/*
	Das hier nicht mehr benutzen. Statt dessen die trackProxy Funktion
	aus dem MobileProxy verwenden.
*/
function kr3mTrack(pageId:string, actionId:string, ivw:string = null)
{
	if (kr3m && kr3m.tracking && kr3m.tracking.Track)
		kr3m.tracking.Track.track(pageId, actionId, ivw);
}



/*
	Wird von den Flashspielen im Playground verwendet
	@DEPRECATED
*/
function kr3mExternalTrack(uri:string, ivw:any = true):void
{
	if (kr3m && kr3m.tracking && kr3m.tracking.Track)
		kr3m.tracking.Track.trackUri(uri, ((ivw) ? ((ivw === true) ? 'fp' : ivw) : null));
}


//# /DEPRECATED

//# DEPRECATED

/// <reference path="../app/application.ts"/>



module kr3m.tracking
{
	export class Tracker
	{
		constructor(app:kr3m.app.Application)
		{
		}



		public trackPage(pageId:string, ivw:string = null):void
		{
			// in abgeleiteten Klassen überschreiben
		}



		public trackAction(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			// in abgeleiteten Klassen überschreiben
		}
	}
}

//# /DEPRECATED

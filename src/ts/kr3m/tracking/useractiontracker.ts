//# DEPRECATED

/// <reference path="../tracking/tracker.ts"/>



module kr3m.tracking
{
	export class UserActionTracker extends Tracker
	{
		private app:kr3m.app.Application;



		constructor(app:kr3m.app.Application)
		{
			super(app);
			this.app = app;
		}



		public trackAction(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			this.app.countUserAction();
		}
	}
}

//# /DEPRECATED

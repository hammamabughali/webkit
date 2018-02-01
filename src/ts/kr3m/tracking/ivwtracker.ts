//# DEPRECATED

/// <reference path="../app/application.ts"/>
/// <reference path="../tracking/tracker.ts"/>
/// <reference path="../ui/image.ts"/>



declare var iam_data:any;
declare var iam_data_game:any;
declare var iom:any;



module kr3m.tracking
{
	export class IvwTracker extends Tracker
	{
		private ivw:any = {};

		public static inGame:boolean = false;



		constructor(app:kr3m.app.Application)
		{
			super(app);
			this.ivw = app.config.ivw;
			this.ivw.protocol = this.ivw.protocol || "http://";
		}



		public trackPage(pageId:string, ivw:string = null):void
		{
			//nichts machen
		}



		private trackAction_1_5(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			if (ivw)
			{
				var code = kr3m.tracking.IvwTracker.inGame ? this.ivw.code_game : this.ivw.code;
				if (this.ivw.protocol && this.ivw.id && code)
				{
					var ref = ((this.ivw.referrer.length) ? this.ivw.referrer :document.referrer);
					var url = this.ivw.protocol + this.ivw.id + ".ivwbox.de/cgi-bin/ivw/" + ivw.toUpperCase() + "/" + code + "?r=" + encodeURIComponent(ref) + '&d=' + (new Date()).getTime() + ';' + this.ivw.comment;
					new kr3m.ui.Image(null, url);
				}
			}
		}



		private trackAction_2_0(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			if (kr3m.tracking.IvwTracker.inGame)
			{
				if (ivw && typeof iom != "undefined" && typeof iam_data_game != "undefined")
					iom.c(iam_data_game, 1);
			}
			else
			{
				if (ivw && typeof iom != "undefined" && typeof iam_data != "undefined")
					iom.c(iam_data, 1);
			}
		}



		public trackAction(
			pageId:string,
			actionId:string,
			ivw:string = null):void
		{
			var code = kr3m.tracking.IvwTracker.inGame ? this.ivw.code_game : this.ivw.code;

			if (kr3m.util.Browser.isMobile() || this.ivw.code == "" || this.ivw.code2 != "")
				this.trackAction_2_0(pageId, actionId, ivw);
			else
				this.trackAction_1_5(pageId, actionId, ivw);
		}
	}
}

//# /DEPRECATED

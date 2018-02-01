/// <reference path="../app/application.ts"/>
/// <reference path="../app/applicationconfig.ts"/>
/// <reference path="../social/sharehighscorepopup.ts"/>


//# DEPRECATED
module kr3m.app
{
	/*
		"Mini-Anwendung", die nur ausgewählte Funktionalitäten
		für andere Anwendungen bereit stellt. Bisher sind das:
		- Social Media Popup
	*/
	export class ToolsOnlyApp extends kr3m.app.Application
	{
		private highscorePopup:kr3m.social.ShareHighscorePopup;



		public onPreloaded():void
		{
			super.onPreloaded();
			this.highscorePopup = new kr3m.social.ShareHighscorePopup(this.base);
		}



		public showHighscorePopup(shareText:string):void
		{
			this.highscorePopup.setText(shareText);
			this.highscorePopup.show();
		}
	}
}
//# /DEPRECATED



//# DEPRECATED
function initToolsApp(config:kr3m.app.ApplicationConfig):void
{
	var toa:kr3m.app.ToolsOnlyApp = new kr3m.app.ToolsOnlyApp();
	toa.run(config);
}
//# /DEPRECATED

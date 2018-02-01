/// <reference path="../../cuboro/clientmodels/user.ts"/>
/// <reference path="../../cuboro/cms/footer.ts"/>
/// <reference path="../../cuboro/cms/header.ts"/>
/// <reference path="../../cuboro/cms/screens/competitions.ts"/>
/// <reference path="../../cuboro/cms/screens/edutracks.ts"/>
/// <reference path="../../cuboro/cms/screens/login.ts"/>
/// <reference path="../../kr3m/ui2/cms/tabcontainer.ts"/>
/// <reference path="../../kr3m/ui2/div.ts"/>
/// <reference path="../../kr3m/util/browser.ts"/>
/// <reference path="../../kr3m/util/deeplinking.ts"/>
/// <reference path="../../kr3m/util/localization.ts"/>



module cuboro.cms
{
	export class Cms extends kr3m.ui2.Div
	{
		private header:Header;
		private tabs:kr3m.ui2.cms.TabContainer;
		private footer:Footer;



		constructor()
		{
			super(document.body);

			var languageId = kr3m.util.Browser.getQueryValue("lang") || "de";
			initLoc("lang_" + languageId + ".json", languageId, () =>
			{
				this.header = new Header(this);
				this.tabs = new kr3m.ui2.cms.TabContainer(this);
				this.footer = new Footer(this);

				var login = new cuboro.cms.screens.Login(this.tabs);
				new cuboro.cms.screens.EduTracks(this.tabs);
				new cuboro.cms.screens.Competitions(this.tabs);

				this.tabs.addTabs({eduTracks : loc("EDUTRACKS"), competitions : loc("COMPETITIONS")});

				var link = kr3m.util.Deeplinking.getCurrentLink();
				var params = kr3m.util.Deeplinking.getCurrentParams();
				if (!this.tabs.hasScreen(link))
					link = "";

				this.handleDeeplink(link || login.getName(), params);
				kr3m.util.Deeplinking.onChange((link, params) => this.handleDeeplink(link, params));
			});
		}



		private handleDeeplink(link:string, params:{[name:string]:string}):void
		{
			if (!this.tabs.hasScreen(link))
				return logWarning("unknown deeplink", link);

			var isLoggedIn = mUser.isLoggedIn();
			if (isLoggedIn)
			{
				document.title = loc("APP_TITLE") + " - " + link;
				this.tabs.showScreen(link, params);
			}
			else
			{
				document.title = loc("APP_TITLE");
				this.tabs.showScreen("login", params);
			}
		}
	}
}



new cuboro.cms.Cms();

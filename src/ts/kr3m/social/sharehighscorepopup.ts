/// <reference path="../social/socialmediabar.ts"/>
/// <reference path="../ui/popuptext.ts"/>



//# DEPRECATED: kr3m.social.ShareHighscorePopup ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class ShareHighscorePopup extends kr3m.ui.PopupText
	{
		private socialMediaBar:kr3m.social.SocialMediaBar;



		constructor(parent:any)
		{
			super(parent);
			this.setSize(320, 240);
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();
			this.setCaption(loc("SHARE_HIGHSCORE_CAPTION"));
			this.socialMediaBar = new kr3m.social.SocialMediaBar(this, false);
		}



		public showSocialMedia():void
		{
			this.socialMediaBar.show();
		}



		public hideSocialMedia():void
		{
			this.socialMediaBar.hide();
		}
	}
}

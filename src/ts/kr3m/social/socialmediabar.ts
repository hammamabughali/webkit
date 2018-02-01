/// <reference path="../social/facebook.ts"/>
/// <reference path="../social/googleplus.ts"/>
/// <reference path="../social/pinterest.ts"/>
/// <reference path="../social/twitter.ts"/>
/// <reference path="../ui/anchor.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/image.ts"/>
/// <reference path="../util/localization.ts"/>



//# DEPRECATED: kr3m.social.SocialMediaBar ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class SocialMediaBar extends kr3m.ui.Element
	{
		private shareUrl:string;



		constructor(parent:any, showCompanyLink:boolean = true, showPrivacyLink:boolean = false, showImpressumLink:boolean =false, showTermsOfParticipation:boolean = false )
		{
			super(parent, null, "div", {"class":"socialMediaBarContainer"});
			if (showCompanyLink)
			{
				var left:kr3m.ui.Element = new kr3m.ui.Element(this, null, "span", {"class":"companyLink"});
				new kr3m.ui.Anchor(left, loc("COMPANY_LINK_CAPTION"), loc("COMPANY_LINK_URL"), {target:"_blank"});

				if (showPrivacyLink)
					new kr3m.ui.Anchor(left, loc("PRIVACY_LINK_CAPTION"), loc("PRIVACY_LINK_URL"), { target: "_blank" });

				if (showImpressumLink)
					new kr3m.ui.Anchor(left, loc("IMPRESSUM_LINK_CAPTION"), loc("IMPRESSUM_LINK_URL"), { target: "_blank" });

				if (showTermsOfParticipation)
					new kr3m.ui.Anchor(left, loc("TERMS_OF_PARTICIPATION_CAPTION"), loc("TERMS_OF_PARTICIPATION_LINK"), { target: "_blank" });
			}
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();

			this.shareUrl = this.getApp().config.appUrl + "/social/share";

			var url:string = this.getApp().getImageUrl();
			var right:kr3m.ui.Element = new kr3m.ui.Element(this, null, "span", {"class":"socialMediaBar"});
			this.init(right, kr3m.social.Facebook, url + "icon_facebook.png", loc("SMB_FACEBOOK"));
			this.init(right, kr3m.social.Twitter, url + "icon_twitter.png", loc("SMB_TWITTER"));
			this.init(right, kr3m.social.GooglePlus, url + "icon_gplus.png", loc("SMB_GOOGLEPLUS"));
			// this.init(kr3m.social.Pinterest, "img/icon_pinterest.png", loc("SMB_PINTEREST"));
		}



		private init(parent:any, type:any, iconUrl:string, title:string):void
		{
			var img = new kr3m.ui.Image(parent, iconUrl, "button", {"title": title});
			var sn = new type(this.shareUrl);
			var app = this.getApp();

			img.dom.on("click", function()
			{
				sn.share(
				{
					"title": app.getShareTitle(),
					"text": app.getShareText(),
					"link": app.getShareUrl(),
					"image": app.getImageUrl() + "social.jpg"
				});
			});
		}
	}
}

/// <reference path="../../../cuboro/ui/facebookbutton.ts"/>
/// <reference path="../../../cuboro/ui/tabs/tab.ts"/>
/// <reference path="../../../gf/utils/social.ts"/>



module cuboro.ui.tabs
{
	export class Share extends cuboro.ui.tabs.Tab
	{
		public btFacebook: cuboro.ui.FacebookButton;
		public btMail: cuboro.ui.IconButton;
		public track: cuboro.vo.Track;

		protected mail: string;



		constructor(game: gf.core.Game)
		{
			super(game);

			this.btMail = new cuboro.ui.IconButton(this.game, "email", loc("bt_share_email"), false);
			this.btMail.on(gf.CLICK, this.onMail, this);
			this.btMail.x = 20;
			this.addChild(this.btMail);

			this.btFacebook = new cuboro.ui.FacebookButton(this.game);
			this.btFacebook.on(gf.CLICK, this.onFacebook, this);
			this.btFacebook.x = this.btMail.right + cuboro.PADDING * 2;
			this.addChild(this.btFacebook);
		}



		protected onMail(): void
		{
			this.game.overlays.show(cuboro.overlays.Loader.NAME);

			const url = this.game.client.config.ogUrl + "?tid=" + this.track.id;
			casClient.getShortUrl(url, (shortUrl: string) =>
			{
				this.game.overlays.hide(cuboro.overlays.Loader.NAME);

				const ogTitle = loc("share_og_title");
				const ogMessage = loc("share_og_mail", {
					username: mUser.isLoggedIn() ? mUser.getUser().name : "",
					shorturl: shortUrl
				});
				const mail = "?subject=" + encodeURIComponent(ogTitle) + "&body=" + encodeURIComponent(ogMessage);
				gf.utils.Social.share(gf.utils.Social.MAIL, mail);
			});
		}



		protected onFacebook(): void
		{
			const network = gf.utils.Social.FACEBOOK;
			const shareUrl = this.game.client.config.shareUrl;
			const ogUrl = this.game.client.config.ogUrl;
			const ogDescription = loc("share_og_description");
			const ogTitle = loc("share_og_title");
			const ogImage = this.game.client.config.ogUrl + this.track.imageUrl;

			const url = gf.utils.Social.getUrl(network, shareUrl, ogUrl, ogDescription, ogTitle, ogImage);
			gf.utils.Social.share(gf.utils.Social.FACEBOOK, url);
		}



		public update(track: cuboro.vo.Track): void
		{
			this.track = track;
		}
	}
}

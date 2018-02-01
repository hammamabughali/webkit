module gf.utils
{
	export class Social
	{
		public static readonly FACEBOOK:string = "facebook";
		public static readonly GPLUS:string = "gplus";
		public static readonly MAIL:string = "mail";
		public static readonly TWITTER:string = "twitter";
		public static readonly WHATSAPP:string = "whatsapp";
		public static readonly XING:string = "xing";



		public static getUrl(
			network:string,
			shareUrl:string,
			ogUrl?:string,
			ogDescription?:string,
			ogTitle?:string,
			ogImage?:string):string
		{
			if (ogDescription)
			{
				if (network == gf.utils.Social.GPLUS)
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogdescription=" : "&ogdescription=") + encodeURIComponent(ogDescription);
				else
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogdescription=" : "&ogdescription=") + ogDescription;
			}

			if (ogTitle)
			{
				if (network == gf.utils.Social.GPLUS)
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogtitle=" : "&ogtitle=") + encodeURIComponent(ogTitle);
				else
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogtitle=" : "&ogtitle=") + ogTitle;
			}

			if (ogUrl)
			{
				if (network == gf.utils.Social.GPLUS)
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogurl=" : "&ogurl=") + encodeURIComponent(ogUrl);
				else
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogurl=" : "&ogurl=") + ogUrl;
			}

			if (ogImage)
			{
				if (network == gf.utils.Social.GPLUS)
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogimage=" : "&ogimage=") + encodeURIComponent(ogImage);
				else
					shareUrl += ((shareUrl.indexOf("?") == -1) ? "?ogimage=" : "&ogimage=") + ogImage;
			}

			return shareUrl;
		}



		public static share(network:string, value:string):void
		{
			switch (network)
			{
				case gf.utils.Social.FACEBOOK:
					window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(value), "_blank");
					break;

				case gf.utils.Social.GPLUS:
					window.open("https://plus.google.com/share?url=" + encodeURIComponent(value), "_blank");
					break;

				case gf.utils.Social.XING:
					window.open("https://www.xing.com/spi/shares/new?url=" + encodeURIComponent(value), "_blank");
					break;

				case gf.utils.Social.TWITTER:
					window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(value), "_blank");
					break;

				case gf.utils.Social.WHATSAPP:
					top.location.href = "WhatsApp://send?text=" + value;
					break;

				case gf.utils.Social.MAIL:
					top.location.href = "mailto:" + value;
					break;
			}
		}
	}
}

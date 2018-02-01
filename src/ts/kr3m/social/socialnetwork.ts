/// <reference path="../tracking/track.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>



//# DEPRECATED: kr3m.social.SocialNetwork ist veraltet und sollte nicht mehr verwendet werden.

module kr3m.social
{
	export class SocialNetwork
	{
		public static DEFAULT_OPTIONS =
		{
			title : null,
			text : null,
			link : null,
			image : null,
			paramAction : "smb_action",
			paramData : "smb_data",
			paramNetwork : "smb_network"
		};



		private networkId:string;
		private networkUrl:string;
		private shareUrl:string;



		constructor(networkId:string, networkUrl:string, shareUrl:string)
		{
			this.networkId = networkId;
			this.networkUrl = networkUrl;
			if (shareUrl.slice(0, 2) == "//")
				shareUrl = location.protocol + shareUrl;
			this.shareUrl = shareUrl;
		}



		public share(options:any):void
		{
			options = $.extend({}, SocialNetwork.DEFAULT_OPTIONS, options);

			log(options);

			var encTitle:string = encodeURIComponent(options.title);
			var encText:string = encodeURIComponent(options.text);
			var encLink:string = encodeURIComponent(options.link);
			var encImage:string = encodeURIComponent(options.image);
			var encScLink:string = encodeURIComponent(this.shareUrl + '?title=' + encTitle + '&text=' + encText + '&link=' + encLink + '&image=' + encImage);

			kr3m.tracking.Track.track('share', this.networkId, 'cp');

			window.open(this.networkUrl.replace('##title##', encTitle).replace('##text##', encText).replace('##link##', encLink).replace('##image##', encImage).replace('##sclink##', encScLink));
		}
	}
}

/// <reference path="../ui/banner.ts"/>



module kr3m.ui
{
	export class BannerKr3m extends kr3m.ui.Banner
	{
		public static TYPE_BANNER_FULL = "full_banner";
		public static TYPE_BANNER_HALF = "half_banner";
		public static TYPE_CONTENT_AD = "rectangle";
		public static TYPE_HALF_PAGE = "half_page_ad";
		public static TYPE_LEADERBOARD = "leaderboard";
		public static TYPE_RECTANGLE = "rectangle";
		public static TYPE_RECTANGLE_MEDIUM = "medium_rectangle";
		public static TYPE_SKYSCRAPER = "skyscraper";
		public static TYPE_SKYSCRAPER_WIDE = "wide_skyscraper";

		public static SIZES =
		{
			"wide_skyscraper":{"w":160, "h":600},
			"skyscraper":{"w":120, "h":600},
			"medium_rectangle":{"w":300, "h":250},
			"rectangle":{"w":180, "h":150},
			"half_page_ad":{"w":300, "h":600},
			"leaderboard":{"w":728, "h":90},
			"full_banner":{"w":468, "h":60},
			"half_banner":{"w":234, "h":60}
		};



		constructor(parent:any, type:string, bannerSiteId:number, className:string = "")
		{
			var url = "http://banner.das-onlinespiel.de/banner?site=" + bannerSiteId + "&type=" + type;
			super(parent, url, className);
		}
	}
}

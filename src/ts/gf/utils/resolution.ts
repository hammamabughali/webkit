﻿module gf.utils
{
	export class Resolution
	{
		public static getResolution():number
		{
			let mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";

			if (window.devicePixelRatio > 1)
			{
				return 2;
			}

			if (window.matchMedia && window.matchMedia(mediaQuery).matches)
			{
				return 2;
			}

			return 1;
		}
	}
}

/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/loop.ts"/>



module kr3m.util
{
	/*
		Basiert auf der AdBlock-Erkennungsmethode wie sie von
		https://github.com/sitexw/FuckAdBlock/blob/master/fuckadblock.js
		Version 3.2.0 verwendet wird.
	*/
	export class AdBlock
	{
		private static delay = new kr3m.async.Delayed();
		private static hasBlocker:boolean;
		private static checking = false;



		public static has(
			callback?:(hasBlocker:boolean) => void):void
		{
			if (callback)
				AdBlock.delay.call(() => callback(AdBlock.hasBlocker));

			AdBlock.check();
		}



		private static check():void
		{
			if (AdBlock.checking)
				return;

			if (document.readyState != "complete")
			{
				document.addEventListener("readystatechange", () => AdBlock.check());
				return;
			}

			AdBlock.checking = true;

			var bait = document.createElement("div");
			bait.setAttribute("class", "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links");
			bait.setAttribute("style", "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;");
			document.body.appendChild(bait);

			var i = 5;
			kr3m.async.Loop.loop((loopDone:(again:boolean) => void) =>
			{
				setTimeout(() =>
				{
					var found = () =>
					{
						AdBlock.hasBlocker = true;
						this.delay.execute();
					};

					if (document.body.getAttribute("abp") !== null)
						return found();

					if (bait.offsetParent === null
						|| bait.offsetHeight == 0
						|| bait.offsetLeft == 0
						|| bait.offsetTop == 0
						|| bait.offsetWidth == 0
						|| bait.clientHeight == 0
						|| bait.clientWidth == 0)
						return found();

					if (window.getComputedStyle !== undefined)
					{
						var styles = window.getComputedStyle(bait, null);
						if (styles.getPropertyValue("display") == "none"
							|| styles.getPropertyValue("visibility") == "hidden")
							return found();
					}

					loopDone(--i > 0);
				}, 50);
			}, () =>
			{
				bait.remove();
				AdBlock.hasBlocker = false;
				this.delay.execute();
			});
		}
	}
}

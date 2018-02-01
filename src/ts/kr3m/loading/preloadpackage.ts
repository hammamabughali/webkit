/// <reference path="../loading/loader.ts"/>
/// <reference path="../loading/loadrequest.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.loading
{
	export class PreloadPackage
	{
		private pendingUrls:string[] = [];
		private completedUrls:string[] = [];
		private completedCallback:() => void;
		private progressCallback:(progress:number) => void = null;



		constructor(
			loader:Loader,
			urls:string[],
			completedCallback:() => void)
		{
			this.completedCallback = completedCallback;
			this.pendingUrls = urls;

			for (var i = 0; i < urls.length; ++i)
				loader.queue(urls[i], this.stepCallbackFunc.bind(this, urls[i]));
			loader.load();
		}



		public setProgressCallback(
			progressCallback:(progress:number) => void):void
		{
			this.progressCallback = progressCallback;
		}



		private stepCallbackFunc(url:string):void
		{
			kr3m.util.Util.remove(this.pendingUrls, url);
			this.completedUrls.push(url);

			if (this.progressCallback)
				this.progressCallback(this.getProgress());

			if (this.pendingUrls.length == 0)
				this.completedCallback();
		}



		public getProgress():number
		{
			var total = this.pendingUrls.length + this.completedUrls.length;
			if (total <= 0)
				return 0;

			return this.completedUrls.length / total;
		}
	}
}

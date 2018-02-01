/// <reference path="../async/join.ts"/>
/// <reference path="../async/priorityqueue.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../util/ajax.ts"/>
/// <reference path="../util/util.ts"/>

//# !RELEASE
/// <reference path="../loading/cache/cachebusteralways.ts"/>
//# /!RELEASE

//# RELEASE
/// <reference path="../loading/cache/cachebusterversion.ts"/>
//# /RELEASE



module kr3m.loading
{
	export class Loader2
	{
		private static instance:Loader2;

		private cacheBuster:cache.CacheBuster;
		private queue = new kr3m.async.PriorityQueue(true, 4);

		private loadedCount = 0;



		public static getInstance():Loader2
		{
			if (!Loader2.instance)
				Loader2.instance = new Loader2();
			return Loader2.instance;
		}



		constructor()
		{
//# !RELEASE
			this.cacheBuster = new cache.CacheBusterAlways();
//# /!RELEASE
//# RELEASE
			this.cacheBuster = new cache.CacheBusterVersion(kr3m.VERSION);
//# /RELEASE
		}



		public getLoadedCount():number
		{
			return this.loadedCount;
		}



		public getQueueLength():number
		{
			return this.queue.getLength();
		}



		public getPendingByPriority():{[priority:number]:number}
		{
			var result:{[priority:number]:number} = {};
			var len = this.queue.getLength();
			for (var i = 0; i < len; ++i)
			{
				var p = this.queue.getItem(i).p;
				result[p] = (result[p] || 0) + 1;
			}
			return result;
		}



		public setMaxParallelDownloads(maxParallel:number):void
		{
			this.queue.setParallelCount(maxParallel);
		}



		public setCacheBuster(buster:cache.CacheBuster):void
		{
			this.cacheBuster = buster;
		}



		public getCacheBusterString():string
		{
			return this.cacheBuster.getString();
		}



		public loadFile(
			url:string,
			priority:number,
			resultType:string,
			callback:AnyCallback,
			errorCallback:Callback):void;

		public loadFile(
			url:string,
			priority:number,
			callback:AnyCallback,
			errorCallback:Callback):void;

		public loadFile(
			url:string,
			priority:number,
			resultType:string,
			callback:AnyCallback):void;

		public loadFile(
			url:string,
			priority:number,
			callback:AnyCallback):void;

		public loadFile(
			url:string,
			resultType:string,
			callback:AnyCallback):void;

		public loadFile(
			url:string,
			callback:AnyCallback):void;

		public loadFile(
			url:string,
			priority:number,
			resultType:string):void;

		public loadFile(
			url:string,
			priority:number):void;

		public loadFile(
			url:string,
			resultType:string):void;

		public loadFile(
			url:string):void;

		public loadFile():void
		{
			var U = kr3m.util.Util;
			var url = <string> arguments[0];
			var resultType = <string> U.getFirstOfType(arguments, "string", 1);
			var callback = <AnyCallback> U.getFirstOfType(arguments, "function");
			var priority = <number> U.getFirstOfType(arguments, "number") || 0;
			var errorCallback = <Callback> U.getFirstOfType(arguments, "function", 0, 1);

			var loadUrl = this.cacheBuster.applyToUrl(url);

			this.queue.insert((next) =>
			{
				resultType = resultType || kr3m.util.Ajax.getTypeFromUrl(url) || "json";
				if (resultType == "image")
				{
					var image = new Image();
					image.onload = () =>
					{
						++this.loadedCount;
						next();
						callback && callback(image);
					};
					image.onerror = () =>
					{
						next();
						errorCallback && errorCallback();
					};
					image.src = loadUrl;
				}
				else
				{
					kr3m.util.Ajax.call(loadUrl, (content) =>
					{
						++this.loadedCount;
						next();
						callback && callback(content);
					}, resultType, () =>
					{
						next();
						errorCallback && errorCallback();
					});
				}
			}, priority);
		}



		public loadFiles(
			urls:string[],
			priority:number,
			callback:(contentByUrl:{[url:string]:any}) => void,
			progressListener:(done:number, errors:number, total:number) => void):void;

		public loadFiles(
			urls:string[],
			priority:number,
			callback:(contentByUrl:{[url:string]:any}) => void):void;

		public loadFiles(
			urls:string[],
			callback:(contentByUrl:{[url:string]:any}) => void,
			progressListener:(done:number, errors:number, total:number) => void):void;

		public loadFiles(
			urls:string[],
			callback:(contentByUrl:{[url:string]:any}) => void):void;

		public loadFiles(
			urls:string[], priority:number):void;

		public loadFiles(
			urls:string[]):void;

		public loadFiles():void
		{
			var U = kr3m.util.Util;
			var urls = <string[]> arguments[0];
			var callback = <(contentByUrl:{[url:string]:any}) => void> U.getFirstOfType(arguments, "function");
			var priority = <number> U.getFirstOfType(arguments, "number") || 0;
			var progressListener = <(done:number, errors:number, total:number) => void> U.getFirstOfType(arguments, "function", 0, 1);

			var total = urls.length;
			var done = 0;
			var errors = 0;

			var join = new kr3m.async.Join();
			for (var i = 0; i < urls.length; ++i)
			{
				var fileCallback = <AnyCallback> join.getCallback(urls[i]);
				this.loadFile(urls[i], priority, (content) =>
				{
					++done;
					progressListener && progressListener(done, errors, total);
					fileCallback(content);
				}, () =>
				{
					++errors;
					progressListener && progressListener(done, errors, total);
					fileCallback(null);
				});
			}
			join.addCallback(() => callback && callback(join.getAllResults()));
		}
	}
}

/// <reference path="../constants.ts"/>
/// <reference path="../loading/loadrequest.ts"/>
/// <reference path="../loading/preloadpackage.ts"/>
/// <reference path="../util/util.ts"/>

//# !RELEASE
/// <reference path="../loading/cache/cachebusteralways.ts"/>
//# /!RELEASE

//# RELEASE
/// <reference path="../loading/cache/cachebusterversion.ts"/>
//# /RELEASE



module kr3m.loading
{
	/*
		Klasse zum bequemen Laden von Resourcen. Kann als Autoloader
		oder als Preloader verwendet werden.
	*/
//# DEPRECATED kr3m.loading.Loader ist veraltet - bitte statt dessen kr3m.loading.Loader2 benutzen
	export class Loader
	{
		private static instance:Loader = null;

		private queuesByPriority:LoadRequest[][] = [[],[],[],[],[]];
		private completeCallbacks:Array<() => void> = [];
		private progressListeners:Array<() => void> = [];

		private cacheBuster:cache.CacheBuster;



		public static getInstance():Loader
		{
			if (!Loader.instance)
				Loader.instance = new Loader();
			return Loader.instance;
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



		public setCacheBuster(buster:cache.CacheBuster):void
		{
			this.cacheBuster = buster;
		}



		public getCacheBusterString():string
		{
			return this.cacheBuster.getString();
		}



		/*
			Fügt eine zu ladende URL in die Warteschlange des Loaders ein.
			Mit der Priorität kann gesteuert werden, in welcher Reihenfolge
			Ressourcen geladen werden. Es werden zuerst alle Ressourcen mit
			Priorität 0 geladen, anschließend die mit 1, dann mit 2 usw.
		*/
		public queue(
			url:string,
			onComplete:(data:any) => void,
			priority:number = 0,
			onError?:(requestStatus:number) => void):LoadRequest
		{
			var request = new LoadRequest(this.cacheBuster.applyToUrl(url), onComplete, onError);
			this.queuesByPriority[priority].push(request);
			return request;
		}



		/*
			Gibt ein Array mit den Requests innerhalb einer bestimmten Priorität
			zurück, die sich in einem bestimmten Status befinden. Z.B. "alle
			Requests mit Priorität 1 im Zustand PENDING."
		*/
		public getRequestsByStatus(priority:number, status:string):LoadRequest[]
		{
			var result:LoadRequest[] = [];
			for (var i = 0; i < this.queuesByPriority[priority].length; ++i)
				if (this.queuesByPriority[priority][i].status == status)
					result.push(this.queuesByPriority[priority][i]);
			return result;
		}



		/*
			Gibt an, welcher Teil aller Requests bereits geladen wurde. Gibt
			einen Wert zwischen 0 und 1 (inklusive) zurück.
		*/
		public getProgress():number
		{
			var total = 0;
			var completed = 0;
			for (var i = 0; i < this.queuesByPriority.length; ++i)
			{
				total += this.queuesByPriority[i].length;
				completed += this.getRequestCountByStatus(i, LoadRequest.COMPLETE);
			}

			if (total == 0)
				return 0;
			else
				return completed / total;
		}



		/*
			Gibt die Anzahl der Requests zurück, die sich innerhalb einer
			Priorität in einem bestimmten Zustand befinden. Z.B. "wie viele
			PENDING Requests der Priorität 1 gibt es?"
		*/
		public getRequestCountByStatus(priority:number, status:string):number
		{
			var result:number = 0;
			for (var i = 0; i < this.queuesByPriority[priority].length; ++i)
				if (this.queuesByPriority[priority][i].status == status)
					++result;
			return result;
		}



		/*
			Startet den Ladevorgang für alle neu eingestellten Ressourcen.
			Sobald alle Resourcen geladen sind, werden alle bisher
			eingestellten callback Funktionen aufgerufen (da die load Methode
			an verschiedenen Stellen aufgerufen werden kann). Falls nicht auf
			den Abschluß des gesamten Ladevorgangs gewartet werden soll, kann
			mit addProgressListener besser reagiert werden.
			Optional kann eine callback Funktion übergeben werden, welche
			aufgerufen wird, wenn alle Ressourcen geladen wurden.
		*/
		public load(callback?:() => void):void
		{
			if (callback)
				this.completeCallbacks.push(callback);

			this.step();
		}



		private step():void
		{
			for (var i = 0; i < this.queuesByPriority.length; ++i)
			{
				var loading = this.getRequestsByStatus(i, LoadRequest.LOADING);
				var pending = this.getRequestsByStatus(i, LoadRequest.PENDING);
				if (loading.length > 0 || pending.length > 0)
				{
					for (var j = 0; j < pending.length; ++j)
						pending[j].load(this.onStatus.bind(this));
					return;
				}
			}
			while (this.completeCallbacks.length > 0)
			{
				var callback = this.completeCallbacks.shift();
				callback();
			}
		}



		private onStatus(request:LoadRequest):void
		{
			if (request.callback)
				request.callback(request.data);

			for (var i = 0; i < this.progressListeners.length; ++i)
				this.progressListeners[i]();

			this.step();
		}



		/*
			Mit dieser Methode können Listener für den Ladefortschritt
			eingestellt werden. Die Listener werden immer aufgerufen,
			wenn sich am Gesamtzustand des Loaders etwas ändert - in den
			meisten Fällen ist das einfach, wenn eine Resource vollständig
			geladen wurde. Der Listener erhält keine Paramter, kann aber
			alle möglichen Informationen beim Loader anfragen.
		*/
		public addProgressListener(listener:() => void):void
		{
			if (this.progressListeners.indexOf(listener) < 0)
				this.progressListeners.push(listener);
		}



		public removeProgressListener(listener:() => void):void
		{
			var pos = this.progressListeners.indexOf(listener);
			if (pos > -1)
				this.progressListeners.splice(pos, 1);
		}



		/*
			Lädt eine Liste von gegebenen URLs und ruft eine callback Funktion
			auf, wenn diese Liste von Resourcen geladen ist. Das zurückgegebene
			PreloadPackage kann für mehr Details / Optionen
			verwendet werden.
		*/
		public preload(urls:string[], completedCallback:() => void):PreloadPackage
		{
			return new PreloadPackage(this, urls, completedCallback);
		}
	}
}

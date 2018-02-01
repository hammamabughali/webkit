/// <reference path="../async/delayed.ts"/>
/// <reference path="../phonegap/phonegap.ts"/>



module kr3m.phonegap
{
	/*
		Hilfsklasse für online- / offline-Events in mobilen
		Geräten.
	*/
	export class OnlineCheck
	{
		private static onOnlineFuncs = new kr3m.async.Delayed();
		private static onOfflineFuncs = new kr3m.async.Delayed();
		private static initialized:boolean = false;



		private static init():void
		{
			var self = kr3m.phonegap.OnlineCheck;
			if (self.initialized)
				return;

			self.initialized = true;

			kr3m.phonegap.onOnline(() =>
			{
				self.onOfflineFuncs.reset(false);
				self.onOnlineFuncs.execute();
			});

			kr3m.phonegap.onOffline(() =>
			{
				self.onOnlineFuncs.reset(false);
				self.onOfflineFuncs.execute();
			});

			kr3m.phonegap.isOnline((isOnline:boolean) =>
			{
				if (isOnline)
					self.onOnlineFuncs.execute();
				else
					self.onOfflineFuncs.execute();
			});
		}



		/*
			Führt die übergebene callback Methode einmalig
			beim nächsten online-Event des Gerätes aus. Um
			die Funktion bei weiteren online-Events erneut
			aufzurufen, muss onLine erneut aufgerufen werden.
		*/
		public static onOnline(callback:() => void)
		{
//# APP
			var self = kr3m.phonegap.OnlineCheck;
			self.init();
			self.onOnlineFuncs.call(callback);
//# /APP
//# !APP
			callback();
//# /!APP
		}



		/*
			Führt die übergebene callback Methode einmalig
			beim nächsten offline-Event des Gerätes aus. Um
			die Funktion bei weiteren offline-Events erneut
			aufzurufen, muss onOffline erneut aufgerufen werden.
		*/
		public static onOffline(callback:() => void)
		{
//# APP
			var self = kr3m.phonegap.OnlineCheck;
			self.init();
			self.onOfflineFuncs.call(callback);
//# /APP
		}
	}
}

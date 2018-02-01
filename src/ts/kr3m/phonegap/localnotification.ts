/// <reference path="../phonegap/phonegap.ts"/>
/// <reference path="../util/json.ts"/>



module kr3m.phonegap
{
	/*
		Klasse zum versenden von local Notifications in
		Phonegap-Apps. Die Nachrichten werden von der App an
		das Smartphone gesendet und können unter bestimmten
		Umständen Events in der App auslösen.

		Um diese Klasse verwenden zu können muss folgende Zeile
		in der config.xml stehen:

			<gap:plugin name="de.appplant.cordova.plugin.local-notification" />

		In der index.html muss entsprechend die passende
		js Datei eingebunden sein. Die genaue Beschreibung des verwendeten
		Phonegap-Plugins findet sich hier:

			https://github.com/katzer/cordova-plugin-local-notifications

	*/
	export class LocalNotification
	{
		private static freeId:number = 1;
		private static clickListeners:any = {};
		private static clickHandlerSet:boolean = false;
		private static checkVersion:boolean = true;

		private id:number;
		private message:string;
		private title:string;
		private autoCancel:boolean;

		// private date:Date;
		// private repeat:string;
		private badge:number;
		// private sound:string;
		private json:string;
		// private ongoing:boolean;



		public constructor(message:string, title:string = null, autoCancel:boolean = true)
		{
			this.id = kr3m.phonegap.LocalNotification.freeId++;
			this.message = message;
			if (title)
				this.title = title;
			this.autoCancel = autoCancel;
		}



		/*
			Zeigt einen Zahlenwert neben der Notification an,
			nach dem Motto "sie haben X neue Nachrichten".
		*/
		public setBadgeCount(count:number):void
		{
			//# FIXME: setBadgeCount funktioniert manchmal und manchmal nicht
			this.badge = count;
		}



		public setData(data:any):void
		{
			this.json = kr3m.util.Json.encode(data);
		}



		public show():void
		{
//# APP
			kr3m.phonegap.isOldDevice({ANDROID:"3.0.0.0"}, (isOld:boolean) =>
			{
				if (isOld)
				{
					if (kr3m.phonegap.LocalNotification.checkVersion)
					{
						kr3m.phonegap.LocalNotification.checkVersion = false;
						logError("local notifications not supported on this device");
					}
					return;
				}

				window.plugin.notification.local.add(this);
			});
//# /APP
		}



		public addClickListener(listener:(data?:any) => void):void
		{
//# APP
			var self = kr3m.phonegap.LocalNotification;
			if (!self.clickListeners[this.id])
				self.clickListeners[this.id] = [];
			self.clickListeners[this.id].push(listener);

			if (!self.clickHandlerSet)
			{
				self.clickHandlerSet = true;
				window.plugin.notification.local.onclick = (id:string, state:any, json:string) =>
				{
					var listeners = self.clickListeners[id];
					if (listeners)
					{
						var data = (json && json != "") ? kr3m.util.Json.decode(json) : null;
						for (var i = 0; i < listeners.length; ++i)
							listeners[i](data);
					}
				};
			}
//# /APP
		}



		public static cancelAll():void
		{
//# APP
			window.plugin.notification.local.cancelAll();
//# /APP
		}
	}
}

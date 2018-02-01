/// <reference path="../async/join.ts"/>
/// <reference path="../phonegap/pnsenders/apnsender.ts"/>
/// <reference path="../phonegap/pnsenders/gcmsender.ts"/>
/// <reference path="../util/map.ts"/>



module kr3m.phonegap
{
	/*
		Klasse zum Versenden von PushNotifications für
		Apps. Die Nachrichten werden über die entsprechenden
		Cloud-Services von Google oder Apple verschickt.
		Dort können sie dann von der PushNotificationClient-
		Klasse empfangen werden.

		Um Push-Nachrichten für Android bzw. iOS zu senden,
		müssen einmalig die Methoden setAndroidSettings()
		und / oder setIOSSettings() mit den entsprechenden
		Konfigurationsparametern aufgerufen werden.
	*/
	export class PushNotificationServer
	{
		private senders = new kr3m.util.Map<kr3m.phonegap.pnsenders.PNSender>();



		public enableAndroid(androidApiKey:string):void
		{
			this.senders.set(kr3m.ANDROID, new kr3m.phonegap.pnsenders.GcmSender(androidApiKey));
		}



		public enableIOS(certificate:string, key:string, password:string)
		{
			this.senders.set(kr3m.IOS, new kr3m.phonegap.pnsenders.ApnSender(certificate, key, password));
		}



		public getDeviceType(deviceId:string):string
		{
			return deviceId.slice(0, deviceId.indexOf(":"));
		}



		public getRegId(deviceId:string):string
		{
			return deviceId.slice(deviceId.indexOf(":") + 1);
		}



		public send(
			deviceIds:string[],
			title:string, message:string,
			callback:(success:boolean) => void = null):void
		{
			var regIds = new kr3m.util.Map<string[]>();
			var types = this.senders.getKeys();
			for (var i = 0; i < types.length; ++i)
				regIds.set(types[i], []);

			for (var i = 0; i < deviceIds.length; ++i)
			{
				var type = this.getDeviceType(deviceIds[i]);
				var regId = this.getRegId(deviceIds[i]);

				var typeRegIds = regIds.get(type);
				if (typeRegIds !== null)
					typeRegIds.push(regId);
				else
					logError("unknown device type: " + type);
			}

			var join = new kr3m.async.Join();

			for (var i = 0; i < types.length; ++i)
			{
				var sender = this.senders.get(types[i]);
				var typeRegIds = regIds.get(types[i]);
				sender.send(typeRegIds, title, message, join.getCallback(types[i]));
			}

			join.addCallback(() =>
			{
				for (var i = 0; i < types.length; ++i)
				{
					if (join.getResult(types[i]))
						return callback(true);
				}
				callback(false);
			});
		}
	}
}

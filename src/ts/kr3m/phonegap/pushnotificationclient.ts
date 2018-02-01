/// <reference path="../phonegap/phonegap.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/localization.ts"/>
/// <reference path="../util/rand.ts"/>



module kr3m.phonegap
{
	/*
		Um diese Klasse verwenden zu können muss folgende Zeile
		in der config.xml stehen:

			<gap:plugin name="com.phonegap.plugins.pushplugin" />

		In der index.html muss entsprechend die passende
		js Datei eingebunden sein:

			<script type="text/javascript" charset="utf-8" src="PushNotification.js"></script>

		Man kann sie hier runterladen:

			https://raw.githubusercontent.com/phonegap-build/PushPlugin/1979d972b6ab37e28cf2077bc7ebfe706cc4dacd/www/PushNotification.js

		Die genaue Beschreibung des verwendeten
		Phonegap-Plugins findet sich hier:

			https://github.com/phonegap-build/PushPlugin/blob/d528eca/README.md

	*/
	export class PushNotificationClient
	{
		private registeredCallback:(type:string, regId:string) => void;
		private messageCallback:(event:any) => void;



		private onNotificationGCM(event:any):void
		{
			switch (event.event)
			{
				case "registered":
					if (event.regid != undefined)
						this.registeredCallback(kr3m.ANDROID, event.regid);
					break;

				case "message":
					if (event.message)
						alert(event.message);
					//# TODO: optinalen Sound aus event.sound hier abspielen
					this.messageCallback(event);
					break;

				case "error":
				default:
					kr3m.util.Log.logError(event);
					break;
			}
		}



		private onNotificationAPN(event:any):void
		{
			if (event.alert)
				alert(event.alert);

			//# TODO: optinalen Sound aus event.sound hier abspielen

			if (event.badge)
				window.plugins.pushNotification.setApplicationIconBadgeNumber(this.successHandler.bind(this), this.errorHandler.bind(this), event.badge);

			this.messageCallback(event);
		}



		constructor(
			androidProjectId:string,
			registeredCallback:(type:string, regId:string) => void,
			messageCallback:(event:any) => void)
		{
//# APP
			this.registeredCallback = registeredCallback;
			this.messageCallback = messageCallback;

			kr3m.phonegap.isOldDevice({ANDROID:"2.2.0.0"}, (isOld:boolean) =>
			{
				if (isOld)
				{
					//# DEBUG
					kr3m.util.Log.logError("push notifications not supported on this device");
					//# /DEBUG
					return;
				}

				try
				{
					if (device && device.platform && device.platform.toUpperCase() == kr3m.ANDROID)
					{
						var tempFuncName = kr3m.util.Rand.getFunctionName();
						window[tempFuncName] = this.onNotificationGCM.bind(this);
						var params:any =
						{
							senderID : androidProjectId,
							ecb : tempFuncName
						};
						window.plugins.pushNotification.register(this.successHandler.bind(this), this.errorHandler.bind(this), params);
					}
					else
					{
						var tempFuncName = kr3m.util.Rand.getFunctionName();
						window[tempFuncName] = this.onNotificationAPN.bind(this);
						var params:any =
						{
							alert : true,
							badge : true,
							sound : true,
							ecb : tempFuncName
						};
						window.plugins.pushNotification.register(this.tokenHandler.bind(this), this.errorHandler.bind(this), params);
					}
				}
				catch(e)
				{
					kr3m.util.Log.logError(e);
				}
			});
//# /APP
		}



		private successHandler():void
		{
			// nichts machen
		}



		private tokenHandler(token:string):void
		{
			this.registeredCallback(kr3m.IOS, token);
		}



		private errorHandler(error:Error):void
		{
			kr3m.util.Log.logError(error);
		}



		public setBadgeCount(count:number):void
		{
//# APP
			window.plugins.pushNotification.setApplicationIconBadgeNumber(this.successHandler.bind(this), this.errorHandler.bind(this), count);
//# /APP
		}
	}
}

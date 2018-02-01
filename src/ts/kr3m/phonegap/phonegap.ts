//# APP
/// <reference path="../async/delayed.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../lib/cordova.ts"/>
/// <reference path="../util/stringex.ts"/>
//# /APP



/*
	Benötigte Plugins (in die config.xml eintragen):

		<gap:plugin name="org.apache.cordova.device" />
		<gap:plugin name="org.apache.cordova.network-information" />
		<gap:plugin name="org.apache.cordova.splashscreen" />

*/
module kr3m.phonegap
{
//# APP
	var delay = new kr3m.async.Delayed();
	var appTitle:string = document.title;
//# /APP



//# APP
	function initPhonegap():void
	{
		if (window.navigator && window.navigator.notification && window.navigator.notification.alert)
		{
			window.alert = function(message:any)
			{
				kr3m.phonegap.hideSplashScreen();
				window.navigator.notification.alert(message, null, appTitle);
			};
		}

		delay.execute();
	}

	document.addEventListener("deviceready", initPhonegap);
//# /APP



	export function callDelayed(func:() => void):void
	{
//# APP
		delay.call(func);
//# /APP
	}



	export function setAppTitle(title:string):void
	{
//# APP
		appTitle = title;
//# /APP
	}



	export function ifVersion(
		platform:string, version:string,
		matchCallback:() => void,
		noMatchCallback:() => void = null):void
	{
//# APP
		kr3m.phonegap.getDeviceInfo((info:any) =>
		{
			if (info.platform != platform.toUpperCase())
			{
				if (noMatchCallback)
					noMatchCallback();
				return;
			}

			var available = kr3m.util.StringEx.getVersionParts(info.version);
			var required = kr3m.util.StringEx.getVersionParts(version);
			for (var i = 0; i < required.length; ++i)
			{
				if (available[i] != required[i])
				{
					if (noMatchCallback)
						noMatchCallback();
					return;
				}
			}
			matchCallback();
		});
//# /APP
//# !APP
		if (noMatchCallback)
			noMatchCallback();
//# /!APP
	}



	export function isOldDevice(
		requiredVersions:any,
		callback:(isOld:boolean, platform?:string, version?:string) => void):void
	{
//# APP
		kr3m.phonegap.getDeviceInfo((info:any) =>
		{
			if (!requiredVersions[info.platform])
				return callback(false);

			var required = kr3m.util.StringEx.getVersionParts(requiredVersions[info.platform]);
			var available = kr3m.util.StringEx.getVersionParts(info.version);
			for (var i = 0; i < required.length; ++i)
			{
				if (required[i] > available[i])
					return callback(true, info.platform, info.version);
			}
			callback(false);
		});
//# /APP
//# !APP
		callback(false);
//# /!APP
	}



	/*
		Lässt das Smartphone für time Millisekunden vibrieren.
	*/
	export function vibrate(time:number):void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			navigator.notification.vibrate(time);
		});
//# /APP
	}



	/*
		Lässt das Smartphone times mal piepsen.
	*/
	export function beep(times:number):void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			navigator.notification.beep(times);
		});
//# /APP
	}



	export function showSplashScreen():void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			if (navigator.splashscreen)
				navigator.splashscreen.show();
		});
//# /APP
	}



	export function hideSplashScreen():void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			if (navigator.splashscreen)
				navigator.splashscreen.hide();
		});
//# /APP
	}



	export function isOnline(callback:(isOnline:boolean) => void):void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			callback(navigator.connection.type != Connection.NONE);
		});
//# /APP
//# !APP
		callback(true);
//# /!APP
	}



	export function onOffline(handler:() => void):void
	{
//# APP
		document.addEventListener("offline", handler, false);
//# /APP
	}



	export function onOnline(handler:() => void):void
	{
//# APP
		document.addEventListener("online", handler, false);
//# /APP
	}



	export function getDeviceInfo(callback:(info:any) => void):void
	{
//# APP
		kr3m.phonegap.callDelayed(() =>
		{
			try
			{
				var info:any = {};
				info.cordova = window.device.cordova;
				info.model = device.model;
				info.platform = window.device.platform.toUpperCase();
				info.uuid = window.device.uuid;
				info.version = window.device.version;
				callback(info);
			}
			catch(e)
			{
				logError(e);
			}
		});
//# /APP
//# !APP
		var info:any = {};
		info.cordova = "-";
		info.model = "-";
		info.platform = "-";
		info.uuid = "-";
		info.version = "-";
		callback(info);
//# /!APP
	}
}

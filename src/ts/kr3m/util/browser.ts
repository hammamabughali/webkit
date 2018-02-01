/// <reference path="../util/adblock.ts"/>
/// <reference path="../util/device.ts"/>
/// <reference path="../util/regex.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/url.ts"/>
/// <reference path="../util/util.ts"/>

//# DEPRECATED_1_4_10_0
/// <reference path="../sound/audiosupport.ts"/>
//# /DEPRECATED_1_4_10_0



//# CLIENT
module kr3m.util
{
	export class Browser
	{
		/*
			Überprüft ob AdBlock installiert ist und ruft die
			callback-Methode auf, wenn AdBlock gefunden wurde
			oder sichergestellt wurde, dass kein AdBlock vorhanden
			ist.
		*/
		public static hasAdBlock(
			callback:(hasAdBlock:boolean) => void):void
		{
			setTimeout(() => AdBlock.has(callback), 1);
		}



		/*
			Gibt true zurück, wenn der Browser-Agent auf der Liste der
			bekannten mobilen Browser steht. Ein normaler Browser kann
			dazu gebracht werden, immer true zurück zu geben, in dem
			man ?force-mobile=true in der URL anhängt.
		*/
		public static isMobile():boolean
		{
			if (location.search.indexOf("force-mobile") > -1)
				return true;

			if (location.search.indexOf("force-iphone") > -1)
				return true;

			var device = Device.getInstance();
			return !device.desktop;
		}



		/*
			Gibt true zurück, wenn der Browser-Agent auf der Liste der
			bekannten Tablet Browser steht. Ein normaler Browser kann
			dazu gebracht werden, immer true zurück zu geben, in dem
			man ?force-tablet=true in der URL anhängt.
		*/
		public static isTablet():boolean
		{
			if (location.search.indexOf("force-tablet") > -1)
				return true;

			if (location.search.indexOf("force-ipad") > -1)
				return true;

			var device = Device.getInstance();
			return device.tablet;
		}



		public static isPhone():boolean
		{
			var device = Device.getInstance();
			return Browser.isMobile() && !device.tablet;
		}



		/*
			Gibt true zurück, wenn der Browser-Agent auf der Liste der
			bekannten iPhone Browser steht. Ein normaler Browser kann
			dazu gebracht werden, immer true zurück zu geben, in dem
			man ?force-iphone=true in der URL anhängt.
		*/
		public static isIPhone():boolean
		{
			var device = Device.getInstance();
			if (location.search.indexOf("force-iphone") > -1)
				return true;
			return device.iPhone;
		}



		public static isFirefox():boolean
		{
			var device = Device.getInstance();
			return device.firefox;
		}



		public static isAndroid():boolean
		{
			var device = Device.getInstance();
			return device.android;
		}



		public static isAndroidStock():boolean
		{
			var device = Device.getInstance();
			return device.androidStockBrowser;
		}



		/*
			Gibt true zurück, wenn der Browser-Agent auf der Liste der
			bekannten iOs Browser steht. Ein normaler Browser kann
			dazu gebracht werden, immer true zurück zu geben, in dem
			man ?force-ios=true in der URL anhängt.
		*/
		public static isIOs():boolean
		{
			var device = Device.getInstance();
			if (
				(location.search.indexOf("force-ios") > -1) ||
				(location.search.indexOf("force-ios9") > -1) ||
				(location.search.indexOf("force-ios10") > -1)
			)
				return true;
			return device.iOS;
		}



		public static isIOs9():boolean
		{
			var device = Device.getInstance();
			if (location.search.indexOf("force-ios9") > -1)
				return true;
			return device.iOS9;
		}



		public static isIOs10():boolean
		{
			var device = Device.getInstance();
			if (location.search.indexOf("force-ios10") > -1)
				return true;
			return device.iOS10;
		}



		/*
			Gibt true zurück, wenn es sich um einen Internet Explorer
			Browser handelt, egal welcher Generation.
		*/
		public static isInternetExplorer():boolean
		{
			var device = Device.getInstance();
			return device.ie;
		}



		/*
			Gibt true zurück, wenn es sich um einen Chrome
			Browser handelt, egal welcher Generation.
		*/
		public static isChrome():boolean
		{
			var device = Device.getInstance();
			return device.chrome;
		}



		/*
			Gibt true zurück, wenn es sich um einen Chrome
			Browser auf iOS handelt, egal welcher Generation.
		*/
		public static isIOSChrome():boolean
		{
			var device = Device.getInstance();
			return device.iOSChrome;
		}



		/*
			Gibt true zurück, wenn es sich um einen Safari
			Browser handelt, egal welcher Generation.
		*/
		public static isSafari():boolean
		{
			var device = Device.getInstance();
			return device.safari;
		}



		/*
			Gibt true zurück, wennn der Browser Click-Jacking bzw.
			Click-Stealing unterstützt.
		*/
		public static supportsClickJacking():boolean
		{
			if (Browser.isInternetExplorer())
				return false;

			if (Browser.isSafari())
				return false;

			return true;
		}



		/*
			Gibt true zurück wenn die Anwendung in einem bekannten
			veralteten Browser läuft (vor allem Internet Explorer 8).
			Ein anderer Browser kann dazu gebracht werden, immer
			true zurück zu geben, in dem ?force-old=true in der URL
			angehängt wird.
		*/
		public static isOldBrowser():boolean
		{
			var device = Device.getInstance();
			return (device.ie && device.ieVersion < 9) ? true : false;
		}



		/*
			Überprüft ob Flash installiert ist (ohne Berücksichtigung
			der Versionsnummer) und gibt true zurück falls das der Fall
			ist oder false falls nicht.

			Statt isFlashInstalled bitte kr3m.util.Flash.isInstalled
			verwenden.
		*/
//# DEPRECATED_1_4_10_0
		public static isFlashInstalled():boolean
		{
			if (navigator.mimeTypes["application/x-shockwave-flash"] != null)
				return true;
			if (window["ActiveXObject"] && new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))
				return true;
			return false;
		}
//# /DEPRECATED_1_4_10_0



		/*
			Gibt den Wert des Cookies mit dem Namen name zurück.
		*/
		public static getCookie(name:string):string
		{
			var pattern = new RegExp(name + "=([^;]*)");
			var matches = document.cookie.match(pattern);
			return matches ? decodeURIComponent(matches[1]) : null;
		}



		/*
			Speichert ein Cookie mit dem Namen name und dem Wert
			value im Browser. Optional kann mit ttlSeconds angegeben
			werden, wie lange das Cookie gültig bleiben soll.
		*/
		public static setCookie(
			name:string,
			value:string,
			ttlSeconds = 30 * 24 * 60 * 60):void
		{
			value = encodeURIComponent(value);
			if (ttlSeconds > 0)
			{
				var exDate = new Date();
				exDate.setTime(exDate.getTime() + ttlSeconds * 1000);
				value += "; expires=" + exDate.toUTCString();
			}
			document.cookie = name + "=" + value;
		}



		public static deleteCookie(name:string):void
		{
			Browser.setCookie(name, "", -1);
		}



		/*
			Gibt das höchste Window-Objekt zurück, welches die gleiche
			Domain hat wie das übergebene win. Dabei kann es sich um win
			selbst handeln falls es nicht im I-Frame läuft oder die Domain
			nicht mit seinem Parent teilt.
		*/
		public static getHighestSameDomainWindow(win = window):Window
		{
			try
			{
				while (win != win.parent && win.document.domain == win.parent.document.domain)
					win = win.parent;
			}
			catch(e)
			{
			}
			return win;
		}



		/*
			Gibt alle in der Query übergebenen Parameter in
			einem assoziativen Array zurück.
		*/
		public static getQueryValues(win = window):{[name:string]:string}
		{
			try
			{
				var data = win.location.search;
				if (!data || data == "")
					return {};

				data = data.substr(1);

				var values = StringEx.splitAssoc(data);
				var result:{[name:string]:string} = {};
				for (var i in values)
					result[i] = decodeURIComponent(values[i]);
				return result;
			}
			catch(e)
			{
				return {};
			}
		}



		/*
			Gibt den Wert des Parameters key aus dem Suchstring /
			Query in der Browser-URL zurück (dem Teil hinter dem
			Fragezeichen).
		*/
		public static getQueryValue(key:string, win = window):string
		{
			try
			{
				var data = win.location.search;
				if (!data || data == "")
					return null;

				data = data.substr(1);

				var values = StringEx.splitAssoc(data);
				for (var i in values)
				{
					if (i == key)
						return decodeURIComponent(values[i]);
				}
				return null;
			}
			catch(e)
			{
				return null;
			}
		}



		public static removeParam(key:string, win = window):string
		{
			var sourceUrl = win.location.href;
			return Url.removeParameter(sourceUrl, key);
		}



		/*
			Gibt die aktuelle base-Url zurück (ohne Datei, Queries,
			Hashtags usw.).
		*/
		public static getBaseUrl(win = window):string
		{
			var url = win.location.href;
			url = StringEx.getBefore(url, "?", true);
			url = StringEx.getBefore(url, "#", true);
			url = StringEx.getBefore(url, "/", false);
			url += "/";
			return url;
		}



		/*
			Gibt die bevorzugte Sprache des Users laut seinen
			Browsereinstellungen zurück. Da ein User mehrere
			Sprachen einstellen kann, gibt es als Rückgabewert
			einen Array, der die Sprachen nach Vorliebe des
			Users zurück gibt (bevorzugte Sprachen zuerst).
		*/
		public static getLanguagePreferences():string[]
		{
			var languages = navigator.language || navigator["userLanguage"] || "";
			var parts = languages.split(",");
			var result:string[] = [];
			for (var i = 0; i < parts.length; ++i)
			{
				if (kr3m.REGEX_LOCALE.test(parts[i]))
				{
					var lang = parts[i].slice(0, 2);
					if (!Util.contains(result, lang))
						result.push(lang);
				}
			}
			return result;
		}



		/*
			Funktioniert ähnlich wie getLanguagePreferences aber
			gibt Ländercodes statt Sprachcodes zurück.
		*/
		public static getCountryPreferences():string[]
		{
			var languages = navigator.language || navigator["userLanguage"] || "";
			var parts = languages.split(",");
			var result:string[] = [];
			for (var i = 0; i < parts.length; ++i)
			{
				if (kr3m.REGEX_LOCALE.test(parts[i]))
				{
					var country = parts[i].slice(-2);
					if (!Util.contains(result, country))
						result.push(country);
				}
			}
			return result;
		}



		public static isHtml5Supported():boolean
		{
			var elem = document.createElement("canvas");
			var isSupported = !!(elem.getContext && elem.getContext("2d"));
			return isSupported;
		}



		public static isWebAudioAvailable():boolean
		{
			var win = <any>window;
			if (typeof win.AudioContext != "undefined" || typeof win.webkitAudioContext != "undefined")
				return true;
			return false;
		}



//# DEPRECATED_1_4_10_0
		public static getAvailableAudioSupport():kr3m.sound.AudioSupport
		{
			// TODO: wenn die Web Audio API mal eingebaut ist, hier
			// bevorzugt diese zurück geben (also vor mobile checken)
			if (Browser.isMobile())
				return kr3m.sound.AudioSupport.NONE;

			// if (Browser.isWebAudioAvailable())
				// return kr3m.sound.AudioSupport.WEB_AUDIO_API;

			if (Browser.isOldBrowser())
				return kr3m.sound.AudioSupport.NONE;

			return kr3m.sound.AudioSupport.AUDIO_TAG;
		}
//# /DEPRECATED_1_4_10_0



//# DEPRECATED_1_4_10_0
		public static isSoundAvailable():boolean
		{
			return Browser.getAvailableAudioSupport() != kr3m.sound.AudioSupport.NONE;
		}
//# /DEPRECATED_1_4_10_0
	}
}
//# /CLIENT

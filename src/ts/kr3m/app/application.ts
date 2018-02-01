/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/join.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../util/browser.ts"/>
/// <reference path="../util/localization.ts"/>
/// <reference path="../util/util.ts"/>

//# DEPRECATED
/// <reference path="../tracking/track.ts"/>
//# /DEPRECATED



module kr3m.app
{
	/*
		Die Basisklasse aller Web-Anwendungen bzw. Clients,
		die das Typeskript-Framework verwenden.
	*/
	export class Application
	{
		public lastIsPortrait:boolean = null;
		public lastWindowWidth:number = -1;
		public lastWindowHeight:number = -1;

		public config:any;
		public base:kr3m.ui.Element;

		private delayed = new kr3m.async.Delayed();



		public callDelayed(callback:() => void):void
		{
			this.delayed.call(callback);
		}



		public getProtocol():string
		{
			var matchResult:string[] = this.config.appUrl.match(/.+:\/\//);
			if (matchResult)
				return matchResult[0];
			else
				return window.location.protocol + "//";
		}



		private checkConfigDefaults():void
		{
			this.config.appUrl = this.config.appUrl || window.location.href;
			if (this.config.appUrl.substr(this.config.appUrl.length - 1) == '/')
				this.config.appUrl = this.config.appUrl.substr(0, this.config.appUrl.length - 1);
			this.config.domQuery = this.config.domQuery || "#kr3m";

//# DEPRECATED
			this.config.ivw = this.config.ivw || null;
//# /DEPRECATED
		}



		public getUserLanguage():string
		{
			if (location.search && location.search != "")
			{
				var params:any = kr3m.util.StringEx.splitAssoc(location.search.substr(1));
				if (typeof params.lang != "undefined")
					return params.lang;
			}

			var browserLanguages = kr3m.util.Browser.getLanguagePreferences();
			for (var i = 0; i < browserLanguages.length; ++i)
			{
				if (kr3m.util.Util.contains(this.config.supportedLanguages, browserLanguages[i]))
					return browserLanguages[i];
			}

			return this.config.fallbackLanguage;
		}



		public getUserCountry():string
		{
			if (location.search && location.search != "")
			{
				var params:any = kr3m.util.StringEx.splitAssoc(location.search.substr(1));
				if (typeof params.country != "undefined")
					return params.country;
			}

			var browserCountries = kr3m.util.Browser.getCountryPreferences();
			if (browserCountries.length > 0)
				return browserCountries[0];

			return "DE";
		}



		protected initLocalization():void
		{
			var c = this.config;

			if (!c.supportedLanguages)
			{
				c.supportedLanguages = [];

				if (c.language
					&& c.language.length == 2)
					c.supportedLanguages.push(c.language);

				if (c.fallbackLanguage
					&& c.fallbackLanguage.length == 2
					&& c.fallbackLanguage != c.language)
					c.supportedLanguages.push(c.fallbackLanguage);

				if (c.supportedLanguages.length == 0)
					c.supportedLanguages.push("de");
			}

			if (c.supportedLanguages.length == 0)
				kr3m.util.Log.logError("supportedLanguages is empty");

			if (!c.language)
				c.language = "auto";

			if (c.language != "auto" && !kr3m.util.Util.contains(c.supportedLanguages, c.language))
				kr3m.util.Log.logDebug("supportedLanguages", c.supportedLanguages, "doesn't contain language", c.language);

			if (!c.fallbackLanguage)
			{
				if (kr3m.util.Util.contains(c.supportedLanguages, "en"))
					c.fallbackLanguage = "en";
				else
					c.fallbackLanguage = c.supportedLanguages[0];
			}

			if (!kr3m.util.Util.contains(c.supportedLanguages, c.fallbackLanguage))
				kr3m.util.Log.logDebug("supportedLanguages", c.supportedLanguages, "doesn't contain fallbackLanguage", c.fallbackLanguage);

			c.localizationPath = c.localizationPath || "xml";
			c.localizationFileExtension = c.localizationFileExtension || "xml";

			if (c.language == "auto")
				c.language = this.getUserLanguage();

			if (c.country == "auto")
				c.country = this.getUserCountry();

			if (!kr3m.util.Util.contains(c.supportedLanguages, c.language))
				c.language = c.fallbackLanguage;

			var loca = kr3m.util.Localization;
			loca.country = c.country || "DE";
			loca.fallback = c.fallbackLanguage;
			loca.language = c.language;
		}



		public run(config:any):void
		{
			this.config = config;
			this.checkConfigDefaults();

			this.base = new kr3m.ui.Element(this, this.config.domQuery);
			if (this.base.dom.get().length == 0)
			{
				kr3m.util.Log.logError("domQuery was given but dom element", this.config.domQuery, "was not found");
				return;
			}

			this.base.dom.empty();

			this.initLocalization();

//# DEPRECATED
			kr3m.tracking.Track.initTrackers(this);
//# /DEPRECATED
			this.preload();
		}



		public removeFromStage():void
		{
			this.base.removeAllChildren(true);
		}



		protected loadLocalizationFiles(
			callback:() => void):void
		{
			var loca = kr3m.util.Localization;

			var join = new kr3m.async.Join();
			if (this.config.localizationFileExtension == "xml")
			{
				loca.addXMLModuleFromUrl(this.config.localizationPath + "/lang_" + loca.language + ".xml", loca.language, join.getCallback());
				if (this.config.language != loca.fallback)
					loca.addXMLModuleFromUrl(this.config.localizationPath + "/lang_" + loca.fallback + ".xml", loca.fallback, join.getCallback());
			}
			else if (this.config.localizationFileExtension == "json")
			{
				loca.addJSONModuleFromUrl(this.config.localizationPath + "/lang_" + loca.language + ".json", loca.language, join.getCallback());
				if (this.config.language != loca.fallback)
					loca.addJSONModuleFromUrl(this.config.localizationPath + "/lang_" + loca.fallback + ".json", loca.fallback, join.getCallback());
			}

			join.addCallback(callback);
		}



		protected preload():void
		{
			this.loadLocalizationFiles(() =>
			{
				var onCheckWindowSize = this.checkWindowSize.bind(this);
				setInterval(onCheckWindowSize, 200);
				window.addEventListener("resize", onCheckWindowSize);
				if (!getDevice().desktop)
					window.addEventListener("orientationchange", onCheckWindowSize);
				this.delayed.execute();
				this.onPreloaded();
			});
		}



		public onPreloaded():void
		{
			// nichts machen, wird in abgeleiteten Klassen überschrieben
		}



		public getParentIFrameWindow():Window
		{
			if (window.parent)
				return window.parent;
			return null;
		}



		/*
			Gibt true zurück wenn die Anwendung in einem
			IFrame läuft oder false falls nicht.
		*/
		public isRunningInIFrame():boolean
		{
			return window.self !== window.top;
		}



		/*
			Überprüft ob sich die Fenstergröße seit dem letzten Aufruf
			verändert hat und falls ja ruft es die onSize Methode des
			base Elements auf (welches es dann normalerweise rekursiv
			die Methode in seinen Child-Element-Objekten aufruft).
		*/
		public checkWindowSize(forceUpdate:boolean = false):void
		{
			var win = $(window);
			var width = win.width();
			var height = win.height();
			var isPortrait = width < height;

			if (forceUpdate || this.lastWindowWidth != width || this.lastWindowHeight != height)
			{
				this.onSize(width, height);
				this.lastWindowWidth = width;
				this.lastWindowHeight = height;
			}
			if (forceUpdate || this.lastIsPortrait === null || this.lastIsPortrait != isPortrait)
			{
				this.onOrientation(isPortrait);
				this.lastIsPortrait = isPortrait;
			}
		}



		public onSize(width:number, height:number):void
		{
			this.base.onSize(width, height);
		}



		public onOrientation(isPortrait:boolean):void
		{
			this.base.onOrientation(isPortrait);
		}



		public getCurrentDeepLink():string
		{
			//in abgeleiteten Klassen überschreiben
			return this.config.appUrl;
		}



		public getShareText():string
		{
			//in abgeleiteten Klassen überschreiben
			return kr3m.util.Localization.get("SMB_SHARE");
		}



		public getShareTitle():string
		{
			//in abgeleiteten Klassen überschreiben
			return kr3m.util.Localization.get("SMB_SHARE_TITLE");
		}



		public getShareUrl():string
		{
			//in abgeleiteten Klassen überschreiben
			return this.config.appUrl;
		}



		public countUserAction():void
		{
			//in abgeleiteten Klassen überschreiben
		}



		public getImageUrl():string
		{
			return "img/";
		}
	}
}

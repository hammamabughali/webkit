/// <reference path="../constants.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/tokenizer.ts"/>
/// <reference path="../util/util.ts"/>
/// <reference path="../xml/parser.ts"/>

//# CLIENT
/// <reference path="../loading/loader2.ts"/>
/// <reference path="../util/device.ts"/>
//# /CLIENT

//# !CLIENT
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/file.ts"/>
//# /!CLIENT

//# !CLIENT
//# DEPRECATED: kr3m.util.Localization is deprecated for server use - use kr3m.net2.Localization.Simple instead
//# /!CLIENT



module kr3m.util
{
	interface LocaModule
	{
		name:string;
		items:{[id:string]:string};
	}



	export class Localization
	{
		public static fallback = "en";
		public static language = "en";
		public static country:string;
		public static allowEmptyStrings = true;

		private static modules:{[languageId:string]:LocaModule[]} = {};

//# PROFILING
		private static requestedIds:{[id:string]:boolean} = {};
		private static missingIds:{[id:string]:boolean} = {};
//# /PROFILING



//# PROFILING
		public static getUsedIds():string[]
		{
			var result:string[] = Object.keys(Localization.requestedIds);
			result.sort();
			return result;
		}
//# /PROFILING



//# PROFILING
		public static getMissingIds():string[]
		{
			var result:string[] = Object.keys(Localization.missingIds);
			result.sort();
			return result;
		}
//# /PROFILING



		private static setModuleItem(tempModule:LocaModule, id:string, value:any):void
		{
			if (value === undefined || value === null)
				return;

			if (value || Localization.allowEmptyStrings)
				tempModule.items[id] = value.toString();
		}



		public static setRaw(id:string, text:string, language?:string):void
		{
			language = language || Localization.language;
//# PROFILING
			Localization.requestedIds[id] = true;
//# /PROFILING
			var tempModule = Localization.getModule(language);
			Localization.setModuleItem(tempModule, id, text);
		}



		public static getRaw(id:string, language?:string):string
		{
//# DEBUG
			try
			{
				var win = window;
				while (true)
				{
					if (win.location.search.match(/\bshowLocIds=true\b/))
						return id;

					if (win == top)
						break;

					win = win.parent;
				}
			}
			catch(e)
			{
			}
//# /DEBUG
			language = language || Localization.language;
//# PROFILING
			Localization.requestedIds[id] = true;
//# /PROFILING
			var modules = Localization.modules[language];
			if (modules)
			{
				for (var i = 0; i < modules.length; ++i)
				{
					var tempModule = modules[i];
					if (tempModule.items[id] !== undefined)
//# !AUTHORING
						return tempModule.items[id];
//# /!AUTHORING
//# AUTHORING
						return "<span data-loc-id='" + id + "' contenteditable onblur='Localization.onLocalizedTextChanged(\"" + id + "\", \" \" + this.innerHTML)'>" + tempModule.items[id] + "</span>";
//# /AUTHORING
				}
			}
//# PROFILING
			Localization.missingIds[id] = true;
//# /PROFILING
			return undefined;
		}



//# AUTHORING
		public static onLocalizedTextChanged(id:string, text:string):void
		{
			log(id + " => " + text);
		}
//# /AUTHORING



		public static get(id:string, tokens?:any, language?:string):string
		{
			language = language || Localization.language;
			var raw = Localization.getRaw(id, language);
			if (raw !== undefined)
				return Tokenizer.get(raw, tokens);

			if (language != Localization.fallback)
				return Localization.get(id, tokens, Localization.fallback);

			Log.logWarning("missing localization", id, "for language", language);
//# RELEASE
			return "";
//# /RELEASE
//# !RELEASE
			return "loc(" + id + ")";
//# /!RELEASE
		}



		/*
			Clont alle Texte einer gewählten Sprache fromLanguage
			und legt sie für die Sprache toLanguage ab.
		*/
		public static cloneLanguage(fromLanguage:string, toLanguage:string):void
		{
			Localization.modules[toLanguage] = Util.clone(Localization.modules[fromLanguage]);
		}



		/*
			Gibt ein gegebenes Datum als formatierten String in der
			gewählten Sprache zurück. formatId ist die id eines
			Strings aus der Lokalisierung, in welchem eine Vorlage
			für das Datumsformat steht.

			Folgende Tokens werden automatisch in dem gewählten
			Formatsstring ersetzt: D (Tag), DD (Tag, zweistellig),
			M (Monat), MM (Monat, zweistellig), YY (Jahr, zweistellig),
			YYYY (Jahr, vierstellig), H (Stunden), HH (Stunden,
			zweistellig), I (Minuten), II (Minuten, zweistellig),
			S (Sekunden) und SS (Sekunden, zweistellig).
		*/
		public static getFormattedDate(formatId:string, dateObj:any = new Date(), language?:string):string
		{
			if (dateObj === null || dateObj == "0000-00-00" || dateObj == "0000-00-00 00:00:00")
				return "";

			if (!(dateObj instanceof Date))
				dateObj = new Date(dateObj);

			return Localization.get(formatId, Localization.getDateTokens(dateObj), language);
		}



		public static getDateTokens(dateObj = new Date()):any
		{
			var tokens:any = {};
			tokens.D = dateObj.getDate();
			tokens.DD = (tokens.D < 10) ? "0" + tokens.D : tokens.D;
			tokens.M = dateObj.getMonth() + 1;
			tokens.MM = (tokens.M < 10) ? "0" + tokens.M : tokens.M;
			tokens.YYYY = dateObj.getFullYear();
			tokens.YY = tokens.YYYY % 100;
			tokens.H = dateObj.getHours();
			tokens.HH = (tokens.H < 10) ? "0" + tokens.H : tokens.H;
			tokens.I = dateObj.getMinutes();
			tokens.II = (tokens.I < 10) ? "0" + tokens.I : tokens.I;
			tokens.S = dateObj.getSeconds();
			tokens.SS = (tokens.S < 10) ? "0" + tokens.S : tokens.S;
			return tokens;
		}



		/*
			Diese Funktion ist das Gegenstück zu getFormattedDate.
			Sie gibt, wenn sie ein formatiertes Datum als String
			bekommt, ein Datumsobjekt zurück.
		*/
		public static getDateFromString(
			formatId:string,
			text:string,
			language?:string):Date
		{
			language = language || Localization.language;

			var raw = Localization.getRaw(formatId, language);
			if (!raw)
				return null;

			var values = Tokenizer.revertValues(raw, text);
			if (!values)
				return null;

			var date = new Date(0);
			for (var i in values)
			{
				var value = parseInt(values[i], 0);
				if (isNaN(value))
					return null;

				switch (i)
				{
					case "YY":
						var year = value;
						if (year > 30)
							date.setFullYear(year + 1900);
						else
							date.setFullYear(year + 2000);
						break;

					case "YYYY": date.setFullYear(value); break;
					case "M": case "MM": date.setMonth(value - 1); break;
					case "D": case "DD": date.setDate(value); break;
					case "H": case "HH": date.setHours(value); break;
					case "I": case "II": date.setMinutes(value); break;
					case "S": case "SS": date.setSeconds(value); break;
				}
			}
			return date;
		}



		private static getModule(language?:string, moduleName?:string):any
		{
			language = language || Localization.language;

			if (Localization.modules[language] == null)
				Localization.modules[language] = [];

			for (var i = 0; i < Localization.modules[language].length; ++i)
				if (Localization.modules[language][i].name == moduleName)
					return Localization.modules[language][i];

			var tempModule = {name:moduleName, items:{}};
			Localization.modules[language].push(tempModule);
			return tempModule;
		}



		public static dropModule(name:string):void
		{
			for (var lang in Localization.modules)
			{
				if (Localization.modules[lang][name])
					delete Localization.modules[lang][name];
			}
		}



		public static mergeModule(fromName:string, toName:string):void
		{
			if (fromName == toName)
				return;

			for (var lang in Localization.modules)
			{
				var from = Localization.getModule(lang, fromName);
				var to = Localization.getModule(lang, toName);
				for (var i in from.items)
					Localization.setModuleItem(to, i, from.items[i]);
			}
			Localization.dropModule(fromName);
		}



		public static addJSONModule(
			texts:{[id:string]:string},
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;

			var tempModule = Localization.getModule(language, moduleName);
			for (var id in texts)
				Localization.setModuleItem(tempModule, id, texts[id]);
			callback && callback();
		}



//# CLIENT
		public static addJSONModuleFromUrl(
			fileUrl:string,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;
			var loader = kr3m.loading.Loader2.getInstance();
			loader.loadFile(fileUrl, -1, function(texts:{[id:string]:string})
			{
				Localization.addJSONModule(texts, language, callback, moduleName);
			}, () =>
			{
				Log.logError("localization file " + fileUrl + " could not be loaded");
				callback && callback();
			});
		}
//# /CLIENT



//# !CLIENT
		public static addJSONModuleFromPath(
			filePath:string,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;
			kr3m.util.File.loadJsonFile(filePath, (texts) =>
			{
				Localization.addJSONModule(texts, language, callback, moduleName);
			});
		}
//# /!CLIENT



//# !CLIENT
		public static addXMLFileModule(
			filePath:string,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;
			fsLib.readFile(filePath, {encoding:"utf8"}, (error:Error, content:string) =>
			{
				if (error)
				{
					Log.logError("error while loading localization file " + filePath);
					Log.logError(error);
					return callback && callback();
				}

				var tempModule = Localization.getModule(language, moduleName);
				var data = kr3m.xml.parseString(content);
				if (data.text)
				{
					var texts = Array.isArray(data.text) ? data.text : [data.text];
					for (var i = 0; i < texts.length; ++i)
						Localization.setModuleItem(tempModule, texts[i]._attributes["id"], texts[i]._data);
				}
				else
				{
					Log.logError("error while loading localization file " + filePath);
				}
				callback && callback();
			});
		}
//# /!CLIENT



//# !CLIENT
		public static addXMLFileModuleSync(
			filePath:string,
			language?:string,
			moduleName?:string):void
		{
			language = language || Localization.language;
			try
			{
				var content = fsLib.readFileSync(filePath, {encoding:"utf8"});
				var tempModule = Localization.getModule(language, moduleName);
				var data = kr3m.xml.parseString(content);
				if (data.text)
				{
					var texts = Array.isArray(data.text) ? data.text : [data.text];
					for (var i = 0; i < texts.length; ++i)
						Localization.setModuleItem(tempModule, texts[i]._attributes["id"], texts[i]._data);
				}
			}
			catch(e)
			{
				Log.logError("error while loading localization file " + filePath);
				Log.logError(e);
			}
		}
//# /!CLIENT



//# CLIENT
		public static addXMLModule(
			xmlDoc:XMLDocument,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			if (!xmlDoc)
				return callback && callback();

			language = language || Localization.language;
			var tempModule = Localization.getModule(language, moduleName);
			var texts = xmlDoc.getElementsByTagName("text");
			var device = Device.getInstance();
			if (device.ie)
			{
				for (var i = 0; i < texts.length; ++i)
				{
					var key = texts[i].getAttribute("id");
					var value = texts[i].childNodes[0].nodeValue;
					Localization.setModuleItem(tempModule, key, value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1"));
				}
			}
			else
			{
				for (var i = 0; i < texts.length; ++i)
				{
					var key = texts[i].id;
					var value = texts[i].innerHTML;
					tempModule.items[key] = value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1");
					Localization.setModuleItem(tempModule, key, value.replace(/^\s*\<\!\[CDATA\[([\s\S]*?)\]\]\>\s*$/i, "$1"));
				}
			}
			callback && callback();
		}
//# /CLIENT



//# CLIENT
		public static addXMLModuleFromRawXml(
			rawXml:string,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;
			var tempModule = Localization.getModule(language, moduleName);
			var xml = kr3m.xml.parseString(rawXml);
			var texts = Array.isArray(xml.text) ? xml.text : [xml.text];
			for (var i = 0; i < texts.length; ++i)
			{
				var key = texts[i]._attributes.id;
				var value = texts[i]._data;
				Localization.setModuleItem(tempModule, key, value);
			}
			callback && callback();
		}
//# /CLIENT



//# CLIENT
		public static addXMLModuleFromUrl(
			fileUrl:string,
			language?:string,
			callback?:Callback,
			moduleName?:string):void
		{
			language = language || Localization.language;
			var loader = kr3m.loading.Loader2.getInstance();
			loader.loadFile(fileUrl, -1, "text", function(xml)
			{
				Localization.addXMLModuleFromRawXml(xml, language, callback, moduleName);
			}, () =>
			{
				Log.logError("localization file " + fileUrl + " could not be loaded");
				callback && callback();
			});
		}
//# /CLIENT
	}
}



kr3m.util.Tokenizer.setFormatter("loc", (value:any, tokens:any, name:string) => kr3m.util.Localization.get(value, tokens));
kr3m.util.Tokenizer.setFormatter("date", (value:any, tokens:any, name:string) => kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_DATE, value));
kr3m.util.Tokenizer.setFormatter("time", (value:any, tokens:any, name:string) => kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_TIME, value));
kr3m.util.Tokenizer.setFormatter("dateTime", (value:any, tokens:any, name:string) => kr3m.util.Localization.getFormattedDate(kr3m.FORMAT_DATETIME, value));



/*
	Convenience function so you don't have to write
	kr3m.util.Localization.get
	each time.
*/
//# !HIDE_GLOBAL
function loc(id:string, tokens?:any, languageId?:string):string
{
	return kr3m.util.Localization.get(id, tokens, languageId);
}
//# /!HIDE_GLOBAL



/*
	Convenience function so you don't have to write
	kr3m.util.Localization.getFormattedDate
	each time.
*/
//# !HIDE_GLOBAL
function locDate(id:string, dateObj:Date, languageId?:string):string
{
	return kr3m.util.Localization.getFormattedDate(id, dateObj, languageId);
}
//# /!HIDE_GLOBAL



/*
	Convenience function that works on the server and client side and
	automatically choses the proper way to load a file depending on
	its extension.

	Also sets the Localization.language variable to languageId.
*/
//# !HIDE_GLOBAL
function initLoc(
	pathOrUrl:string,
	languageId:string,
	callback?:Callback):void
{
	var ext = pathOrUrl.replace(/^.*\.([^\.]+)$/, "$1").toLowerCase();
	kr3m.util.Localization.language = languageId;
//# CLIENT
	if (ext == "xml")
		return kr3m.util.Localization.addXMLModuleFromUrl(pathOrUrl, languageId, callback);

	if (ext == "json" || ext == "js")
		return kr3m.util.Localization.addJSONModuleFromUrl(pathOrUrl, languageId, callback);
//# /CLIENT
//# !CLIENT
	if (ext == "xml")
		return kr3m.util.Localization.addXMLFileModule(pathOrUrl, languageId, callback);

	if (ext == "json" || ext == "js")
		return kr3m.util.Localization.addJSONModuleFromPath(pathOrUrl, languageId, callback);
//# /!CLIENT
	callback();
}
//# /!HIDE_GLOBAL

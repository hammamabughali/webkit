/// <reference path="../../async/join.ts"/>
/// <reference path="../../cache/files/localfiles.ts"/>
/// <reference path="../../net2/localizations/abstract.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../xml/parser.ts"/>



module kr3m.net2.localizations
{
	export class Simple extends Abstract
	{
		protected cachedTexts:{[hash:string]:{[id:string]:string}} = {};
		protected timestamps:{[hash:string]:number} = {};
		protected dependencies:{[langFile:string]:string[]} = {};



		constructor(protected config:kr3m.net2.configs.Localization)
		{
			super(config);

			this.setFormatter("date", (value, id, name, texts) => this.formatDate("FORMAT_DATE", value, texts));
			this.setFormatter("dateTime", (value, id, name, texts) => this.formatDate("FORMAT_DATETIME", value, texts));
			this.setFormatter("time", (value, id, name, texts) => this.formatDate("FORMAT_TIME", value, texts));
		}



		protected loadXml(
			path:string,
			callback:(texts:{[id:string]:string}) => void):void
		{
			kr3m.xml.parseLocalFile(path, (xml) =>
			{
				var texts:{[id:string]:string} = {};
				var items = xml.text.length ? xml.text : [xml.text];
				for (var i = 0; i < items.length; ++i)
					texts[items[i]._attributes["id"]] = items[i]._data;
				callback(texts);
			});
		}



		protected loadJson(
			path:string,
			callback:(texts:{[id:string]:string}) => void):void
		{
			kr3m.util.File.loadJsonFile(path, callback);
		}



		protected loadFromSource(
			path:string,
			callback:(texts:{[id:string]:string}) => void):void
		{
			kr3m.util.File.fileExists(path, (exists) =>
			{
				if (!exists)
					return callback(undefined);

				var extension = kr3m.util.File.getExtension(path);
				switch (extension)
				{
					case ".xml":
						return this.loadXml(path, callback);

					case ".json":
						return this.loadJson(path, callback);

					default:
						return callback(undefined);
				}
			});
		}



		protected onLangFileChanged(langFile:string):void
		{
			var hashes = this.dependencies[langFile] || [];
			logDebug("language file ", langFile, "has changed, clearing caches", hashes);
			for (var i = 0; i < hashes.length; ++i)
				delete this.cachedTexts[hashes[i]];
		}



		protected getSourceFiles(
			context:kr3m.net2.Context,
			callback:(files:string[]) => void):void
		{
			this.getLoadOrder(context, (locales) =>
			{
				var langFiles = locales.map(locale => this.config.filePath + "/lang_" + locale + "." + this.config.extension);
				callback(langFiles);
			});
		}



		public getTexts(
			context:kr3m.net2.Context,
			callback:(texts:{[id:string]:string}) => void):void
		{
			this.getHash(context, (hash) =>
			{
				if (this.cachedTexts[hash])
					return callback(this.cachedTexts[hash]);

				this.getSourceFiles(context, (langFiles) =>
				{
					var join = new kr3m.async.Join();
					for (var i = 0; i < langFiles.length; ++i)
						this.loadFromSource(langFiles[i], join.getCallback(i));

					join.addCallback(() =>
					{
						var texts:{[id:string]:string} = {};
						for (var i = 0; i < langFiles.length; ++i)
						{
							var joinTexts:{[id:string]:string} = join.getResult(i);
							if (!joinTexts)
							{
								logDebug("could not load localization file", langFiles[i]);
								continue;
							}

							texts = kr3m.util.Util.mergeAssoc(texts, joinTexts);
							if (!this.dependencies[langFiles[i]])
							{
								this.dependencies[langFiles[i]] = [];
								fsLib.watch(langFiles[i], {persistant : false}, this.onLangFileChanged.bind(this, langFiles[i]));
							}
							if (this.dependencies[langFiles[i]].indexOf(hash) < 0)
								this.dependencies[langFiles[i]].push(hash);
						}
						this.cachedTexts[hash] = texts;
						this.timestamps[hash] = Date.now();
						callback(texts);
					});
				});
			});
		}



		public getTimestamp(
			context:kr3m.net2.Context,
			callback:CB<number>):void
		{
			this.getHash(context, (hash) =>
			{
				if (this.timestamps[hash])
					return callback(this.timestamps[hash]);

				this.getTexts(context, () => callback(this.timestamps[hash]));
			});
		}



		protected getFormattedToken(
			texts:{[id:string]:string},
			rawId:string,
			tokens:Tokens):string
		{
			if (!tokens)
				return "";

			if (!rawId)
				return "";

			var [tokenId, formatterName] = rawId.split(":");
			if (!tokenId)
				return "";

			var value = tokens[tokenId];
			if (value === undefined)
				return "";

			if (formatterName)
			{
				if (this.formatters[formatterName])
					return this.formatters[formatterName](value, tokenId, formatterName, texts);
				else
					logDebug("unknown formatter", formatterName);
			}

			return value.toString();
		}



		protected getFormattedLoc(
			texts:{[id:string]:string},
			rawId:string,
			tokens:Tokens):string
		{
			if (!rawId)
				return "";

			var [locId, formatterName] = rawId.split(":");
			if (!locId)
				return "";

			var value = texts[locId];
			if (value === undefined)
				logDebug("unknown localization id", locId);
			else
				value = value.replace(/\#\#(.+?)\#\#/gi, (match, tokenId) => this.getFormattedToken(texts, tokenId, tokens));

			if (formatterName)
			{
				if (this.formatters[formatterName])
					value = this.formatters[formatterName](value, locId, formatterName, texts);
				else
					logDebug("unknown formatter", formatterName);
			}

			return value;
		}



		protected parseSync(
			texts:{[id:string]:string},
			text:string,
			tokens:Tokens):string
		{
			text = text.replace(/\bloc\(([^\)]+)\)/gi, (match, rawId) => this.getFormattedLoc(texts, rawId, tokens));
			text = text.replace(/\#\#(.+?)\#\#/gi, (match, tokenId) => this.getFormattedToken(texts, tokenId, tokens));
			return text;
		}



		public parse(
			context:kr3m.net2.Context,
			text:string,
			tokens:Tokens,
			callback:StringCallback):void
		{
			this.getTexts(context, (texts) =>
			{
				callback(this.parseSync(texts, text, tokens));
			});
		}



		public getLoc(
			context:kr3m.net2.Context,
			callback:CB<LocFunc>):void
		{
			this.getTexts(context, (texts) =>
			{
				var loc = this.getFormattedLoc.bind(this, texts);
				callback(loc);
			});
		}



		public getSyncParseFunc(
			context:kr3m.net2.Context,
			callback:CB<LocFunc>):void
		{
			this.getTexts(context, (texts) =>
			{
				var parseFunc = this.parseSync.bind(this, texts);
				callback(parseFunc);
			});
		}



		protected getDateTokens(dateObj:Date):Tokens
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



		protected formatDate(
			formatId:string,
			dateObj:Date|number|string,
			texts:{[id:string]:string}):string
		{
			if (dateObj === null || dateObj == "0000-00-00" || dateObj == "0000-00-00 00:00:00")
				return "";

			if (!(dateObj instanceof Date))
				dateObj = new Date(<any> dateObj);

			var tokens = this.getDateTokens(<Date> dateObj);
			return this.getFormattedLoc(texts, formatId, tokens);
		}
	}
}

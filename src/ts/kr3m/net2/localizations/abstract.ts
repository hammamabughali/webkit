/// <reference path="../../model/eventdispatcher.ts"/>
/// <reference path="../../net2/configs/localization.ts"/>
/// <reference path="../../net2/context.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/util.ts"/>



module kr3m.net2.localizations
{
	export type Formatter = (value:any, id:string, formatterName:string, texts:{[id:string]:string}) => string;



	/*
		Class for server-side localization management. In contrast
		to the quite simple client-side localization this class has
		to handle multiple localizations at the same time and use
		the appropriate one depending on the current user's request
		context. Also changes to the localization files have to be
		noticed and propagated to every other class using this
		localization.
	*/
	export abstract class Abstract extends kr3m.model.EventDispatcher
	{
		protected formatters:{[name:string]:Formatter} = {};



		constructor(protected config:kr3m.net2.configs.Localization)
		{
			super();
		}



		public setFormatter(
			name:string,
			formatter:Formatter):void
		{
			this.formatters[name] = formatter;
		}



		/*
			Returns a unique hash for a the loaded localization
			based on the values stored in context. This hash can
			later be used to react to changes in the localization.
		*/
		public getHash(
			context:kr3m.net2.Context,
			callback:StringCallback):void
		{
			context.need({locales : true}, () =>
			{
				var locales = kr3m.util.Util.intersect(context.locales, this.config.locales);
				var locale = locales[0] || this.config.locales[0] || this.config.fallbackLocale;
				callback(locale);
			}, () => callback(this.config.fallbackLocale));
		}



		/*
			Returns an array containing locales. The order of the
			locales is the same order language files should be
			loaded (latter files overwriting data from earlier
			files).
		*/
		public getLoadOrder(
			context:kr3m.net2.Context,
			callback:CB<string[]>):void
		{
			this.getHash(context, (hash) =>
			{
				var locales:string[] = [];
				locales.push(hash);
				locales.push(hash.slice(0, 2));
				locales.push(this.config.fallbackLocale);
				locales = kr3m.util.Util.removeDuplicates(locales);
				locales.reverse();
				callback(locales);
			});
		}



		/*
			Returns the timestamp when the localization for the
			given context was last updated.
		*/
		public abstract getTimestamp(
			context:kr3m.net2.Context,
			callback:CB<number>):void;



		/*
			This methode parses the content of text and replaces every
			occurance of loc(XYZ) with the localization string with the
			id XYZ.
		*/
		public abstract parse(
			context:Context,
			text:string,
			tokens:Tokens,
			callback:StringCallback):void;



		/*
			Returns all localization texts available in the given context.
		*/
		public abstract getTexts(
			context:kr3m.net2.Context,
			callback:(texts:{[id:string]:string}) => void):void;



		/*
			Returns a loc-Function that can be used in some of the older
			classes that require localizations of generic texts.
		*/
		public abstract getLoc(
			context:kr3m.net2.Context,
			callback:CB<LocFunc>):void;



		/*
			Returns a synchronous parsing function that can be used
			to replace all localization entries and tokens in an
			arbitrary text with the appropriate strings.
		*/
		public abstract getSyncParseFunc(
			context:kr3m.net2.Context,
			callback:CB<LocFunc>):void;
	}
}

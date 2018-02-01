/// <reference path="../lang/en.ts"/>
/// <reference path="../lang/engb.ts"/>
/// <reference path="../lang/enus.ts"/>



module kr3m.lang
{
	export function get(languageId:string, countryId?:string):Abstract
	{
		languageId = languageId.toLowerCase();
		countryId = countryId ? countryId.toUpperCase() : countryId;

		if (countryId)
		{
			var className = languageId + countryId;
			if (kr3m.lang[className])
				return new kr3m.lang[className]();
		}

		if (kr3m.lang[languageId])
			return new kr3m.lang[languageId]();

		return undefined;
	}
}

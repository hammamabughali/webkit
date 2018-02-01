/// <reference path="../lang/abstract.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.lang
{
	export class en extends Abstract
	{
		public static readonly SPECIAL_SINGULARS =
		{
			"cookies" : "cookie",
			"kisses" : "kiss",
			"men" : "man",
			"women" : "woman",
			"children" : "child",
			"mice" : "mouse",
			"teeth" : "tooth",
			"geese" : "goose",
			"feet" : "foot",
			"oxen" : "ox"
		};

		public static readonly SPECIAL_PLURALS =
		{
			"man" : "men",
			"woman" : "women",
			"child" : "children",
			"mouse" : "mice",
			"tooth" : "teeth",
			"goose" : "geese",
			"foot" : "feet",
			"ox" : "oxen"
		};



		constructor()
		{
			super();
			this.languageId = "en";
		}



		public getSingular(word:string):string
		{
			if (en.SPECIAL_SINGULARS[word])
				return en.SPECIAL_SINGULARS[word];

			if (word.slice(-3) == "ies")
				return word.slice(0, -3) + "y";

			if (word.slice(-1) == "s")
				return word.slice(0, -1);

			return word;
		}



		public getPlural(word:string):string
		{
			if (en.SPECIAL_PLURALS[word])
				return en.SPECIAL_PLURALS[word];

			var matches = word.match(/([aeiou])?y$/i);
			if (matches)
				return matches[1] ? word + "s" : word.slice(0, -1) + "ies";

			if (word.match(/[hsx]$/i))
				return word + "es";

			return word + "s";
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var en = new kr3m.lang.en();
	var CS = kr3m.unittests.CaseSync;

	new kr3m.unittests.Suite("kr3m.lang.en")
	.add(new CS("getPlural I", () => en.getPlural("name"), "names"))
	.add(new CS("getPlural II", () => en.getPlural("kiss"), "kisses"))
	.add(new CS("getPlural III", () => en.getPlural("ability"), "abilities"))
	.add(new CS("getPlural IV", () => en.getPlural("user"), "users"))
	.add(new CS("getPlural V", () => en.getPlural("cookie"), "cookies"))
	.add(new CS("getPlural VI", () => en.getPlural("box"), "boxes"))
	.add(new CS("getPlural VI", () => en.getPlural("sandwich"), "sandwiches"))
	.add(new CS("getPlural VII", () => en.getPlural("day"), "days"))
	.add(new CS("getPlural VIII", () => en.getPlural("child"), "children"))

	.add(new CS("getSingular I", () => en.getSingular("names"), "name"))
	.add(new CS("getSingular II", () => en.getSingular("kisses"), "kiss"))
	.add(new CS("getSingular III", () => en.getSingular("abilities"), "ability"))
	.add(new CS("getSingular IV", () => en.getSingular("users"), "user"))
	.add(new CS("getSingular V", () => en.getSingular("cookies"), "cookie"))
	.add(new CS("getSingular VI", () => en.getSingular("children"), "child"))
	.run();
}, 1);
//# /UNITTESTS

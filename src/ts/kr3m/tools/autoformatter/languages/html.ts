///<reference path="../../../tools/autoformatter/languages/language.ts"/>
///<reference path="../../../util/stringex.ts"/>



module kr3m.tools.autoformatter.languages
{
	export class Html extends Language
	{
		constructor()
		{
			super(/\.html?$/i);
		}



		public autoformat(code:string, filePath:string):string
		{
			if (code.indexOf("\n") < 0)
				code = code.replace(/\r/g, "\n");

			code = kr3m.util.StringEx.stripBom(code);
			code = code
				.replace(/\r/g, "")
				.replace(/[\t ]+\n/g, "\n");

			return kr3m.util.StringEx.BOM + code;
		}
	}
}



kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Html());

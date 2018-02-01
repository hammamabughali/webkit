///<reference path="../../../tools/autoformatter/languages/language.ts"/>
///<reference path="../../../util/stringex.ts"/>



module kr3m.tools.autoformatter.languages
{
	export class Css extends Language
	{
		constructor()
		{
			super(/\.css$/i);
		}



		public autoformat(code:string, filePath:string):string
		{
			if (code.indexOf("\n") < 0)
				code = code.replace(/\r/g, "\n");

			code = kr3m.util.StringEx.stripBom(code);
			code = code
				.replace(/\r/g, "")
				.replace(/[\t ]+\n/g, "\n");

			return code;
		}
	}
}



kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Css());

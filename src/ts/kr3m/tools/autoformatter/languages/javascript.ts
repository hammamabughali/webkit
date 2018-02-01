///<reference path="../../../tools/autoformatter/languages/language.ts"/>
///<reference path="../../../util/stringex.ts"/>



module kr3m.tools.autoformatter.languages
{
	export class Javascript extends Language
	{
		constructor()
		{
			super(/\.js$/i);
		}



		public autoformat(code:string, filePath:string):string
		{
			if (code.indexOf("\n") < 0)
				code = code.replace(/\r/g, "\n");

			code = kr3m.util.StringEx.stripBom(code);
			code = kr3m.util.StringEx.replaceSuccessive(code, /\n(\t*)    /g, "\n$1\t");
			code = code
				.replace(/\r/g, "")
				.replace(/[\t ]+\n/g, "\n")
				.replace(/if\(/g, "if (")
				.replace(/for\(/g, "for (")
				.replace(/while\(/g, "while (")
				.replace(/switch\(/g, "switch (")
				.replace(/\n(\t*) +/g, "\n$1")
				.replace(/\n\t+\n/g, "\n\n")
				.replace(/\n(\t*)([^\n\t]+)\{\n/g, "\n$1$2\n$1{\n")
				.replace(/[\t ]+\n/g, "\n");

			return code;
		}
	}
}



//# FIXME: Javascript ist erst mal abgeschaltet
// kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Javascript());

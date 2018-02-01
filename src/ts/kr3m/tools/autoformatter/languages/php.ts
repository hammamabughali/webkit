///<reference path="../../../tools/autoformatter/languages/language.ts"/>
///<reference path="../../../util/stringex.ts"/>



module kr3m.tools.autoformatter.languages
{
	export class Php extends Language
	{
		constructor()
		{
			super(/\.php?$/i);
		}



		public autoformat(code:string, filePath:string):string
		{
			if (code.indexOf("\n") < 0)
				code = code.replace(/\r/g, "\n");

			code = kr3m.util.StringEx.stripBom(code);
			code = kr3m.util.StringEx.replaceSuccessive(code, /\n(\t*)    /g, "\n$1\t");
			code = code
				.replace(/\r/g, "")
				.replace(/if\(/g, "if (")
				.replace(/for\(/g, "for (")
				.replace(/while\(/g, "while (")
				.replace(/switch\(/g, "switch (")
				.replace(/\n(\t*)([^\n\t]+)\{\n/g, "\n$1$2\n$1{\n")
				.replace(/([\{\}])\n\n+(\t*\{)/g, "$1\n$2")
				.replace(/\n+\n(\t*\})/g, "\n$1")
				.replace(/(\t+)\} else/g, "$1}\n$1else")
				.replace(/return\s+/g, "return ")
				.replace(/[\t ]+\n/g, "\n");

			return code;
		}
	}
}



kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Php());

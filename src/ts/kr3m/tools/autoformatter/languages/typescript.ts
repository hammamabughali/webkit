/// <reference path="../../../tools/autoformatter/languages/language.ts"/>
/// <reference path="../../../util/stringex.ts"/>



module kr3m.tools.autoformatter.languages
{
	export class Typescript extends Language
	{
		constructor()
		{
			super(/\.ts$/i);
		}



		private padReferences(filePath:string, lines:string[]):void
		{
			filePath = filePath.replace(/\\/g, "/");
			var fileParts = filePath.split("/").slice(0, -1);
			fileParts.reverse();
			var upCount = 0;
			var pat = /["'](.+)['"]/;
			for (var i = 0; i < lines.length; ++i)
			{
				var matches = lines[i].match(pat);
				var file = matches[1];
				var parts = file.split("/");
				for (var j = 0; j < parts.length; ++j)
				{
					if (parts[j] == "..")
						upCount = Math.max(upCount, j + 1);
				}
			}
			for (var i = 0; i < lines.length; ++i)
			{
				var matches = lines[i].match(pat);
				var file = matches[1];
				var parts = file.split("/");
				for (var j = 0; j < upCount; ++j)
				{
					if (parts[j] != "..")
						parts.splice(j, 0, "..", fileParts[j]);
				}
				lines[i] = '/// <reference path="' + parts.join("/") + '"/>';
			}
		}
		
		
		
		private formatFunctionSignature(
			complete:string,
			tabs:string,
			funcDef:string,
			paramDef:string,
			typeDef:string):string
		{
			if (complete.length < 100)
				return complete;
				
			var output = tabs + funcDef;
			paramDef = paramDef.trim();
			if (paramDef)
			{
				var params = kr3m.util.StringEx.splitNoQuoted(paramDef);
				params = params.map((param:string) => param.trim());
				paramDef = "\n\t" + tabs + params.join(",\n\t" + tabs);
			}
			output += paramDef + typeDef;
			return output;
		}



		public autoformat(code:string, filePath:string):string
		{
			if (filePath.match(/autoformatter\/languages\/.+\.ts$/i))
				return code;

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
				.replace(/\)=>/g, ") =>")
				.replace(/=>([^"'\s])/g, "=> $1")
				.replace(/\n(\t*) +/g, "\n$1")
				.replace(/\/\/\/<reference/g, "/// <reference")
				.replace(/\n\t+\n/g, "\n\n")
				.replace(/\n(\t*)([^\n\t\/]+)\{\n/g, "\n$1$2\n$1{\n")
				.replace(/([\{\}])\n\n+(\t*\{)/g, "$1\n$2")
				.replace(/\n+\n(\t*\})/g, "\n$1")
				.replace(/(\t+)\} else/g, "$1}\n$1else")
				.replace(/return\s+/g, "return ")
				.replace(/[\t ]+\n/g, "\n")
				.replace(/\n{5,}/g, "\n\n\n\n")
				.replace(/\n*$/, "\n")
				.replace(/\{\n+/g, "{\n")
				.replace(/\n+(\s*)\}/g, "\n$1}")
				.replace(/(\t*)((?:export\s+)?(?:public|protected|private|function)\s+(?:static\s+)?(?:abstract\s+)?[\w<>:.]+\s*\()([^)]*)(\)\s*\:\s*[^;{]+[;{])/g, this.formatFunctionSignature)
				.replace(/(\t*)(constructor\s*\()([^)]*)(\)\s*\:\s*[^;{]+[;{])/g, this.formatFunctionSignature);
				
			var lines = code.split("\n");

			for (var i = 0; i < lines.length; ++i)
			{
				if (lines[i].indexOf("/// <reference") < 0)
					break;

				lines[i] = lines[i].toLowerCase();
			}
			if (i > 0)
			{
				var includeLines = lines.slice(0, i);
				this.padReferences(filePath, includeLines);
				includeLines.sort();
				for (var j = 0; j < includeLines.length - 1; ++j)
				{
					if (includeLines[j] == includeLines[j + 1])
						includeLines.splice(j--, 1);
				}
				lines = includeLines.concat(lines.slice(i));
			}

			code = lines.join("\n");
			return kr3m.util.StringEx.BOM + code;
		}
	}
}



kr3m.tools.autoformatter.languages.Language.languages.push(new kr3m.tools.autoformatter.languages.Typescript());

/// <reference path="../../../tools/precompiler/handlers/abstract.ts"/>
/// <reference path="../../../tools/precompiler/linechanges.ts"/>
/// <reference path="../../../tools/precompiler/parser.ts"/>
/// <reference path="../../../util/file.ts"/>
/// <reference path="../../../util/stringex.ts"/>



module kr3m.tools.precompiler.handlers
{
	export class Compile extends Abstract
	{
		private static lineChanges:{[path:string]:kr3m.tools.precompiler.LineChanges} = {};



		constructor(params:kr3m.tools.precompiler.Parameters)
		{
			super(params);
		}



		public static removeByFlags(
			currentPath:string,
			content:string,
			params:kr3m.tools.precompiler.Parameters):string
		{
			var parser = new kr3m.tools.precompiler.Parser(content);
			var lines = parser.getLines();
			var flagPat = /(!?\w+)/;
			var lineChanges = new kr3m.tools.precompiler.LineChanges();
			Compile.lineChanges[currentPath] = lineChanges;
			for (var i = 0; i < lines.length; ++i)
			{
				if (flagPat.test(lines[i].content))
				{
					var positive = lines[i].content.charAt(0) != "!";
					var flag = positive ? lines[i].content : lines[i].content.slice(1);
					var hasFlag = params.hasFlag(flag);
					var keep = (positive && hasFlag) || (!positive && !hasFlag);
					var search = "/" + lines[i].content;
					for (var j = i + 1; j < lines.length; ++j)
					{
						if (lines[j].content == search)
						{
							if (keep)
							{
								var offsetDelta = lines[i].end - lines[i].start;
								for (var k = i + 1; k < j; ++k)
								{
									lines[k].start -= offsetDelta;
									lines[k].end -= offsetDelta;
								}
								offsetDelta += lines[j].end - lines[j].start;
								for (var k = j + 1; k < lines.length; ++k)
								{
									lines[k].start -= offsetDelta;
									lines[k].end -= offsetDelta;
								}
								content = content.slice(0, lines[i].start) + content.slice(lines[i].end, lines[j].start) + content.slice(lines[j].end);
								lineChanges.remove(lines[j].line, 1);
								lines.splice(j, 1);
								lineChanges.remove(lines[i].line, 1);
								lines.splice(i, 1);
							}
							else
							{
								var offsetDelta = lines[j].end - lines[i].start;
								content = content.slice(0, lines[i].start) + content.slice(lines[j].end);
								lineChanges.remove(lines[i].line, lines[j].line - lines[i].line + 1);
								lines.splice(i, j - i + 1);
								for (var k = i; k < lines.length; ++k)
								{
									lines[k].start -= offsetDelta;
									lines[k].end -= offsetDelta;
								}
							}

							--i;
							break;
						}
					}
				}
			}
			return content;
		}



		private adjustReferences(content:string):string
		{
			var patReference = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;
			content = content.replace(patReference, (match, captured) =>
			{
				return '/// <reference path="' + this.getCompiledFileName(captured) + '"/>';
			});
			return content;
		}



		private embed(currentPath:string, content:string):string
		{
			var patEmbed = /\/\/\#\s+EMBED\((.+?)\)/g;
			for (var oldContent = ""; oldContent != content; oldContent = content)
			{
				content = content.replace(patEmbed, (match, captured) =>
				{
					var args = captured.split(",");
					if (args.length < 1)
						return match;

					args = args.map(arg => arg.trim());

					var path = kr3m.util.File.resolvePath(currentPath, args[0]);
					try
					{
						var content = <string> fsLib.readFileSync(path, {encoding:"utf8"});
					}
					catch(e)
					{
						this.error("embed path not found: " + path);
						var content = "";
					}

					content = kr3m.util.StringEx.stripBom(content);

					var outputType = args[1] || "string";
					switch (outputType)
					{
						case "string":
							return content || "";

						case "json":
							return kr3m.util.Json.escapeSpecialChars(kr3m.util.Json.encode(content));

						case "jsonNoQuotes":
							return kr3m.util.Json.escapeSpecialChars(kr3m.util.Json.encode(content)).replace(/^"(.*)"$/, "$1");

						case "dataUrl":
							return kr3m.util.File.getAsDataUrlSync(path);

						default:
							logWarning("unknown embed type:", outputType);
							return match;
					}
				});
			}
			return content;
		}



		private replace(content:string):string
		{
			for (var i = 0; i < this.params.replacements.length; ++i)
			{
				var pattern = new RegExp(this.params.replacements[i].pattern, "g");
				var value = this.params.replacements[i].value;
				content = content.replace(pattern, value);
			}
			return content;
		}



		private checkTscVersion(requiredText:string):void
		{
			var required = kr3m.util.StringEx.getVersionParts(requiredText);
			var available = kr3m.util.StringEx.getVersionParts(this.params.tscVersion);
			for (var i = 0; i < 3; ++i)
			{
				if (required[i] < available[i])
					return;

				if (required[i] > available[i])
				{
					this.error("ERROR: TSC " + requiredText + " required");
					return;
				}
			}
		}



		private printComments(currentPath:string, content:string):string
		{
			if (this.params.showComments)
			{
				var parser = new kr3m.tools.precompiler.Parser(content);
				var lines = parser.getLines();
				for (var i = 0; i < lines.length; ++i)
				{
					var comment = lines[i].content;
					var tscMatches = comment.match(/TSC\s+(\d+\.\d+\.\d+)/i);
					if (tscMatches)
					{
						this.checkTscVersion(tscMatches[1]);
						continue;
					}

					if (comment.substr(0, 5).toUpperCase() == "ERROR")
						this.error(comment);
					else if (comment.substr(0, 5).toUpperCase() == "FIXME")
						this.warning(comment);
					else if (comment.substr(0, 10).toUpperCase() == "DEPRECATED")
						this.deprecated(comment);
					else if (comment.substr(0, 8).toUpperCase() == "UNSTABLE")
						this.unstable(comment);
					else
						this.comment(comment);
				}
			}
			return content;
		}



		public handle(currentPath:string, content:string):void
		{
			super.handle(currentPath, content);

			content = this.adjustReferences(content);
			content = this.embed(currentPath, content);
			content = this.replace(content);
			content = this.printComments(currentPath, content);

			var newFileName = this.getCompiledFileName(currentPath);
			if (this.params.verbose)
				log("  writing file " + newFileName);
			fsLib.writeFileSync(newFileName, content);
		}



		public adjustErrorOutput(output:string):string
		{
			var errorPattern = /(.+)\.pc\.ts\((\d+),(\d+)\)/g;
			output = output.replace(errorPattern, (complete, filePath, lineTxt, colTxt) =>
			{
				var line = parseInt(lineTxt, 10);
				var column = parseInt(colTxt, 10);

				try
				{
					var realPath = fsLib.realpathSync(filePath + ".ts").replace(/\\/g, "/");
				}
				catch(e)
				{
					return complete;
				}

				var lineChanges = Compile.lineChanges[realPath];
				line = lineChanges.adjustLine(line);
				return filePath + ".ts(" + line + "," + column + ")";
			});
			return output;
		}
	}
}

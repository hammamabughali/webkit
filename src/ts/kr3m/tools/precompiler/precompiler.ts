/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/childprocess.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../tools/precompiler/handlers/abstract.ts"/>
/// <reference path="../../tools/precompiler/handlers/clean.ts"/>
/// <reference path="../../tools/precompiler/handlers/compile.ts"/>
/// <reference path="../../tools/precompiler/parameters.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/childprocess.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/log.ts"/>



const parserLib = require("./lib/parse-js");
const processLib = require("./lib/process");
const consolidatorLib = require("./lib/consolidator");



module kr3m.tools.precompiler
{
	export class Precompiler
	{
		private static addReference(references:any, from:string, to:string):void
		{
			if (references === undefined || references === null)
				return;

			if (!references[from])
				references[from] = [];

			references[from].push(to);
		}



		private crawl(
			params:kr3m.tools.precompiler.Parameters,
			handler:kr3m.tools.precompiler.handlers.Abstract,
			references?:any):void
		{
			var filePath = fsLib.realpathSync(params.sourcePath);
			filePath = filePath.replace(/\\/g, "/");
			var pendingFiles:string[] = [filePath];
			var completedFiles:{[file:string]:boolean} = {};

			var patReference = /\/\/\/\s*<reference\s+path\s*=\s*["']([^"']+)["']\s*\/>/g;

			while (pendingFiles.length > 0)
			{
				var currentFile = pendingFiles.shift();
				if (!fsLib.existsSync(currentFile))
					continue;

				if (!completedFiles[currentFile])
				{
					if (params.verbose)
						log("processing " + currentFile);

					completedFiles[currentFile] = true;
					var stats = fsLib.statSync(currentFile);
					if (stats.isDirectory())
					{
						logError("Error: file is a directory: " + currentFile);
						continue;
					}
					var content = fsLib.readFileSync(currentFile, "utf-8");
					content = kr3m.tools.precompiler.handlers.Compile.removeByFlags(currentFile, content, params);
					content.replace(patReference, function(match:any, captured?:string):string
					{
						var relativePath = kr3m.util.File.resolvePath(currentFile, captured);
						if (fsLib.existsSync(relativePath))
						{
							pendingFiles.push(relativePath);
							kr3m.tools.precompiler.Precompiler.addReference(references, currentFile, relativePath);
						}
						return match;
					});
					handler.handle(currentFile, content);
				}
			}
		}



		private removeRedundantDefines(
			params:kr3m.tools.precompiler.Parameters,
			callback:Callback):void
		{
			if (!params.kind || params.kind.toLowerCase() != "amd")
				return callback();

			log("removing redundant defines from " + params.targetPath);
			fsLib.readFile(params.targetPath, {encoding : "utf-8"}, (err:Error, code:string) =>
			{
				if (err)
				{
					logError(err);
					process.exit(2);
				}

				var lines = code.split("\r\n");
				var defineBlocks:any = [];
				for (var i = 0; i < lines.length; ++i)
				{
					if (lines[i].slice(0, 8) == "define(\"")
					{
						lines[i] = lines[i].replace(/\.pc\"/gi, "\"");
						for (var j = i + 1; j < lines.length; ++j)
						{
							if (lines[j] == "});")
							{
								defineBlocks.push({from : i, count : j - i + 1});
								i = j;
								break;
							}
						}
					}
				}

				if (defineBlocks.length > 1)
				{
					defineBlocks.pop();
					while (defineBlocks.length > 0)
					{
						var block = defineBlocks.pop();
						lines.splice(block.from, block.count);
					}
				}

				code = lines.join("\r\n");

				fsLib.writeFile(params.targetPath, code, (err:Error) =>
				{
					if (err)
					{
						logError(err);
						process.exit(3);
					}

					callback();
				});
			});
		}



		private minimizeIfWanted(
			params:kr3m.tools.precompiler.Parameters,
			callback:Callback):void
		{
			if (!params.minimize)
				return callback();

			log("minimizing " + params.targetPath);
			fsLib.readFile(params.targetPath, {encoding : "utf-8"}, (err:Error, code:string) =>
			{
				if (err)
				{
					logError(err);
					process.exit(2);
				}

				code = parserLib.parse(code);
				code = processLib.ast_mangle(code);
				code = processLib.ast_squeeze(code);
				code = processLib.gen_code(code);

				fsLib.writeFile(params.targetPath, code, (err:Error) =>
				{
					if (err)
					{
						logError(err);
						process.exit(3);
					}

					callback();
				});
			});
		}



		public build(params:kr3m.tools.precompiler.Parameters):void
		{
			log("building " + params.sourcePath);

			log("precompiling...");

			var references:any = params.checkReferenceLoops ? {} : null;
			var compileHandler = new kr3m.tools.precompiler.handlers.Compile(params);
			this.crawl(params, compileHandler, references);
			if (compileHandler.hasErrors())
			{
				var cleanHandler = new kr3m.tools.precompiler.handlers.Clean(params);
				this.crawl(params, cleanHandler);

				logError("aborted -", compileHandler.getErrorCount(), "errors found");
				process.exit(1);
			}

			if (references)
			{
				logError("checking for reference loops NYI");
				debug(references);
			}

			var args:string[] = [];

			var pcFilePath = compileHandler.getCompiledFileName(params.sourcePath);
			args.push("--noEmitOnError", "--removeComments", pcFilePath);

			if (params.targetPath)
				args.push("--out", params.targetPath);

			if (params.kind)
				args.push("-m", params.kind);

			if (params.generateDescription)
				args.push("-d");

			if (params.target)
				args.push("-t", params.target);

			args.push(...params.unknownParams);

			log("compiling...");
			var childProcess = new kr3m.util.ChildProcess("tsc", args);
			childProcess.exec((status) =>
			{
				var cleanHandler = new kr3m.tools.precompiler.handlers.Clean(params);
				this.crawl(params, cleanHandler);

				if (status != kr3m.SUCCESS)
				{
					var errorOutput = childProcess.getOutputString() + "\n" + childProcess.getErrorString();
					errorOutput = compileHandler.adjustErrorOutput(errorOutput);
					logError(errorOutput);
					var errors = errorOutput.match(/\(\d+,\d+\)\: error TS/g);
					logError("aborted -", errors ? errors.length : 0, "errors found");
					process.exit(1);
				}
				else
				{
					this.removeRedundantDefines(params, () =>
					{
						this.minimizeIfWanted(params, () =>
						{
							log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
						});
					});
				}
			});
		}



		public compile(params:kr3m.tools.precompiler.Parameters):void
		{
			log("compiling " + params.sourcePath);
			var handler = new kr3m.tools.precompiler.handlers.Compile(params);
			this.crawl(params, handler);
			log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
		}



		public clean(params:kr3m.tools.precompiler.Parameters):void
		{
			log("cleaning for " + params.sourcePath);
			var handler = new kr3m.tools.precompiler.handlers.Clean(params);
			this.crawl(params, handler);
			log(kr3m.util.Log.COLOR_BRIGHT_GREEN + "done" + kr3m.util.Log.COLOR_RESET);
		}



		private showHelpText():void
		{
			log("");
			log("  Der Precompiler ist ein einfaches Textersetzungsprogramm,");
			log("  das ausgeführt werden kann, bevor Typescript Dateien an den");
			log("  tsc Compiler geschickt werden. Das Hauptanwendungsgebiet");
			log("  besteht darin, Teile des Sourcecodes unter bestimmten");
			log("  Bedinungen vor dem Compilieren zu entfernen, um z.B. sicher");
			log("  zu stellen, dass kein Servercode im Clientcode oder kein");
			log("  Debugcode im Releaseprodukt erscheint.");
			log("");
			log("");
			log("  Mögliche Operationen:");
			log("");
			log("    precompiler build SOURCEFILE [-v] [-f FLAG]* [-o OUTPUTFILE]");
			log("      Führt compile aus gefolgt von einem tsc Aufruf um die");
			log("      Datei zu kompilieren und anschließend ein clean. Im");
			log("      Prinzip ist build ein \"Gesamtpaket\".");
			log("");
			log("    precompiler compile SOURCEFILE [-v] [-f FLAG]*");
			log("      Precompiliert die Datei SOURCEFILE und alle von ihr");
			log("      referenzierten Dateien und speichert das Ergebnis an");
			log("      der gleichen Stelle als .pc.ts Datei ab.");
			log("");
			log("    precompiler clean SOURCEFILE [-v]");
			log("      Löscht alle beim Vorcompilieren der Datei SOURCEFILE");
			log("      angelegten .pc.ts Dateien.");
			log("");
			log("");
			log("  Allgemeine Parameter:");
			log("");
			log("    -c - Precompiler Kommentare anzeigen");
			log("    -d - erzeugt zusätzlich eine .d.ts Datei");
			log("    -f FLAG - setzt FLAG für die Entfernung von Teilen des");
			log("       Sourcecodes");
			log("    -g ausschließlich Grau als Ausgabefarbe benutzen");
			log("    -k KIND - setzt den module kind Paramter");
			log("    -l prüft auf Schleifen (loops) in den reference Anweisungen");
			log("    -m - minimiert erzeugte JS-Dateien");
			log("    -o OUTPUTFILE - speichert das Ergebnis in OUTPUTFILE");
			log("       statt in der Standarddatei");
			log("    -r PATTERN VALUE - ersetzt alle mit PATTERN gefundenen");
			log("       Texte des Sourcecodes durch VALUE");
			log("    -s - alle Ausgaben unterdrücken");
			log("    -t TARGET - gibt das Ergebnis in einer anderen Sprachversion");
			log("       aus, Möglichkeiten für TARGET sind die selben wie für den");
			log("       gleichen Parameter im tsc");
			log("    -v Verbose Mode - gibt detailiertere Ausgaben über den");
			log("       Arbeitsvorgang aus");
			log("");
			log("    Alle unbekannten Parameter werden 1:1 an den TSC übergeben");
			log("");
			log("");
		}



		private getTscVersion(
			callback:StringCallback):void
		{
			var childProcess = new kr3m.util.ChildProcess("tsc", ["-v"]);
			childProcess.exec((status) =>
			{
				var matches = childProcess.getOutputString().match(/Version (\d+\.\d+\.\d+)/);
				callback(matches ? matches[1] : "0.0.0");
			});
		}



		public runWithParameters(
			params:kr3m.tools.precompiler.Parameters):void
		{
			this.getTscVersion((tscVersion) =>
			{
				params.tscVersion = tscVersion;

				if (params.silent)
					kr3m.util.Log.enabled = false;

				if (params.greyOnly)
				{
					for (var i in kr3m.util.Log)
					{
						if (i.slice(0, 6) == "COLOR_")
							kr3m.util.Log[i] = "";
					}
				}

				log("");
				log("Kr3m Precompiler " + kr3m.VERSION);
				log("Typescript Compiler " + params.tscVersion);
				switch (params.command)
				{
					case "build":
						this.build(params);
						break;

					case "compile":
						this.compile(params);
						break;

					case "clean":
						this.clean(params);
						break;

					default:
						this.showHelpText();
						break;
				}
			});
		}



		public run():void
		{
			var params = new kr3m.tools.precompiler.Parameters(process.argv);
			this.runWithParameters(params);
		}
	}
}

/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../tools/templatepacker/parameters.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/htmlhelper.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/log.ts"/>
/// <reference path="../../util/map.ts"/>



module kr3m.tools.templatepacker
{
	export class TemplatePacker
	{
		private templates:any;
		private params:kr3m.tools.templatepacker.Parameters;



		private getTemplateFromFile(filePath:string):string
		{
			var htmlCode = fsLib.readFileSync(filePath, {encoding:"utf8"});
			var content = kr3m.util.HtmlHelper.getBody(htmlCode, false, null, false);
			content = content.replace(/\s+/g, " ");
			return content;
		}



		private crawl():void
		{
			var source = fsLib.realpathSync(this.params.sourcePath);
			var crop = source.length + 1;
			var pendingPaths:string[] = [source];
			while (pendingPaths.length > 0)
			{
				var currentPath = pendingPaths.shift();
				if (this.params.verbose)
					log("processing " + currentPath);

				var files = fsLib.readdirSync(currentPath);
				files.forEach((file:string) =>
				{
					file = currentPath + "/" + file;
					var stats = fsLib.statSync(file);
					if (stats.isDirectory())
					{
						pendingPaths.push(file);
					}
					else
					{
						var ext = kr3m.util.File.getExtension(file);
						if (ext == ".html")
						{
							if (this.params.verbose)
								log("  adding template " + file.substr(crop));

							var templateKey = kr3m.util.HtmlHelper.getTemplateKey(file.substr(crop));
							this.templates[templateKey] = this.getTemplateFromFile(file);
						}
					}
				});
			}
		}



		private showHelpText():void
		{
			log("");
			log("  Der TemplatePacker ist ein Programm, welches ein Verzeichnis nach");
			log("  Html-Dateien durchsucht und alle gefundenen Dateien in eine einzelne");
			log("  json-Datei speichert. Diese kann dann von kr3m.ui.HtmlTemplate");
			log("  Elementen geladen werden. Dies soll verhindern, dass übertrieben");
			log("  viele Html-Templates einzeln vom Server geladen werden müssen.");
			log("");
			log("");
			log("  Aufruf:");
			log("");
			log("    templatepacker SOURCEPATH [-o OUTPUTFILE] [-v] [-s]");
			log("");
			log("");
			log("  Parameter:");
			log("");
			log("    -v Verbose Mode - gibt detailiertere Ausgaben über den");
			log("       Arbeitsvorgang aus");
			log("    -s Silent Mode - alle Ausgaben unterdrücken");
			log("    -o Output - speichert das Ergebnis in der in OUTPUTFILE");
			log("       gegebenen Datei statt in der Standarddatei");
			log("");
			log("");
		}



		private save():void
		{
			var content = kr3m.util.Json.encode(this.templates);
			content = content.replace(/"[^"]+_html"/gi, function(match:string)
			{
				return "\n" + match;
			});
			fsLib.writeFileSync(this.params.targetPath, content);
		}



		public runWithParameters(
			params:kr3m.tools.templatepacker.Parameters):void
		{
			this.params = params;
			if (params.silent)
				kr3m.util.Log.enabled = false;

			log("");
			log("Kr3m Typescript Template Packer " + kr3m.VERSION);

			if (params.sourcePath)
			{
				this.templates = {};
				this.crawl();
				this.save();
				log("done");
			}
			else
			{
				this.showHelpText();
			}
		}



		public run():void
		{
			var params = new kr3m.tools.templatepacker.Parameters(process.argv);
			this.runWithParameters(params);
		}
	}
}

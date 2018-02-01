/// <reference path="../async/if.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../html/helper.ts"/>
/// <reference path="../lib/childprocess.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/rand.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.util
{
	export interface PdfOptions
	{
		tokens?:Tokens;
		loc?:LocFunc;
		locParse?:LocFunc;
	}



	/*
		Diese Klasse verwendet wkhtmltopdf (Kommandozeilentool) um
		aus Html-Templates PDF-Dateien zu erzeugen. Das Tool kann man
		sich hier runterladen und installieren:

			http://wkhtmltopdf.org/downloads.html

		Wird der optionale Parameter languageId angegeben, dann werden
		auch die loc() Einträge im Template durch die entsprechenden
		Einträge in der Lokalisierung ersetzt. Wird er nicht angegeben,
		werden loc() Einträge im Template nicht angefasst.
	*/
	export class Pdf
	{
		private headerPath:string;
		private headerContent:string;

		private footerPath:string;
		private footerContent:string;

		private bodyPath:string;
		private bodyContent:string;

		private cliOptions:string[] = [];
		private tempFiles:string[] = [];
		private errors:any[] = [];
		private outputPath:string;



		constructor(private options?:PdfOptions)
		{
			this.options = this.options || {};
		}



		private loadFile(
			htmlFilePath:string,
			callback:(content:string) => void):void
		{
			fsLib.readFile(htmlFilePath, {encoding:"utf-8"}, (err:any, content:string) =>
			{
				if (err)
				{
					this.errors.push(err);
					return callback("");
				}

				var helper = new kr3m.html.Helper();
				var result = helper.processCode(content, this.options.tokens, this.options.loc, this.options.locParse);
				callback(result);
			});
		}



		public setBody(html:string):void
		{
			this.bodyContent = html;
			this.bodyPath = null;
		}



		public setBodyFromFile(filePath:string):void
		{
			this.bodyContent = null;
			this.bodyPath = filePath;
		}



		public setHeader(html:string):void
		{
			this.headerContent = html;
			this.headerPath = null;
		}



		public setHeaderFromFile(filePath:string):void
		{
			this.headerContent = null;
			this.headerPath = filePath;
		}



		public setFooter(html:string):void
		{
			this.footerContent = html;
			this.footerPath = null;
		}



		public setFooterFromFile(filePath:string):void
		{
			this.footerContent = null;
			this.footerPath = filePath;
		}



		private writeTempFile(
			nextToFilePath:string,
			content:string,
			callback:(tempFilePath:string) => void,
			extension = ".html"):void
		{
			var tempFilePath = "";
			kr3m.async.Loop.loop((loopDone) =>
			{
				tempFilePath = nextToFilePath + "_" + Rand.getString(4) + extension;
				fsLib.exists(tempFilePath, loopDone);
			}, () =>
			{
				this.tempFiles.push(tempFilePath);

				content = StringEx.stripBom(content);
				if (content.indexOf(kr3m.html.Helper.DOCTYPE) < 0)
					content = kr3m.html.Helper.DOCTYPE + "\n" + content;

				fsLib.writeFile(tempFilePath, StringEx.BOM + content, {encoding:"utf-8"}, (err:any) =>
				{
					if (err)
						this.errors.push(err);

					callback(tempFilePath);
				});
			});
		}



		private processHeader(
			callback:Callback):void
		{
			if (!this.headerPath && !this.headerContent)
				return callback();

			kr3m.async.If.then(this.headerPath, (thenDone) =>
			{
				this.loadFile(this.headerPath, (content) =>
				{
					this.headerContent = content;
					thenDone();
				});
			}, () =>
			{
				this.writeTempFile(this.headerPath || this.outputPath, this.headerContent, (tempFile) =>
				{
					this.cliOptions.push(" --header-html \"" + tempFile + "\"");
					callback();
				});
			});
		}



		private processFooter(
			callback:Callback):void
		{
			if (!this.footerPath && !this.footerContent)
				return callback();

			kr3m.async.If.then(this.footerPath, (thenDone) =>
			{
				this.loadFile(this.footerPath, (content) =>
				{
					this.footerContent = content;
					thenDone();
				});
			}, () =>
			{
				this.writeTempFile(this.footerPath || this.outputPath, this.footerContent, (tempFile) =>
				{
					this.cliOptions.push(" --footer-html \"" + tempFile + "\"");
					callback();
				});
			});
		}



		private processBody(
			callback:Callback):void
		{
			if (!this.bodyPath && !this.bodyContent)
				return callback();

			kr3m.async.If.then(this.bodyPath, (thenDone) =>
			{
				this.loadFile(this.bodyPath, (content) =>
				{
					this.bodyContent = content;
					thenDone();
				});
			}, () =>
			{
				this.writeTempFile(this.bodyPath || this.outputPath, this.bodyContent, (tempFile) =>
				{
					this.cliOptions.push("\"" + tempFile + "\" \"" + this.outputPath + "\"");
					callback();
				});
			});
		}



		public save(
			outputPath:string,
			callback:SuccessCallback):void
		{
			if (this.outputPath)
			{
				logError("kr3m.util.Pdf.save() was called while saving operation is in progress");
				return callback(false);
			}

			this.outputPath = outputPath;
			this.errors = [];
			this.cliOptions = ["wkhtmltopdf --encoding utf-8"];
			this.processHeader(() =>
			{
				this.processFooter(() =>
				{
					this.processBody(() =>
					{
						var commandline = this.cliOptions.join(" ");
						//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
						childProcessLib.exec(commandline, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
						{
							if (error)
								this.errors.push(error);

							this.deleteTempFiles(() =>
							{
								this.outputPath = null;
								if (this.errors.length > 0)
									logError(this.errors.length, "error(s) occured while generating pdf", this.outputPath);
								for (var i = 0; i < this.errors.length; ++i)
									logError(this.errors[i]);
								callback(this.errors.length == 0);
							});
						});
					});
				});
			});
		}



		private deleteTempFiles(
			callback:Callback):void
		{
			kr3m.async.Loop.forEach(this.tempFiles, (tempFile, loopDone) =>
			{
				fsLib.unlink(tempFile, (err:any) =>
				{
					if (err)
						logError(err);
					loopDone();
				});
			}, () =>
			{
				this.tempFiles = [];
				callback();
			});
		}



		/*
			Bequemlichkeitsfunktion um einfach PDFs aus
			HTML-Dateien erzeugen zu können.
		*/
		public static generateFromTemplate(
			templatePath:string,
			outputPath:string,
			tokens:Tokens,
			callback:SuccessCallback,
			locParse?:LocFunc):void
		{
			var pdf = new Pdf({tokens : tokens, locParse : locParse});
			pdf.setBodyFromFile(templatePath);
			pdf.save(outputPath, callback);
		}



		/*
			Bequemlichkeitsfunktion um einfach PDFs aus
			HTML-Sourcecode erzeugen zu können.
		*/
		public static generateFromContent(
			content:string,
			outputPath:string,
			callback:SuccessCallback):void
		{
			var pdf = new Pdf();
			pdf.setBody(content);
			pdf.save(outputPath, callback);
		}
	}
}

/// <reference path="../async/if.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../lib/os.ts"/>
/// <reference path="../net/mimetypes.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/rand.ts"/>
/// <reference path="../util/regex.ts"/>
/// <reference path="../util/stringex.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS

//# CLIENT
//# ERROR: diese Datei darf niemals in Client-Anwendungen verwendet werden
//# /CLIENT



module kr3m.util
{
	export class File
	{
		/*
			Asynchrone Methode zum Kopieren von (großen) Dateien. Im Gegensatz
			zu den gängigen Lösungen im Netz, die ReadStream und WriteStream
			benutzen blockiert diese Methode nicht den Webserver mit
			IO-Operationen.
		*/
		public static copyFile(
			sourcePath:string,
			targetPath:string,
			callback?:SuccessCallback):void
		{
			fsLib.open(sourcePath, "r", (err:Error, source:any) =>
			{
				if (err)
				{
					logError(err);
					return callback && callback(false);
				}

				fsLib.open(targetPath, "w", (err:Error, target:any) =>
				{
					if (err)
					{
						logError(err);
						fsLib.close(source, () => {});
						return callback && callback(false);
					}

					var bufferSize = 1000000;
					var buffer = Buffer.alloc(bufferSize);

					var done = (err?:Error) =>
					{
						fsLib.close(target, (err:Error) =>
						{
							fsLib.close(source, (err:Error) =>
							{
								if (err)
									logError(err);
								callback && callback(!err);
							});
						});
					};

					kr3m.async.Loop.loop((loopDone:BooleanCallback) =>
					{
						fsLib.read(source, buffer, 0, bufferSize, null, (err:Error, bytesRead:number) =>
						{
							if (err)
								return done(err);

							fsLib.write(target, buffer, 0, bytesRead, (err:Error, bytesWritten:number) =>
							{
								if (err)
									return done(err);

								loopDone(bytesRead >= bufferSize);
							});
						});
					}, () => done());
				});
			});
		}



		/*
			Lädt eine JSON-Datei und gibt deren Inhalt als
			Javascriptobjekt zurück.
		*/
		public static loadJsonFileSync(path:string):any
		{
			try
			{
				var content = fsLib.readFileSync(path, {encoding:"utf8"});
				var obj = Json.decode(content);
				return obj;
			}
			catch(err)
			{
				logError(err);
				return undefined;
			}
		}



		/*
			Lädt eine JSON-Datei und und ruft die
			callback-Funktion mit dem geladenen Objekt als
			Parameter auf.
		*/
		public static loadJsonFile(path:string, callback:(obj:any) => void):void
		{
			fsLib.readFile(path, {encoding:"utf8"}, (err:any, data:any) =>
			{
				try
				{
					var obj = Json.decode(data);
					callback(obj);
				}
				catch(err)
				{
					logError(err);
					callback(undefined);
				}
			});
		}



		/*
			Gibt die Größe der Datei path in Bytes zurück.
			Bei einem Fehler wird -1 zurückgegeben.
		*/
		public static getFileSize(
			path:string,
			callback:(size:number) => void):void
		{
			fsLib.stat(path, (err:Error, stats:any) =>
			{
				if (err)
					return callback(-1);

				callback(stats.size);
			});
		}



		/*
			Überprüft ob eine Datei (kein Verzeichnis) mit
			dem angegeben Pfad existiert und gibt in dem
			Fall true zurück, sonst false.
		*/
		public static fileExists(
			path:string,
			callback:(exists:boolean) => void):void
		{
			fsLib.stat(path, (err:Error, stats:any) =>
			{
				if (err)
					return callback(false);

				callback(stats.isFile());
			});
		}



		/*
			Überprüft ob ein Verzeichnis (keine Datei) mit
			dem angegeben Pfad existiert und gibt in dem
			Fall true zurück, sonst false.
		*/
		public static folderExists(
			path:string,
			callback:(exists:boolean) => void):void
		{
			fsLib.stat(path, (err:Error, stats:any) =>
			{
				if (err)
					return callback(false);

				callback(stats.isDirectory());
			});
		}



		/*
			Löscht das angegebene Verzeichnis mit allem Inhalt.
			Achtung: mit Vorsicht zu gebrauchen!
		*/
		public static deleteFolder(
			folderPath:string,
			callback:SuccessCallback):void
		{
			fsLib.readdir(folderPath, (err:Error, files:string[]) =>
			{
				if (err)
					return callback(err["code"] == "ENOENT");

				kr3m.async.Loop.forEach(files, (file, next) =>
				{
					var path = folderPath + "/" + file;
					fsLib.stat(path, (err:Error, stats:any) =>
					{
						if (err)
							return callback(false);

						kr3m.async.If.thenElse(stats.isDirectory(), (thenDone) =>
						{
							File.deleteFolder(path, (success:boolean) =>
							{
								if (!success)
									return callback(false);

								thenDone();
							});
						}, (elseDone) =>
						{
							fsLib.unlink(path, (err:Error) =>
							{
								if (err)
									return callback(false);

								elseDone();
							});
						}, next);
					});
				}, () =>
				{
					fsLib.rmdir(folderPath, (err:Error) =>
					{
						if (err)
						{
							logError(err);
							return callback(false);
						}

						callback(true);
					});
				});
			});
		}



		/*
			Im Prinzip das gleiche wie fs.mkdir aber funktioniert
			auch rekursiv.
		*/
		public static createFolder(
			folderPath:string,
			callback?:SuccessCallback):void
		{
			fsLib.exists(folderPath, (exists) =>
			{
				if (exists)
					return callback && callback(true);

				var parts = folderPath.split(/[\\\/]/);
				folderPath = "";
				kr3m.async.Loop.forEach(parts, (part, next) =>
				{
					if (!part)
						return next();

					folderPath = folderPath ? folderPath + "/" + part : part;
					fsLib.exists(folderPath, (exists) =>
					{
						if (exists)
							return next();

						fsLib.mkdir(folderPath, (error:Error) =>
						{
							if (error)
								return callback && callback(false);

							next();
						});
					});
				}, () => callback && callback(true));
			});
		}



		/*
			Im Prinzip das gleiche wie createFolder, erwartet aber
			einen Dateipfad als Parameter
		*/
		public static createFileFolder(
			filePath:string,
			callback:SuccessCallback):void
		{
			var parts = filePath.split(/[\\\/]/);
			if (parts.length < 2)
				return callback(true);

			var folderPath = parts.slice(0, -1).join("/");
			File.createFolder(folderPath, callback);
		}



		public static getExtension(path:string):string
		{
			var matches = path.match(/\.([^\.\/\\]+)$/);
			return matches ? matches[0].toLowerCase() : "";
		}



		public static getFilenameFromPath(path:string):string
		{
			var matches = path.match(/.*[\\\/](.+)/);
			return matches ? matches[1] : path;
		}



		/*
			Gibt true zurück wenn path eine Datei oder ein Verzeichnis
			ist, das in folderPath (oder dessen Unterverzeichnissen) liegt.
		*/
		public static isInFolder(path:string, folderPath:string):boolean
		{
			folderPath = folderPath.replace(/\/+$/, "/");
			return path.indexOf(folderPath) == 0;
		}



		public static saveDataUrl(
			dataUrl:string,
			filePath:string,
			callback?:StatusCallback):void
		{
			var data = StringEx.captureNamed(dataUrl, REGEX_DATA_URL, REGEX_DATA_URL_GROUPS);
			if (data.encoding != "base64")
				return callback(kr3m.ERROR_NOT_SUPPORTED);

			var buffer = Buffer.from(data.payload, data.encoding);
			fsLib.writeFile(filePath, buffer, (err:Error) =>
			{
				if (err)
					logError(err);

				callback && callback(err ? kr3m.ERROR_FILE : kr3m.SUCCESS);
			});
		}



		public static getAsDataUrl(
			filePath:string,
			callback:(dataUrl:string) => void):void
		{
			fsLib.readFile(filePath, (err:Error, buffer:Buffer) =>
			{
				if (err)
				{
					logError(err);
					return callback(undefined);
				}

				var base64 = buffer.toString("base64");
				var mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(filePath);
				var dataUrl = "data:" + mimeType + ";base64," + base64;
				callback(dataUrl);
			});
		}



		public static getAsDataUrlSync(filePath:string):string
		{
			try
			{
				var buffer = fsLib.readFileSync(filePath);
				var base64 = buffer.toString("base64");
				var mimeType = kr3m.net.MimeTypes.getMimeTypeByFileName(filePath);
				var dataUrl = "data:" + mimeType + ";base64," + base64;
				return dataUrl;
			}
			catch(err)
			{
				logError(err);
				return undefined;
			}
		}



		/*
			Ermittelt für einen relative Pfad relativePath, der innerhalb einer
			Datei namens filePath verwendet wurde einen neuen Pfad mit Hilfe
			von filePath. Die Arbeitsweise ist vergleichbar mit der join-Funktion
			des node.js path-Moduls, aber die Ergebnisse sind unterschiedlich.
			Die path.join() Funktion geht davon aus, dass alle Parameter Verzeichnisse
			sind, wogegen File.resolvePath() davon ausgeht, dass Dateinamen in den
			Pfaden vorkommen.

			Beispiel:
				resolvePath("bin/public/css/main.css", "../images/bg.jpg") ergibt "bin/public/images/bg.jpg"
		*/
		public static resolvePath(filePath:string, relativePath:string):string
		{
			if (relativePath.indexOf("/") == 0 || relativePath.indexOf(":") == 1)
				return relativePath;

			var fileName = File.getFilenameFromPath(filePath);
			filePath = filePath.substr(0, filePath.length - fileName.length);

			var result = ((filePath.length > 0) ? filePath + "/" : "") + relativePath;
			result = result.replace(/[\\\/]+/g, "/");
			var oldResult = "";
			while (oldResult != result)
			{
				oldResult = result;
				result = result.replace(/\/([^\/\.])+\/\.\.\//g, "/");
			}
			oldResult = "";
			while (oldResult != result)
			{
				oldResult = result;
				result = result.replace(/\/\.\//g, "/");
			}
			return result;
		}



		/*
			Gibt einen Dateipfad (inklusive Dateiname) zurück, der für
			eine neue temporäre Datei verwendet werden kann.
		*/
		public static getTempFilePath(
			callback:(path:string) => void):void
		{
			var folder = osLib.tmpdir();
			kr3m.async.Loop.loop((loopDone) =>
			{
				var tempPath = folder + "/" + Rand.getString(16);
				fsLib.exists(tempPath, (exists) =>
				{
					if (exists)
						return loopDone(true);

					callback(tempPath);
				});
			});
		}



		/*
			Durchsucht das Verzeichnis folderPath und ruft func für alle
			gefundenen Dateien / Verzeichnisse darin auf.

			In options können folgende Filter benutzt werden um zu
			beeinflussen, welche Dateien / Verzeichnisse zurückgegeben
			werden sollen:
				- wantFiles:boolean - ob func für Dateien aufgerufen werden soll (Standard: true)
				- wantFolders:boolean - ob func für Verzeichnisse aufgerufen werden soll (Standard: true)
				- recursive:boolean - ob die Unterverzeichnisse von folderPath durchsucht werden sollen (Standard: true)
				- pattern:RegEx - falls angegeben wird func nur für Ergebnisse aufgerufen, deren relativer Pfad pattern erfüllt
		*/
		public static crawl(
			folderPath:string,
			func:(relativePath:string, isFolder:boolean, absolutePath:string) => void,
			options?:{wantFiles?:boolean, wantFolders?:boolean, recursive?:boolean, pattern?:RegExp}):void
		{
			options = options || {};
			options.wantFiles = options.wantFiles === undefined ? true : options.wantFiles;
			options.wantFolders = options.wantFolders === undefined ? true : options.wantFolders;
			options.recursive = options.recursive === undefined ? true : options.recursive;

			var rootPath = fsLib.realpathSync(folderPath);
			if (!rootPath)
				return;

			var pendingFolders:string[] = ["."];
			while (pendingFolders.length > 0)
			{
				var currentFolder = pendingFolders.shift();
				var folderFiles = fsLib.readdirSync(rootPath + "/" + currentFolder);
				for (var i = 0; i < folderFiles.length; ++i)
				{
					var relativePath = currentFolder == "." ? folderFiles[i] : currentFolder + "/" + folderFiles[i];
					var absolutePath = fsLib.realpathSync(rootPath + "/" + relativePath);
					var matches = !options.pattern || options.pattern.test(relativePath);
					var stats = fsLib.statSync(absolutePath);
					if (stats.isDirectory())
					{
						if (options.recursive)
							pendingFolders.push(relativePath);

						if (options.wantFolders && matches)
							func(relativePath, true, absolutePath);
					}
					else
					{
						if (options.wantFiles && matches)
							func(relativePath, false, absolutePath);
					}
				}
			}
		}



		/*
			Genau das gleiche wie crawl aber als asynchrone Version.
		*/
		public static crawlAsync(
			folderPath:string,
			func:(relativePath:string, next:Callback, isFolder:boolean, absolutePath:string) => void,
			options?:{wantFiles?:boolean, wantFolders?:boolean, recursive?:boolean, pattern?:RegExp},
			callback?:Callback):void
		{
			options = options || {};
			options.wantFiles = options.wantFiles === undefined ? true : options.wantFiles;
			options.wantFolders = options.wantFolders === undefined ? true : options.wantFolders;
			options.recursive = options.recursive === undefined ? true : options.recursive;

			fsLib.realpath(folderPath, (err:Error, rootPath:string) =>
			{
				if (!rootPath)
					return callback && callback();

				var pendingFolders:string[] = ["."];
				kr3m.async.Loop.loop((nextFolder) =>
				{
					if (pendingFolders.length == 0)
						return callback && callback();

					var currentFolder = pendingFolders.shift();
					fsLib.readdir(rootPath + "/" + currentFolder, (err:Error, folderFiles:string[]) =>
					{
						kr3m.async.Loop.forEach(folderFiles, (folderFile, nextFile) =>
						{
							var relativePath = currentFolder == "." ? folderFile : currentFolder + "/" + folderFile;
							fsLib.realpath(rootPath + "/" + relativePath, (err:Error, absolutePath:string) =>
							{
								var matches = !options.pattern || options.pattern.test(relativePath);
								fsLib.stat(absolutePath, (err:Error, stats:any) =>
								{
									if (stats.isDirectory())
									{
										if (options.recursive)
											pendingFolders.push(relativePath);

										if (options.wantFolders && matches)
											return func(relativePath, nextFile, true, absolutePath);
									}
									else
									{
										if (options.wantFiles && matches)
											return func(relativePath, nextFile, false, absolutePath);
									}
									nextFile();
								});
							});
						}, nextFolder);
					});
				});
			});
		}



		public static getSubFolders(
			folder:string,
			recursive:boolean,
			callback:(subFolders:string[]) => void):void
		{
			var subFolders:string[] = [];
			File.crawlAsync(folder, (relativePath, next) =>
			{
				subFolders.push(relativePath);
				next();
			}, {wantFiles : false, wantFolders : true, recursive : recursive}, () => callback(subFolders));
		}



		/*
			Gibt ein assoziatives Array zurück in dem alle in folder
			gefundenen Dateien enthalten sind zusammen mit ihrer
			Größe in Bytes.
		*/
		public static getFileSizes(
			folder:string,
			pattern:RegExp,
			callback:(sizes:{[relativePath:string]:number}) => void):void;

		public static getFileSizes(
			folder:string,
			callback:(sizes:{[relativePath:string]:number}) => void):void;

		public static getFileSizes():void
		{
			var folder = <string> arguments[0];
			var pattern = arguments.length > 2 ? <RegExp> arguments[1] : undefined;
			var callback = <(sizes:{[relativePath:string]:number}) => void> arguments[arguments.length - 1];

			var sizes:{[relativePath:string]:number} = {};
			File.crawlAsync(folder, (relativePath, next) =>
			{
				File.getFileSize(folder + "/" + relativePath, (size) =>
				{
					sizes[relativePath] = size;
					next();
				});
			}, {wantFiles : true, wantFolders : false, recursive : true, pattern : pattern}, () => callback(sizes));
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var F = kr3m.util.File;
	new kr3m.unittests.Suite("kr3m.util.File")
	.add(new kr3m.unittests.CaseSync("getExtension I", () => F.getExtension("test.txt"), ".txt"))
	.add(new kr3m.unittests.CaseSync("getExtension II", () => F.getExtension("test/test.txt"), ".txt"))
	.add(new kr3m.unittests.CaseSync("getExtension III", () => F.getExtension("test.test/test.txt"), ".txt"))
	.add(new kr3m.unittests.CaseSync("getExtension IV", () => F.getExtension("test.test/test"), ""))
	.add(new kr3m.unittests.CaseSync("resolvePath I", () => F.resolvePath("", ""), ""))
	.add(new kr3m.unittests.CaseSync("resolvePath II", () => F.resolvePath("test", "test.txt"), "test.txt"))
	.add(new kr3m.unittests.CaseSync("resolvePath III", () => F.resolvePath("public/css/main.css", "../images/bg.jpg"), "public/images/bg.jpg"))
	.run();
}, 1);
//# /UNITTESTS

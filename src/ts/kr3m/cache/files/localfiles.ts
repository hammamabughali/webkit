/// <reference path="../../async/criticalsectionreadwrite.ts"/>
/// <reference path="../../async/delayed.ts"/>
/// <reference path="../../async/if.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../cache/files/abstract.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../lib/zlib.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/folderwatcher.ts"/>
/// <reference path="../../util/log.ts"/>
/// <reference path="../../util/stringex.ts"/>



module kr3m.cache.files
{
	class LfMeta
	{
		public file:Buffer;
		public loading = false;
		public delay = new kr3m.async.Delayed();
		public modified:Date;
	}



	export interface LfLoadEvent
	{
		content:Buffer;
		modified:Date;
		path:string;
	}



	export interface LfDeliverEvent
	{
		content:Buffer;
		encoding:string;
		modified:Date;
		path:string;
	}



	export interface LfRequestEvent
	{
		acceptedEncodings:string[];
		path:string;
	}



	export interface LfForgetEvent
	{
		path:string;
	}



	export interface LfEncodeEvent
	{
		encodedContent:Buffer;
		encoding:string;
		modified:Date;
		path:string;
		rawContent:Buffer;
	}



	/*
		Diese Klasse cached Dateien von lokalen Datenträgern.
		Mit getFile kann man sich beliebige Dateien holen.
		Wenn eine gewünschte Datei schon einmal andefordert
		wurde, wird sie aus dem Speicher ausgeliefert statt
		vom Datenträger geladen zu werden.
		Diese Klasse behält die geladene Datei im Auge und
		verwirft die Version im Speicher wenn sich an der
		Version auf dem Datenträger etwas ändert. Dadurch
		bekommt man immer die aktuellste Version.
	*/
	export class LocalFiles extends Abstract
	{
		public static readonly EVENT_DELIVER = "deliver";
		public static readonly EVENT_ENCODE = "encode";
		public static readonly EVENT_FORGET = "forget";
		public static readonly EVENT_LOAD = "load";
		public static readonly EVENT_REQUEST = "request";

		private static instance:LocalFiles;

		public static ENCODINGS = ["deflate", "gzip", "none"];

		protected cs = new kr3m.async.CriticalSectionReadWrite();
		protected metaData:{[path:string]:{[encoding:string]:LfMeta}} = {};
		protected watched:{[folderPath:string]:boolean} = {};



		public static getInstance():LocalFiles
		{
			if (!LocalFiles.instance)
				LocalFiles.instance = new LocalFiles();
			return LocalFiles.instance;
		}



		private watchFileFolder(
			filePath:string,
			callback:Callback):void
		{
			fsLib.realpath(filePath, (err:Error, realPath:string) =>
			{
				if (err)
				{
					logError("could not watch file", filePath);
					return callback();
				}

				var folderPath = realPath.split(/[\/\\]/).slice(0, -1).join("/");
				if (this.watched[folderPath])
					return callback();

				this.watched[folderPath] = true;
				kr3m.util.FolderWatcher.watch(folderPath, (changedPath:string) =>
				{
					fsLib.realpath(folderPath + "/" + changedPath, (err:Error, realPath:string) =>
					{
						if (!err)
							this.forgetFile(realPath);
					});
				}, false);
				callback();
			});
		}



		protected reloadFile(
			path:string,
			callback:(file:Buffer, modified?:Date) => void):void
		{
			fsLib.stat(path, (err:any, stats:any) =>
			{
				if (!stats || stats.isDirectory())
					return callback(null);

				fsLib.readFile(path, (err:Error, file:Buffer) =>
				{
					if (err)
					{
						logError("loading error", err);
						return callback(null);
					}

					this.watchFileFolder(path, () =>
					{
						var event:LfLoadEvent =
						{
							content : file,
							modified : stats.mtime,
							path : path
						};
						this.dispatch(LocalFiles.EVENT_LOAD, event);
						callback(event.content, event.modified);
					});
				});
			});
		}



		private deflate(
			path:string,
			callback:(file:Buffer, modified:Date) => void):void
		{
			this.getEncodedFile(path, "none", (unencoded, encoding, modified) =>
			{
				if (!unencoded)
					return callback(undefined, undefined);

				zLib.deflate(unencoded, (err:Error, encoded:Buffer) =>
				{
					if (err)
					{
						logError(err)
						return callback(undefined, undefined);
					}

					var event:LfEncodeEvent =
					{
						encodedContent : encoded,
						encoding : encoding,
						modified : modified,
						path : path,
						rawContent : unencoded
					}
					this.dispatch(LocalFiles.EVENT_ENCODE, event);
					callback(event.encodedContent, event.modified);
				});
			});
		}



		private gzip(
			path:string,
			callback:(file:Buffer, modified:Date) => void):void
		{
			this.getEncodedFile(path, "none", (unencoded, encoding, modified) =>
			{
				if (!unencoded)
					return callback(undefined, undefined);

				zLib.gzip(unencoded, (err:Error, encoded:Buffer) =>
				{
					if (err)
					{
						logError(err)
						return callback(undefined, undefined);
					}

					var event:LfEncodeEvent =
					{
						encodedContent : encoded,
						encoding : encoding,
						modified : modified,
						path : path,
						rawContent : unencoded
					}
					this.dispatch(LocalFiles.EVENT_ENCODE, event);
					callback(event.encodedContent, event.modified);
				});
			});
		}



		private none(
			path:string,
			callback:(file:Buffer, modified:Date) => void):void
		{
			this.reloadFile(path, callback);
		}



		private forgetFile(path:string):void
		{
			if (!this.metaData[path])
				return;

			for (var i = 0; i < LocalFiles.ENCODINGS.length; ++i)
			{
				var md = this.metaData[path][LocalFiles.ENCODINGS[i]];
				md.delay.reset(false);
				md.loading = false;
				md.modified = new Date();
			}

			var event:LfForgetEvent =
			{
				path : path
			}
			this.dispatch(LocalFiles.EVENT_FORGET, event);
		}



		protected getEncodedFile(
			path:string,
			encoding:string,
			callback:(file:Buffer, encoding?:string, modified?:Date) => void):void
		{
			if (!this.metaData[path])
			{
				this.metaData[path] = {};
				for (var i = 0; i < LocalFiles.ENCODINGS.length; ++i)
					this.metaData[path][LocalFiles.ENCODINGS[i]] = new LfMeta();
			}

			this.metaData[path][encoding].delay.call(() =>
			{
				callback(this.metaData[path][encoding].file, encoding != "none" ? encoding : null, this.metaData[path][encoding].modified);
			});

			if (!this.metaData[path][encoding].loading)
			{
				var encodeFunc = this[encoding].bind(this);
				this.metaData[path][encoding].loading = true;
				encodeFunc(path, (file, modified) =>
				{
					this.metaData[path][encoding].file = file;
					this.metaData[path][encoding].modified = modified;
					this.metaData[path][encoding].delay.execute();
				});
			}
		}



		public getFile(
			path:string,
			acceptedEncodings:string[],
			callback:(content:Buffer, encoding:string, modified:Date) => void):void;

		public getFile(
			path:string,
			callback:(content:Buffer, encoding:string, modified:Date) => void):void;

		public getFile():void
		{
			var acceptedEncodings:string[] = arguments.length > 2 ? <string[]> arguments[1] : [];
			var callback = <(content:Buffer, encoding:string, modified:Date) => void> arguments[arguments.length - 1];
			var path = <string> arguments[0];
			this.cs.enterRead((exit) =>
			{
				fsLib.realpath(path, (err:Error, realPath:string) =>
				{
					if (err)
						return callback(undefined, undefined, undefined);

					acceptedEncodings = kr3m.util.Util.intersect(acceptedEncodings, LocalFiles.ENCODINGS);
					acceptedEncodings.push("none");

					var requestEvent:LfRequestEvent =
					{
						acceptedEncodings : acceptedEncodings,
						path : realPath
					};
					this.dispatch(LocalFiles.EVENT_REQUEST, requestEvent);

					this.getEncodedFile(requestEvent.path, requestEvent.acceptedEncodings[0], (content, encoding, modified) =>
					{
						exit();
						var deliverEvent:LfDeliverEvent =
						{
							content : content,
							encoding : encoding,
							modified : modified,
							path : requestEvent.path
						};
						this.dispatch(LocalFiles.EVENT_DELIVER, deliverEvent);
						callback(deliverEvent.content, deliverEvent.encoding, deliverEvent.modified);
					});
				});
			});
		}



		public getTextFile(
			path:string,
			callback:CB<string>):void
		{
			this.getFile(path, (raw) =>
			{
				var content = raw ? raw.toString("utf8") : "";
				content = kr3m.util.StringEx.stripBom(content);
				callback(content);
			});
		}



		public getModified(
			path:string,
			callback:CB<Date>):void
		{
			this.cs.enterRead((exit) =>
			{
				fsLib.realpath(path, (err:Error, realPath:string) =>
				{
					kr3m.async.If.thenElse(this.metaData[realPath], (thenDone) =>
					{
						var modified = this.metaData[realPath]["none"].modified;
						exit();
						callback(modified);
					}, (elseDone) =>
					{
						fsLib.stat(realPath, (err:Error, stats:any) =>
						{
							var modified = err ? undefined : stats.mtime;
							exit();
							callback(modified);
						});
					});
				});
			});
		}



		/*
			Informiert den Cache darüber, dass sich eine Datei geändert
			hat und frisch von der Festplatte geladen werden muss.
		*/
		public setDirty(
			path:string,
			callback?:Callback):void
		{
			this.cs.enterWrite((exit) =>
			{
				fsLib.realpath(path, (err:Error, realPath:string) =>
				{
					if (!err)
						this.forgetFile(realPath);

					exit();
					callback && callback();
				});
			});
		}



		/*
			Überprüft ob die gewünschte Datei existiert. Es wird zuerst
			geschaut ob sie im Cache vorhanden ist und falls nicht wird
			im Dateisystem nachgesehen.
		*/
		public fileExists(
			path:string,
			callback:CB<boolean>):void
		{
			this.cs.enterRead((exit) =>
			{
				fsLib.realpath(path, (err:Error, realPath:string) =>
				{
					if (err)
						return callback(false);

					if (this.metaData[realPath])
						return callback(true);

					kr3m.util.File.fileExists(realPath, (exists:boolean) =>
					{
						exit();
						callback(exists);
					});
				});
			});
		}
	}
}

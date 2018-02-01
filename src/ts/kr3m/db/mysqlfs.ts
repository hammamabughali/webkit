/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../db/mysqldb.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../net/mimetypes.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.db
{
	/*
		Diese Klasse erlaubt es, Dateien in einer MySql-Tabelle
		zu speichern und wieder von dort zu lesen. Sie ist
		sozusagen eine Art Dateisystem auf einer beliebigen MySql-
		Tabelle

		Die Tabelle müsste in folgender Form angelegt werden:

		CREATE TABLE IF NOT EXISTS `files` (
			`path` varchar(128) NOT NULL,
			`part` int(10) unsigned NOT NULL,
			`extension` varchar(10) NOT NULL,
			`mimeType` varchar(30) NOT NULL,
			`lastModified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			`content` blob NOT NULL,
			PRIMARY KEY (`path`,`part`),
			KEY `extension` (`extension`),
			KEY `mimeType` (`mimeType`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;

	*/
	export class MySqlFs
	{
		private db:kr3m.db.MySqlDb;
		private tableName:string;
		private blobSizeLimit:number = 0;
		private delay:kr3m.async.Delayed;



		constructor(db:kr3m.db.MySqlDb, tableName:string)
		{
			this.db = db;
			this.tableName = tableName;

			this.delay = new kr3m.async.Delayed();
			this.db.getTableColumn(this.tableName, "content", (column:any) =>
			{
				if (!column)
				{
					logError("MySqlFs error, " + this.tableName + " has no content field");
					return;
				}

				var limits = {tinyblob:0xff, mediumblob:0xffffff, blob:0xffff, longblob:0xffffffff};
				this.blobSizeLimit = limits[column.Type];
				this.delay.execute();
			});
		}



		public set(
			toFilePath:string, content:NodeBuffer, mimeType?:string,
			callback?:() => void):void
		{
			this.delay.call(() =>
			{
				var extension = kr3m.util.File.getExtension(toFilePath);
				var mimeType = mimeType || kr3m.net.MimeTypes.getMimeTypeByFileName(toFilePath);

				var items:any[] = [];
				var i = 0;
				for (var offset = 0; offset < content.length; offset += this.blobSizeLimit)
				{
					var item =
					{
						path: toFilePath,
						part: i++,
						extension: extension,
						mimeType: mimeType,
						content: content.slice(offset, offset + this.blobSizeLimit)
					};
					items.push(item);
				}

				kr3m.async.Loop.forEach(items, (item:any, loop:() => void) =>
				{
					this.db.upsert(this.tableName, item, loop);
				}, () =>
				{
					this.db.deleteBatch(this.tableName, this.db.escape("path = ? AND part >= ?", [toFilePath, i]), () =>
					{
						if (callback)
							callback();
					});
				});
			});
		}



		public import(
			fromFilePath:string,
			callback?:(success:boolean) => void,
			toFilePath?:string):void
		{
			toFilePath = toFilePath || fromFilePath;
			fsLib.readFile(fromFilePath, (err:Error, content:NodeBuffer) =>
			{
				if (err)
				{
					logError(err);
					if (callback)
						callback(false);
					return;
				}

				this.set(toFilePath, content, null, () =>
				{
					if (callback)
						callback(true);
				});
			});
		}



		public get(
			fromFilePath:string,
			callback:(content:NodeBuffer, metadata?:any) => void):void
		{
			var sql = "SELECT * FROM `" + this.tableName + "` WHERE path = ? ORDER BY part ASC";
			sql = this.db.escape(sql, [fromFilePath]);
			this.db.fetchAll(sql, (items:any[]) =>
			{
				if (!items || items.length == 0)
					return callback(null);

				var contents = kr3m.util.Util.gather(items, "content");
				var content = Buffer.concat(contents);
				delete items[0].content;
				callback(content, items[0]);
			});
		}



		public export(
			fromFilePath:string,
			callback?:(success:boolean) => void,
			toFilePath?:string):void
		{
			toFilePath = toFilePath || fromFilePath;
			this.get(fromFilePath, (content:NodeBuffer) =>
			{
				if (!content)
				{
					if (callback)
						callback(false);
					return;
				}

				fsLib.writeFile(toFilePath, content, (err:Error) =>
				{
					if (err)
					{
						logError(err);
						if (callback)
							callback(false);
						return;
					}

					if (callback)
						callback(true);
				});
			});
		}



		public getFileSize(
			path:string,
			callback:(size:number) => void):void
		{
			var sql = "SELECT SUM(OCTET_LENGTH(content)) FROM `" + this.tableName + "` WHERE path = ? GROUP BY path";
			sql = this.db.escape(sql, [path]);
			this.db.fetchOne(sql, callback);
		}
	}
}

/// <reference path="../async/loop.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../db/mysqldb.ts"/>
/// <reference path="../lib/cluster.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.db
{
	interface Delta
	{
		version:number[];
		sql:string;
	}



	/*
		Diese Klasse aktualisiert automatisch die Datenbank wenn
		die update() Methode aufgerufen wird. Die Aktualisierung
		läuft nach dem bei kr3m üblichen Updatemechanismus ab:
		zuerst wird die aktuelle Datenbankversion ermittelt, in dem
		in der Tabelle settingsTableName nachgeschaut wird. Dort wird
		der Eintrag mit der `id` DB_VERSION ausgelesen und dessen
		`value` als aktuelle Version verwendet. Anschließend wird,
		sofern sich dieser Wert von desiredVersion unterscheidet,
		im deltaFolder nach SQL-Skripten gesucht, deren Dateiname
		dem Muster delta_X.X.X.X.sql entspricht, wobei X beliebige
		Zahlen sind. Alle Skripte, die zwischen der gefundenen
		Datenbankversion (exklusive) und der gewünschten
		Datenbankversion (inklusive) liegen, werden nacheinander
		ausgeführt. Nach jedem ausgeführten Skript wird die
		Versionsnummer der Datenbank in DB_VERSION auf die Verions-
		nummer des Skripts erhöht.

		Wird diese Klasse in einem Workerprozess verwendet, wird
		kein(!) Datenbankupdate ausgeführt, statt dessen wird der
		Programmablauf so lange angehalten, bis festgestellt wird,
		dass die Datenbankversion passt. D.h. es ist der Job des
		Masterprozesses die Datenbank zu aktualisieren und die
		Worker warten so lange auf ihn.

		Folgendes Skript kann verwendet werden um die Tabelle
		anzulegen:

			CREATE TABLE `admin_settings` (
				`id` varchar(128) NOT NULL DEFAULT '',
				`value` text NOT NULL,
				`lastModifiedWhen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;

			ALTER TABLE `admin_settings`
				ADD PRIMARY KEY (`id`);

			INSERT INTO `admin_settings` (`id`, `value`) VALUES ('DB_VERSION', '0.0.0.0');
	*/
	export class MySqlDbUpdater
	{
		public deltaPattern = /^delta_\d+\.\d+\.\d+\.\d+\.sql$/;



		constructor(
			protected db:MySqlDb,
			protected deltaFolder:string = "database",
			protected settingsTableName:string = "admin_settings")
		{
		}



		private compareVersion(a:number[], b:number[]):number
		{
			for (var i = 0; i < a.length; ++i)
			{
				if (a[i] != b[i])
					return a[i] - b[i];
			}
			return 0;
		}



		private getCurrentVersion(
			callback:(currentVersion:string) => void):void
		{
			var sql = "SELECT `value` FROM `" + this.settingsTableName + "` WHERE `id` = 'DB_VERSION' LIMIT 1;";
			this.db.fetchOne(sql, callback);
		}



		private setCurrentVersion(
			version:number[],
			callback:() => void):void
		{
			var sql = "UPDATE `" + this.settingsTableName + "` SET `value` = ? WHERE `id` = 'DB_VERSION' LIMIT 1;";
			sql = this.db.escape(sql, [version.join(".")]);
			this.db.query(sql, () => callback());
		}



		private getDeltaScripts(
			current:number[], desired:number[],
			callback:(deltas:Delta[]) => void):void
		{
			var deltaVersions:number[][] = [];
			kr3m.util.File.crawl(this.deltaFolder, (relativePath:string, isFolder:boolean, absolutePath:string) =>
			{
				var deltaVersion = kr3m.util.StringEx.getVersionParts(relativePath.slice(6, -4));
				if ((this.compareVersion(current, deltaVersion) < 0) && (this.compareVersion(deltaVersion, desired) <= 0))
					deltaVersions.push(deltaVersion);
			}, { wantFolders : false, pattern : this.deltaPattern });
			deltaVersions.sort((a:number[], b:number[]) => this.compareVersion(a, b));

			var deltas:Delta[] = [];
			kr3m.async.Loop.forEach(deltaVersions, (deltaVersion:number[], next:() => void) =>
			{
				var deltaPath = this.deltaFolder + "/delta_" + deltaVersion.join(".") + ".sql";
				fsLib.readFile(deltaPath, "utf-8", (err:string, sql:string) =>
				{
					if (err)
						throw err;

					deltas.push({version : deltaVersion, sql : sql});
					next();
				});
			}, () => callback(deltas));
		}



		public update(
			desiredVersion:string,
			callback:StatusCallback):void
		{
			if (!clusterLib || !clusterLib.worker)
				logDebug("checking database version");

			this.getCurrentVersion((currentVersion:string) =>
			{
				if (!currentVersion)
				{
					logError("database has no determinable version, aborting update")
					return callback(kr3m.ERROR_DATABASE);
				}

				var current = kr3m.util.StringEx.getVersionParts(currentVersion, 4);
				var desired = kr3m.util.StringEx.getVersionParts(desiredVersion, 4);
				if (this.compareVersion(current, desired) == 0)
				{
					if (!clusterLib || !clusterLib.worker)
						logDebug("database is up to date");
					return callback(kr3m.SUCCESS);
				}

				if (clusterLib && clusterLib.worker)
				{
					logWarning("old database version detected in worker, waiting for update");
					kr3m.async.Loop.loop((loopDone:(again:boolean) => void) =>
					{
						logVerbose("checking version again");
						this.getCurrentVersion((currentVersion:string) =>
						{
							current = kr3m.util.StringEx.getVersionParts(currentVersion, 4);
							if (this.compareVersion(current, desired) == 0)
								return callback(kr3m.SUCCESS);

							setTimeout(() => loopDone(true), 1000);
						});
					});
				}
				else
				{
					this.getDeltaScripts(current, desired, (deltas:Delta[]) =>
					{
						kr3m.async.Loop.forEach(deltas, (delta:Delta, next:() => void) =>
						{
							logWarning("applying database delta", delta.version.join("."));
							logWarning(delta.sql);
							this.db.query(delta.sql, () =>
							{
								logWarning("delta applied", delta.version.join("."));
								this.setCurrentVersion(delta.version, next);
							}, (errorMessage:string) =>
							{
								logError("error while updating database");
								logError(errorMessage);
								callback(kr3m.ERROR_DATABASE);
							});
						}, () =>
						{
							this.getCurrentVersion((currentVersion:string) =>
							{
								if (currentVersion == desiredVersion)
								{
									logDebug("updated database");
									callback(kr3m.SUCCESS);
								}
								else
								{
									logError("database version still not up to date - some delta files are propably missing");
									callback(kr3m.ERROR_DATABASE);
								}
							});
						});
					});
				}
			});
		}
	}
}

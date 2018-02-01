/// <reference path="../async/loop.ts"/>
/// <reference path="../csv/generator.ts"/>
/// <reference path="../db/database.ts"/>
/// <reference path="../db/mapreduceworkset.ts"/>
/// <reference path="../db/mysqldbconfig.ts"/>
/// <reference path="../lib/mysql.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../sql/generator.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>

//# PROFILING
/// <reference path="../util/stopwatch.ts"/>
//# /PROFILING



module kr3m.db
{
	export type ColOptions = {[colName:string]:{method?:string}};



	export class MySqlDb extends kr3m.db.Database
	{
		private connectionPool:any;
		private generator:kr3m.sql.Generator;

		public defaultBatchSize = 100;

//# PROFILING
		public slowQueryThreshold = 200; //Anfragen, die mehr Millisekunden dauern als hier angegeben werden als slow angezeigt
//# /PROFILING

		// Optionen für das Umwandeln (cast) von Datentypen beim Lesen und Schreiben aus der / in die Datenbank
		public castBooleans = true; // sollen enums ['false','true'] in booleans umgewandelt werden?

		public nextQueryLogColor = "";



		constructor(config:kr3m.db.MySqlDbConfig)
		{
			super(config);

			if (typeof config.multipleStatements == "undefined")
				config.multipleStatements = true;

			if (typeof config.connectionLimit == "undefined")
				config.connectionLimit = 10;

			if (typeof config.supportBigNumbers == "undefined")
				config.supportBigNumbers = false;

			this.connectionPool = mysqlLib.createPool(config);
			this.generator = new kr3m.sql.Generator(this.connectionPool);
		}



		public getGenerator():kr3m.sql.Generator
		{
			return new kr3m.sql.Generator(this.connectionPool);
		}



		/*
			Beendet alle Verbindungen zum Sql-Server und ruft callback
			auf wenn die Verbindungen geschlossen wurden.
		*/
		public release(
			callback?:Callback):void
		{
			this.connectionPool.end(callback);
		}



		public escapeValue(value:any):any
		{
			return this.generator.escapeValue(value);
		}



		/*
			Ersetzt alle ? im übergebenen SQL String durch die
			einzelnen Werte aus values. Die Werte werden dabei,
			bei Bedarf, noch mit umgebenden Anführungszeichen
			versehen.
		*/
		public escape(sql:string, values:any):string
		{
			return this.generator.escape(sql, values);
		}



		/*
			Escaped MySQL-IDs, z.B. Tabellen- oder Spaltennamen.
		*/
		public escapeId(id:string):string
		{
			return this.generator.escapeId(id);
		}



		/*
			Escaped die einzelnen Werte von obj
		*/
		public escapeObject(obj:Object):Object
		{
			return this.generator.escapeObject(obj);
		}



		/*
			Baut aus den Werten von obj eine sichere WHERE-Klausel zusammen
			Falls tableName angegeben wird, wird dieser allen Schlüsseln
			vorangestellt.
		*/
		public where(obj:Object|string, tableName?:string):string
		{
			return this.generator.where(obj, tableName);
		}



		/*
			Holt ein eine "Seite" der Daten aus der Datenbank. Wo Daten häufig
			seitenweise in einem CMS oder einer Statistik angezeigt werden,
			kann diese Funktion verwendet werden um sie zu erhalten.

			Als Ergebnis werden die Datenzeilen der "Seite" zurückgegeben
			zusammen mit der Gesamtzahl der verfügbaren Zeilen.
		*/
		public fetchPage(
			tableName:string,
			where:Object|string,
			orderBy:{col:string, asc:boolean}[],
			joins:{localCol:string, foreignCol:string, tableName:string}[],
			offset:number,
			limit:number,
			callback:(rows:Object[], totalCount:number) => void):void
		{
			var scripts = this.generator.fetchPage(tableName, where, orderBy, joins, offset, limit);
			this.fetchAll(scripts.sql, (rows) =>
			{
				this.fetchOne(scripts.countSql, (totalCount) =>
				{
					callback(rows, totalCount);
				});
			});
		}



		/*
			Führt ein SQL-Skript aus und gibt das gesamte Ergebnis als
			Array von dynamischen Objekten zurück. Leere Ergebnismengen
			werden als leeres Array zurück gegeben.
		*/
		public fetchAll(
			sql:string,
			callback:(rows:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			this.query(sql, (rows) =>
			{
				rows = rows || [];
				callback(rows);
			}, errorCallback);
		}



		/*
			Führt ein SQL-Skript aus und gibt die erste Zeile des
			Ergebnisses als dynamisches Objekt zurück. Leere
			Ergebnismengen werden als null zurück gegeben.
		*/
		public fetchRow(
			sql:string,
			callback:(row:any) => void,
			errorCallback?:ErrorCallback):void
		{
			this.fetchAll(sql, (rows) =>
			{
				callback(rows.length > 0 ? rows[0] : null);
			}, errorCallback);
		}



		/*
			Führt ein SQL-Skript aus und gibt die erste Reihe des
			Ergebnisses als Array zurück. Leere Ergebnismengen
			werden als leeres Array zurück gegeben.
		*/
		public fetchCol(
			sql:string,
			callback:(col:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			this.fetchAll(sql, (rows) =>
			{
				var result:any[] = [];
				for (var i = 0; i < rows.length; ++i)
				{
					for (var j in rows[i])
					{
						result.push(rows[i][j]);
						break;
					}
				}
				callback(result);
			}, errorCallback);
		}



		/*
			Führt ein SQL-Skript aus und gibt die erste Zelle der
			ersten Reihe des Ergebnisses zurück. Leere
			Ergebnismengen werden als null zurück gegeben.
		*/
		public fetchOne(
			sql:string,
			callback:(value:any) => void,
			errorCallback?:ErrorCallback):void
		{
			this.fetchAll(sql, (rows) =>
			{
				for (var i in rows[0])
					return callback(rows[0][i]);
				callback(null);
			}, errorCallback);
		}



		/*
			Führt ein SQL-Skript aus und gibt ein assoziatives
			Array / Objekt zurück, bei dem die Schlüssel aus der
			ersten Spalte der Ergebnismenge und die Werte aus der
			zweiten Spalte der Ergebnismenge bestimmt werden. Leere
			Ergebnismengen werden als leeres Objekt zurück gegeben.
		*/
		public fetchPairs(
			sql:string,
			callback:(pairs:Object) => void,
			errorCallback?:ErrorCallback):void
		{
			this.fetchAll(sql, (rows) =>
			{
				var pairs:Object = {};
				for (var i = 0; i < rows.length; ++i)
				{
					var first = true;
					var key:string;
					for (var j in rows[i])
					{
						if (first)
						{
							key = rows[i][j];
							first = false;
						}
						else
						{
							pairs[key] = rows[i][j];
							break;
						}
					}
				}
				callback(pairs);
			}, errorCallback);
		}



		/*
			Führt ein SQL-Skript aus und gibt ein assoziatives
			Array / Objekt zurück, bei dem die Schlüssel aus der
			ersten Spalte der Ergebnismenge bestimmt werden und die
			Werte die einzelnen Reihen sind.
			Alternativ kann keyCol angegeben werden, in welchem Fall
			die Spalte mit dem Namen keyCol als Schlüssel verwendet
			wird statt der ersten Spalte.
			Leere Ergebnismengen werden als leeres Objekt zurück gegeben.
		*/
		public fetchAssoc(
			sql:string,
			callback:(value:Object) => void,
			keyCol?:string,
			errorCallback?:ErrorCallback):void
		{
			this.fetchAll(sql, (rows) =>
			{
				var result:Object = {};
				for (var i = 0; i < rows.length; ++i)
				{
					if (keyCol)
					{
						result[rows[i][keyCol]] = rows[i];
					}
					else
					{
						for (var j in rows[i])
						{
							result[rows[i][j]] = rows[i];
							break;
						}
					}
				}
				callback(result);
			}, errorCallback);
		}



		/*
			Fügt ein gegebenes Objekt in eine Datenbanktabelle ein.
		*/
		public insert(
			tableName:string,
			obj:Object,
			callback?:(insertId:number) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = this.generator.insert(tableName, obj);
			this.query(sql, (result) =>
			{
				callback && callback(typeof result != "undefined" ? result.insertId : null);
			}, errorCallback);
		}



		/*
			Fügt mehrere gegebene Objekte in eine Datenbanktabelle ein.
			Die einzelnen Einfügeoperationen werden dabei zu Batches
			zusammengefasst um die Anzahl der Schreiboperationen zu
			minimieren. Die Maximalgröße der einzelnen Batches (in
			Objekten) kann optional mit übergeben werden.
		*/
		public insertBatch(
			tableName:string,
			objects:Object[],
			callback?:Callback,
			batchSize?:number,
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;
			kr3m.async.Loop.forEachBatch(objects, batchSize, (batch, nextBatch) =>
			{
				var sql = this.generator.insertBatch(tableName, batch);
				this.query(sql, result => nextBatch(), errorCallback);
			}, callback);
		}



		/*
			Fügt das gegebene Objekt in die Datenbank ein. Sollte es
			bereits existieren (oder ein anderes Objekt mit dem gleichen
			unique Key), wird vorher das alte Objekt aus der Datenbank
			gelöscht.

			Der Unterschied zwischen replace und upsert ist, dass
			replace alle Attribute, die nicht explizit angegeben werden,
			auf den Standardwert der Tabelle setzt, wogegen upsert die
			nicht angegebenen Werte unberührt lässt.
		*/
		public replace(
			tableName:string,
			obj:Object,
			callback?:(insertId:number) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = this.generator.replace(tableName, obj);
			this.query(sql, (result) =>
			{
				callback && callback(typeof result != "undefined" ? result.insertId : null);
			}, errorCallback);
		}



		/*
			Fügt die gegebenen Objekte in die Datenbank ein. Sollten
			irgendwelche der Objekte bereits existieren (weil ein
			älteres Objekt z.B. den gleichen Wert in einem unique
			Index hat), wird das ältere Objekt vorher aus der
			Datenbank gelöscht.

			Der Unterschied zwischen replaceBatch und upsertBatch ist,
			dass replaceBatch alle Attribute, die nicht explizit
			angegeben werden, auf den Standardwert der Tabelle setzt,
			wogegen upsertBatch die nicht angegebenen Werte unberührt
			lässt.
		*/
		public replaceBatch(
			tableName:string,
			objects:Object[],
			callback?:Callback,
			batchSize?:number,
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;
			kr3m.async.Loop.forEachBatch(objects, batchSize, (batch, nextBatch) =>
			{
				var sql = this.generator.replaceBatch(tableName, batch);
				this.query(sql, result => nextBatch(), errorCallback);
			}, callback);
		}



		/*
			Aktualisiert den Wert der Spalte field und setzt
			ihn auf value bei allen Datensätzen, welche die where
			Klausel erfüllen.
		*/
		public updateField(
			tableName:string,
			field:string,
			value:Object,
			where:string,
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			var sql = this.generator.updateField(tableName, field, value, where);
			this.query(sql, result => callback && callback(), errorCallback);
		}



		/*
			Aktualisiert die Werte eines einzelnen Objektes in
			einer Datenbanktabelle. Es wird die id bzw. das in
			indexCol übergebene Attribut als Schlüssel verwendet
			um das zu aktualisierende Objekt zu identifizieren.
		*/
		public update(
			tableName:string,
			obj:Object,
			callback?:SuccessCallback,
			indexCol:string|string[] = "id",
			errorCallback?:ErrorCallback):void
		{
			var sql = this.generator.update(tableName, obj, indexCol);
			this.query(sql, result => callback && callback(result && result.affectedRows == 1), errorCallback);
		}



		/*
			Funktioniert wie update, aktualisiert aber mehrere
			übergebene Objekte. Die einzelnen Schreiboperationen
			werden dabei zu Batches zusammengefasst, um die Anzahl
			der Schreiboperationen zu minimieren. Die maximale Größe
			der Batches kann optional auch mit übergeben werden.
		*/
		public updateBatch(
			tableName:string,
			objects:Object[],
			callback?:Callback,
			batchSize?:number,
			indexCol:string|string[] = "id",
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;
			var keys = typeof indexCol == "string" ? [<string> indexCol] : <string[]> indexCol;
			kr3m.async.Loop.forEachBatch(objects, batchSize, (batch, nextBatch) =>
			{
				var sql = "";
				for (var i = 0; i < batch.length; ++i)
					sql += this.generator.update(tableName, batch[i], indexCol);
				this.query(sql, result => nextBatch(), errorCallback);
			}, callback);
		}



		private buildUpdateSql(escapedItem:Object, colOptions:ColOptions):string
		{
			if (!colOptions)
				return "`" + kr3m.util.StringEx.joinAssoc(escapedItem, ", `", "` = ");

			var parts:string[] = [];
			for (var i in escapedItem)
			{
				var method = "overwrite";
				if (colOptions[i] && colOptions[i].method)
					method = colOptions[i].method;

				switch (method)
				{
					case "accumulate":
						parts.push("`" + i + "` = `" + i + "` + " + escapedItem[i]);
						break;

					default:
						parts.push("`" + i + "` = " + escapedItem[i]);
						break;
				}
			}
			return parts.join(", ");
		}



		/*
			Fügt das gegebene Objekt in die gegebene Datenbank ein - sollte
			es bereits vorhanden sein, wird es statt dessen aktualisiert.
			Vorsicht: ergibt unerwünschte Resultate wenn es auf eine
			InnoDB-Datenbank mit mehreren unique index Spalten verwendet wird.
			Ausschlaggebend hier sind die unique keys der verwendeten Tabelle.
			Vorsicht: kann unerwünschte Resultate haben, wenn es auf eine
			InnoDB-Datenbank mit mehreren unique index Spalten angewendet wird.

			Der Unterschied zwischen replace und upsert ist, dass
			replace alle Attribute, die nicht explizit angegeben werden,
			auf den Standardwert der Tabelle setzt, wogegen upsert die
			nicht angegebenen Werte unberührt lässt.
		*/
		public upsert(
			tableName:string,
			obj:Object,
			callback?:(insertId:number) => void,
			colOptions?:ColOptions,
			errorCallback?:ErrorCallback):void
		{
			var item = this.escapeObject(obj);
			var sql = "INSERT INTO `" + tableName;
			sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
			sql += kr3m.util.StringEx.joinValues(item) + ") ";
			sql += " ON DUPLICATE KEY UPDATE ";
			sql += this.buildUpdateSql(item, colOptions);
			sql += ";";

			this.query(sql, (result) =>
			{
				callback && callback(result ? result.insertId : null);
			}, errorCallback);
		}



		/*
			Fügt die gegebenen Objekte in die gegebene Datenbank ein - sollten
			sie bereits vorhanden sein, werden sie statt dessen aktualisiert.
			Ausschlaggebend hier sind die unique keys der verwendeten Tabelle.
			Vorsicht: kann unerwünschte Resultate haben, wenn es auf eine
			InnoDB-Datenbank mit mehreren unique index Spalten angewendet wird.

			Der Unterschied zwischen replaceBatch und upsertBatch ist,
			dass replaceBatch alle Attribute, die nicht explizit
			angegeben werden, auf den Standardwert der Tabelle setzt,
			wogegen upsertBatch die nicht angegebenen Werte unberührt
			lässt.

			TODO: wenn die Datenpakete zu groß werden, kann es zu SQL-Fehlern
			führen. Das könnte man noch abfangen.
		*/
		public upsertBatch(
			tableName:string,
			objects:Object[],
			callback?:Callback,
			batchSize?:number,
			colOptions?:ColOptions,
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;
			kr3m.async.Loop.forEachBatch(objects, batchSize, (batch, nextBatch) =>
			{
				var sql = "";
				for (var i = 0; i < batch.length; ++i)
				{
					var item = this.escapeObject(batch[i]);
					sql += "INSERT INTO `" + tableName;
					sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
					sql += kr3m.util.StringEx.joinValues(item) + ") ";
					sql += " ON DUPLICATE KEY UPDATE ";
					sql += this.buildUpdateSql(item, colOptions);
					sql += ";\n";
				}
				this.query(sql, result => nextBatch(), errorCallback);
			}, callback);
		}



		/*
			Führt ein TRUNCATE (entfernt alle Einträge) für die gegebene
			Datenbank durch. Achtung: TRUNCATE schlägt automatisch
			fehl wenn es sich um eine InnoDB-Datenbank mit foreign keys
			handelt.
		*/
		public truncate(
			tableName:string,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			var sql = this.generator.truncate(tableName);
			this.query(sql, (result) =>
			{
				callback && callback();
			}, errorCallback);
		}



		/*
			Löscht das übergebene Objekt aus der Datenbanktabelle
			(basierend auf dessen id Attribut, falls vorhanden,
			ansonsten werden alle Attribute für den WHERE Vergleich
			herangezogen).
		*/
		public delete(
			tableName:string,
			obj:Object,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			var sql = this.generator.delete(tableName, obj);
			this.query(sql, result => callback && callback(), errorCallback);
		}



		/*
			Löscht mehrere Zeilen aus einer Datenbanktabelle
			unter Verwendung einer beliebigen where-Klausel.
			Mögliche where-Klauseln sind z.B. "1", "id > 10",
			"name = 'Hans' AND age = 43" und alles andere, was
			einer gültigen SQL-Syntax entspricht. Alternativ
			kann where auch ein Objekt sein, dann werden alle
			Einträge gelöscht, welche die gleichen Eigenschaften
			haben wie das where-Objekt. Z.B. kann man alle User
			löschen, die "Hans" heissen und 43 Jahre alt sind
			indem man {name : "Hans", age : 43} als where übergibt.
		*/
		public deleteBatch(
			tableName:string,
			where:string|Object,
			callback?:(deletedCount:number) => void,
			errorCallback?:ErrorCallback):void
		{
			//# TODO: add limit parameter to this method
			var sql = this.generator.deleteBatch(tableName, where);
			this.query(sql, result => callback && callback(result ? result.affectedRows : 0), errorCallback);
		}



		public dropTable(
			tableName:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void
		{
			logWarning("dropping table", tableName, "on database", this.config.database);
			var sql = this.generator.dropTable(tableName);
			this.query(sql, callback, errorCallback);
		}



		public dropAllTables(
			callback:Callback,
			errorCallback?:ErrorCallback):void
		{
			logWarning("dropping all tables on database", this.config.database);
			this.getTableNames((tableNames) =>
			{
				kr3m.async.Loop.forEach(tableNames, (tableName, next) =>
				{
					this.dropTable(tableName, next, errorCallback);
				}, callback);
			}, errorCallback);
		}



		public renameTable(
			oldTableName:string,
			newTableName:string,
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			var sql = "RENAME `" + oldTableName + "` TO `" + newTableName + "`;";
			this.query(sql, () => callback && callback(), errorCallback);
		}



		/*
			Gibt die Namen aller Tabellen in der Datenbank zurück.
		*/
		public getTableNames(
			callback:(tableNames:string[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SHOW TABLES";
			this.fetchCol(sql, callback, errorCallback);
		}



		/*
			Gibt eine Beschreibung aller Spalten / Felder der
			gegebenen Tabelle zurück. Es wird nicht(!) der Inhalt
			der Tabelle zurück gegeben, sondern deren Aufbau.
		*/
		public getTableColumns(
			tableName:string,
			callback:(columns:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SHOW FULL COLUMNS FROM `" + tableName + "`";
			this.fetchAll(sql, callback, errorCallback);
		}



		/*
			Gibt eine Beschreibung einer Spalte / Feldes der
			gegebenen Tabelle zurück. Es wird nicht(!) der Inhalt
			der Tabelle zurück gegeben, sondern deren Aufbau.
		*/
		public getTableColumn(
			tableName:string, columnName:string,
			callback:(column:any) => void,
			errorCallback?:ErrorCallback):void
		{
			this.getTableColumns(tableName, (columns) =>
			{
				for (var i = 0; i < columns.length; ++i)
				{
					if (columns[i].Field == columnName)
						return callback(columns[i]);
				}
				callback(null);
			}, errorCallback);
		}



		/*
			Gibt den internen Status der Datenbank zurück.
			Funktioniert aktuell nur für InnoDB-Datenbanken,
			was aber eigentlich kein Problem sein sollte, da
			wir immer InnoDB-Datenbanken (oder deren Derivate)
			benutzen.
		*/
		public getStatus(
			callback:StatusCallback):void
		{
			this.query("SHOW ENGINE INNODB STATUS", result => callback(result[0].Status));
		}



		/*
			Gibt eine Beschreibung aller Indices der
			gegebenen Tabelle zurück.
		*/
		public getTableIndexes(
			tableName:string,
			callback:(indexes:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SHOW INDEXES FROM `" + tableName + "`";
			this.fetchAll(sql, (rawIndexes) =>
			{
				var mapped:any = {};
				for (var i = 0; i < rawIndexes.length; ++i)
				{
					var name = rawIndexes[i].Key_name;
					if (!mapped[name])
						mapped[name] = {name:name, parts:[], unique:rawIndexes[i].Non_unique == 0};
					mapped[name].parts.push(rawIndexes[i].Column_name);
				}
				var indexes:any[] = [];
				for (var j in mapped)
					indexes.push(mapped[j]);

				kr3m.util.Util.sortBy(indexes, "name");
				callback(indexes);
			}, errorCallback);
		}



		/*
			Gibt die Constraints / Fremdschlüssel der gewünschten
			Tabelle zurück. Diese Funktion benötigt Zugriffsrechte
			auf die Datenbank information_schema des MySql-Servers.
			Es kann also unter Umständen passieren, dass manche
			Datenbankuser diese Funktion nicht ausführen können.
		*/
		public getTableConstraints(
			tableName:string,
			callback:(constraints:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql =
				"SELECT CONSTRAINT_NAME AS `name`, TABLE_NAME AS `table`, COLUMN_NAME AS `column`, REFERENCED_TABLE_NAME AS `foreignTable`, REFERENCED_COLUMN_NAME AS `foreignColumn` "+
				"FROM information_schema.KEY_COLUMN_USAGE " +
				"WHERE TABLE_SCHEMA = '" + this.config.database + "' "+
				"AND TABLE_NAME = '" + tableName + "' "+
				"AND referenced_column_name IS NOT NULL";
			this.fetchAll(sql, (constraints) =>
			{
				kr3m.util.Util.sortBy(constraints, "column");
				callback(constraints);
			}, errorCallback);
		}



		/*
			Funktioniert genau so wie getTableContraints mit dem
			Unterschied, daß nicht die Constraints der Tabelle
			zurück gegeben werden, sondern die Constraints aller
			anderen Tabellen, die sich auf die gewünschte Tabelle
			beziehen.
		*/
		public getTableForeignConstraints(
			tableName:string,
			callback:(constraints:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql =
				"SELECT TABLE_NAME AS `table`, COLUMN_NAME AS `column`, REFERENCED_TABLE_NAME AS `foreignTable`, REFERENCED_COLUMN_NAME AS `foreignColumn` "+
				"FROM information_schema.KEY_COLUMN_USAGE " +
				"WHERE TABLE_SCHEMA = '" + this.config.database + "' "+
				"AND REFERENCED_TABLE_NAME = '" + tableName + "' "+
				"AND referenced_column_name IS NOT NULL";
			this.fetchAll(sql, (constraints) =>
			{
				kr3m.util.Util.sortBy(constraints, "foreignTable");
				callback(constraints);
			}, errorCallback);
		}



		public analyseTable(
			tableName:string,
			callback:(fields:any[]) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SELECT * FROM `" + tableName + "` PROCEDURE ANALYSE ()";
			this.fetchAll(sql, callback, errorCallback);
		}



		/*
			Gibt ein SQL-Skript zurück, mit welchem die gewünschte
			Tabelle erzeugt werden kann.
		*/
		public getTableScript(
			tableName:string,
			callback:(script:string) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SHOW CREATE TABLE `" + tableName + "`";
			this.fetchRow(sql, (row) =>
			{
				callback(row["Create Table"]);
			}, errorCallback);
		}



		/*
			Legt einen neuen Datenbankuser mit den gegebenen Rechten
			an und gibt ihn zurück. Falls der entsprechende User schon
			existiert, wird einfach callback aufgerufen.
		*/
		public createUser(
			user:string,
			password:string,
			hosts:string[],
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public createUser(
			user:string,
			password:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public createUser():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var user = <string> arguments[0];
			var password = <string> arguments[1];
			var callback = <Callback> first("function", 0, 0);
			var errorCallback = <StringCallback> first("function", 0, 1);
			var hosts = <string[]> first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];

			var sql = "CREATE USER ?@? IDENTIFIED BY ?;";
			sql = hosts.map((host) => this.escape(sql, [user, host, password])).join("\n");
			this.query(sql, callback, errorCallback);
		}



		public dropUser(
			user:string,
			hosts:string[],
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public dropUser(
			user:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public dropUser():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var user = <string> arguments[0];
			var callback = <Callback> first("function", 0, 0);
			var errorCallback = <StringCallback> first("function", 0, 1);
			var hosts = <string[]> first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];

			var sql = "DROP USER ?@?;";
			sql = hosts.map(host => this.escape(sql, [user, host])).join("\n");
			this.query(sql, callback, errorCallback);
		}



		public grantAllPrivileges(
			dababaseName:string,
			user:string,
			hosts:string[],
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public grantAllPrivileges(
			dababaseName:string,
			user:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void;

		public grantAllPrivileges():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var dababaseName = <string> arguments[0];
			var user = <string> arguments[1];
			var callback = <Callback> first("function", 0, 0);
			var errorCallback = <StringCallback> first("function", 0, 1);
			var hosts = <string[]> first("object", 0, 0) || ["%", "localhost", "127.0.0.1", "::1"];

			var sql =
			`
				GRANT USAGE ON *.* TO :user@:host WITH
					MAX_QUERIES_PER_HOUR 0
					MAX_CONNECTIONS_PER_HOUR 0
					MAX_UPDATES_PER_HOUR 0
					MAX_USER_CONNECTIONS 0;

				GRANT ALL PRIVILEGES ON \`` + dababaseName + `\`.* TO :user@:host;
			`;
			sql = hosts.map(host => this.escape(sql, {user : user, host : host})).join("\n");
			sql += "\nFLUSH PRIVILEGES;";
			this.query(sql, callback, errorCallback);
		}



		public doesUserExist(
			user:string,
			callback:(exists:boolean) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SELECT COUNT(*) FROM `mysql`.`user` WHERE `User` = ?";
			sql = this.escape(sql, [user]);
			this.fetchOne(sql, count => callback(count > 0), errorCallback);
		}



		public getAllUserDetails(
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SELECT * FROM `mysql`.`user`";
			this.fetchAll(sql, (rawData) =>
			{
				rawData.forEach(rd => delete rd.Password);
				callback(rawData);
			}, errorCallback);
		}



		public getUserDetails(
			user:string,
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			var sql = this.escape("SELECT * FROM `mysql`.`user` WHERE `User` = ?", [user]);
			this.fetchAll(sql, (rawData) =>
			{
				rawData.forEach(rd => delete rd.Password);
				callback(rawData);
			}, errorCallback);
		}



		/*
			Gibt zurück ob die gewünschte Datenbank existiert (und der
			aktuelle User darauf zugreifen darf).
		*/
		public doesDatabaseExist(
			database:string,
			callback:(exists:boolean) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?;";
			sql = this.escape(sql, [database]);
			this.fetchOne(sql, name => callback(!!name), errorCallback);
		}



		public getAllDatabaseNames(
			callback:CB<string[]>,
			errorCallback?:ErrorCallback):void
		{
			this.fetchCol("SHOW DATABASES", callback, errorCallback);
		}



		/*
			Gibt ein Objekt der MySqlDb zurück über welches auf die
			gewünschte Datenbank zugegriffen werden kann. Wenn user
			und password nicht gesetzt werden, wird der User aus dem
			MySqlDb-Objekt verwendet, auf welchem getDatabase
			aufgerufen wurde.
		*/
		public getDatabase(
			database:string, user:string, password:string,
			callback:(otherDb:MySqlDb) => void,
			errorCallback?:ErrorCallback):void;

		public getDatabase(
			database:string,
			callback:(otherDb:MySqlDb) => void,
			errorCallback?:ErrorCallback):void;

		public getDatabase():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var callback = <(otherDb:MySqlDb) => void> first("function", 0, 0);
			var errorCallback = <StringCallback> first("function", 0, 1);

			var config = kr3m.util.Util.clone(this.config);
			config.database = arguments[0];
			if (arguments.length > 3)
			{
				config.user = arguments[1];
				config.password = arguments[2];
			}
			callback(new MySqlDb(config));
		}



		/*
			Legt eine neue Datenbank mit dem gegebenen Namen an.
			Um damit zu arbeiten einfach anschließend getDatabase
			aufrufen. Falls die Datenbank schon existiert passiert
			nichts und es wird die callback-Funktion aufgerufen.
		*/
		public createDatabase(
			database:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void
		{
			var sql = "CREATE DATABASE IF NOT EXISTS " + database + " COLLATE utf8_general_ci";
			this.query(sql, callback, errorCallback);
		}



		/*
			Löscht die angegebene Datenbank ohne Sicherheitsabfrage.
			Es sollte klar sein, dass diese Funktion nur mit Vorsicht
			zu benutzen ist.
		*/
		public dropDatabase(
			database:string,
			callback:Callback,
			errorCallback?:ErrorCallback):void
		{
			logWarning("dropping database", database);
			var sql = "DROP DATABASE " + database + ";";
			this.query(sql, callback, errorCallback);
		}



		/*
			Gibt zurück wie groß die aktuelle Datenbank insgesamt (total)
			ist, welchen Teil davon die Daten einnehmen (dataSize) und
			welchen die Indizes (indexSize). Alle Werte sind in Bytes.
		*/
		public getDatabaseSize(
			callback:(total:number, dataSize:number, indexSize:number) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql =
			`
				SELECT SUM(data_length) AS \`dataSize\`, SUM(index_length) AS \`indexSize\`
				FROM information_schema.tables
				WHERE table_schema = ?
			`;
			sql = this.escape(sql, [this.config.database]);
			this.fetchRow(sql, (row) =>
			{
				callback(row.dataSize + row.indexSize, row.dataSize, row.indexSize);
			}, errorCallback);
		}



		/*
			Gibt zurück wie groß die angegebene Tabelle insgesamt (total)
			ist, welchen Teil davon die Daten einnehmen (dataSize) und
			welchen die Indizes (indexSize). Alle Werte sind in Bytes.
		*/
		public getTableSize(
			tableName:string,
			callback:(total:number, dataSize:number, indexSize:number) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql =
			`
				SELECT data_length, index_length
				FROM information_schema.tables
				WHERE table_schema = ? AND table_name = ?
			`;
			sql = this.escape(sql, [this.config.database, tableName]);
			this.fetchRow(sql, (row) =>
			{
				callback(row.data_length + row.index_length, row.data_length, row.index_length);
			}, errorCallback);
		}



		/*
			Gibt zurück wie groß die Tabellen der aktuellen Datenbank
			in Bytes sind.
		*/
		public getTableSizes(
			callback:(sizeByTable:{[tableName:string]:number}) => void,
			errorCallback?:ErrorCallback):void
		{
			var sql =
			`
				SELECT table_name, data_length + index_length
				FROM information_schema.tables
				WHERE table_schema = ?
			`;
			sql = this.escape(sql, [this.config.database]);
			this.fetchPairs(sql, callback, errorCallback);
		}



		/*
			Gibt zurück, wie viele Verbindungen auf einmal zur
			Datenbank geöffnet werden können. Das gibt gleichzeitig
			auch an, wie viele SQL-Anfragen gleichzeitig ausgeführt
			werden können.
		*/
		public getConnectionLimit():number
		{
			return this.config.connectionLimit;
		}



		private castType(field:any, next:Function):any
		{
			if (field.type == "STRING")
			{
				var value = field.string();
				if (this.castBooleans)
				{
					if (value === "true")
						return true;
					if (value === "false")
						return false;
				}
				return value;
			}
			return next();
		}



		/*
			Führt eine beliebige SQL-Anweisung durch, ohne Überprüfungen,
			Garantien oder Sicherheitsnetze. Sollte im Idealfall nur
			intern in der MySqlDb-Klasse verwendet werden.
		*/
		public query(
			sql:string,
			callback?:(result:any) => void,
			errorCallback?:ErrorCallback):void
		{
			var nextQueryLogColor = this.nextQueryLogColor;
			this.nextQueryLogColor = "";

			this.connectionPool.getConnection((err:any, connection:any) =>
			{
				if (err)
				{
					if (errorCallback)
						return errorCallback("error while connecting to MySql database\n" + sql + "\n" + err.toString());

					logError("error while connecting to MySql database");
					logError(sql);
					logError(err);
					return callback && callback(undefined);
				}
//# PROFILING
				var watch = new kr3m.util.Stopwatch();
//# VERBOSE
				logProfilingLow(sql.length > 120 ? sql.slice(0, 120) + " (...)" : sql);
//# /VERBOSE
//# /PROFILING
				if (nextQueryLogColor)
					log(nextQueryLogColor, sql, kr3m.util.Log.COLOR_RESET);

				var options =
				{
					sql : sql,
					typeCast : this.castType.bind(this)
				};
				connection.query(options, (err:any, result:any) =>
				{
					if (err)
					{
						if (errorCallback)
						{
							connection.release();
							return errorCallback("an error (" + err.code + ") occured in SQL script: " + sql);
						}

						logError("an error (" + err.code + ") occured in SQL script:");
						logError(sql);
						connection.release();
						return callback && callback(undefined);
					}
//# PROFILING
					if (watch.getDuration() >= this.slowQueryThreshold)
					{
						logProfiling("slow mysql query detected (" + watch.getDuration() + " ms)");
						logProfiling(sql);
						sql = "EXPLAIN " + sql;
						connection.query(sql, (explainErr:any, explainResult:any) =>
						{
							if (explainResult != undefined)
								logProfiling("explain =", explainResult);
							else
								logProfiling("explain not possible");
							logProfiling("---------------------------------------------");
							connection.release();
							callback && callback(result);
						});
					}
					else
					{
						connection.release();
						callback && callback(result);
					}
//# /PROFILING
//# !PROFILING
					connection.release();
					callback && callback(result);
//# /!PROFILING
				});
			});
		}



		/*
			Führt eine SQL Anweisung durch und ruft für jede empfange Zeile
			die dataCallback Funktion auf. Nach der letzten Zeile wird
			doneCallback aufgerufen. Der Hauptunterschied zu query ist,
			daß die Funktion iterativ läuft und die Daten nicht sammelt,
			d.h. der gesamte Ablauf ist flüssiger wenn man mit vielen
			Datensätzen arbeitet.

			Die callback-Methode in dataCallback kann optional mit einem
			abort-Parameter aufgerufen werden. Ist dieser true, wird
			der weitere Prozess abgebrochen und die doneCallback sofort
			aufgerufen.

			queryIterative verwendet kein Caching, auch wenn es für eine
			oder mehrere Tabellen aktiviert wurde.
		*/
		public queryIterative(
			sql:string,
			dataCallback:(rows:any[], callback:(abort?:boolean) => void) => void,
			doneCallback?:Callback,
			batchSize?:number,
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;

			var nextQueryLogColor = this.nextQueryLogColor;
			this.nextQueryLogColor = "";

			this.connectionPool.getConnection((err:any, connection:any) =>
			{
				if (err)
				{
					if (errorCallback)
						return errorCallback("error while connecting to MySql database\n" + sql + "\n" + err.toString());

					logError("error while connecting to MySql database");
					logError(sql);
					logError(err);
					return doneCallback && doneCallback();
				}

				if (nextQueryLogColor)
					log(nextQueryLogColor, sql, kr3m.util.Log.COLOR_RESET);

				var inErrorState = false;
				var batch:any[] = [];
				var options =
				{
					sql : sql,
					typeCast : this.castType.bind(this)
				};
				var query = connection.query(options);
				query.on("error", (err:any) =>
				{
					inErrorState = true;
					if (errorCallback)
						return errorCallback("an error (" + err.code + ") occured in SQL script: " + sql);
					logError("an error (" + err.code + ") occured in SQL script:");
					logError(sql);
				}).on("result", (row:any) =>
				{
					batch.push(row);
					if (batch.length == batchSize)
					{
						connection.pause();
						dataCallback(batch, (abort) =>
						{
							if (abort)
							{
								connection.release();
								doneCallback && doneCallback();
							}
							else
							{
								batch = [];
								connection.resume();
							}
						});
					}
				}).on("end", () =>
				{
					connection.release();
					if (!inErrorState)
					{
						if (batch.length == 0)
							return doneCallback && doneCallback();

						dataCallback(batch, () => doneCallback && doneCallback());
					}
				});
			});
		}



		/*
			Eine mapReduce Funktion zum Handhaben großer Datenmengen.
			map und reduce Funktionen müssen synchron arbeiten!
		*/
		public mapReduce<MT>(
			sql:string,
			mapFunc:(rawItem:any, emit:(key:string, mappedItem:MT) => void) => void,
			reduceFunc:(key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void) => void,
			callback:(items:{[key:string]:MT}) => void,
			errorCallback?:ErrorCallback):void
		{
			var workset = new kr3m.db.MapReduceWorkset<MT>();
			this.queryIterative(sql, (rows, queryCallback) =>
			{
				workset.map(rows, mapFunc);
				workset.reduce(reduceFunc);
				queryCallback();
			}, () => callback(workset.flushAssoc()), this.defaultBatchSize, errorCallback);
		}



		/*
			Einfachere Version von mapReduce. Statt einer emit-Funktion
			wird der Rückgabewert der Funktionen als einziges emit gewertet,
			d.h. es kann pro map- und pro reduce-Durchlauf nur genau ein
			Objekt ausgegeben werden. Außerdem können beim reduce-Durchlauf
			die Schlüssel nicht geändert werden.
		*/
		public mapReduceSimple<MT>(
			sql:string,
			mapFunc:(rawItem:any) => [string, MT],
			reduceFunc:(key:string, mappedItems:MT[]) => MT,
			callback:(items:{[key:string]:MT}) => void,
			errorCallback?:ErrorCallback):void
		{
			var workset = new kr3m.db.MapReduceWorkset<MT>();
			this.queryIterative(sql, (rows, queryCallback) =>
			{
				workset.mapSimple(rows, mapFunc);
				workset.reduceSimple(reduceFunc);
				queryCallback();
			}, () => callback(workset.flushAssoc()), this.defaultBatchSize, errorCallback);
		}



		public mapReduceFlush<MT>(
			sql:string,
			mapFunc:(rawItem:any, emit:(key:string, mappedItem:MT) => void) => void,
			reduceFunc:(key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void) => void,
			flushFunc:(rowsToFlush:MT[], callback:Callback) => void,
			callback:Callback,
			batchSize?:number,
			errorCallback?:ErrorCallback):void
		{
			batchSize = batchSize || this.defaultBatchSize;

			var threshold = 2 * batchSize;

			var access:string[] = [];
			var reduceFunc2 = (key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void) =>
			{
				reduceFunc(key, mappedItems, (key, reducedItem) =>
				{
					emit(key, reducedItem);
					kr3m.util.Util.remove(access, key);
					access.unshift(key);
				});
			};

			var workset = new kr3m.db.MapReduceWorkset<MT>();
			this.queryIterative(sql, (rows, queryCallback) =>
			{
				workset.map(rows, mapFunc);
				workset.reduce(reduceFunc2);
				if (access.length <= threshold)
					return queryCallback();

				var flushKeys = access.slice(-batchSize);
				access = access.slice(0, -batchSize);

				var rowsToFlush = workset.flushKeys(flushKeys);
				flushFunc(rowsToFlush, queryCallback);
			}, () => flushFunc(workset.flushArray(), callback), batchSize, errorCallback);
		}



		/*
			Version von mapReduce, welche asynchrone map und reduce
			Funktionen unterstützt.
		*/
		public mapReduceAsync<MT>(
			sql:string,
			mapFunc:(rawItem:any, emit:(key:string, mappedItem:MT) => void, callback:Callback) => void,
			reduceFunc:(key:string, mappedItems:MT[], emit:(key:string, reducedItem:MT) => void, callback:Callback) => void,
			callback:(rows:{[key:string]:MT}) => void,
			errorCallback?:ErrorCallback):void
		{
			var workset = new kr3m.db.MapReduceWorkset<MT>();
			this.queryIterative(sql, (rows, queryCallback) =>
			{
				workset.mapAsync(rows, mapFunc, () =>
				{
					workset.reduceAsync(reduceFunc, queryCallback);
				});
			}, () => callback(workset.flushAssoc()), this.defaultBatchSize, errorCallback);
		}



		public exportCSV(
			sql:string,
			filePath:string,
			callback?:SuccessCallback):void
		{
			var func = kr3m.csv.generateLocalFile;
			this.queryIterative(sql, (rows, nextBatch) =>
			{
				func(filePath, rows, (success) =>
				{
					if (!success)
						return callback && callback(false);

					func = kr3m.csv.appendToLocalFile;
					nextBatch();
				});
			}, () => callback && callback(true));
		}
	}
}

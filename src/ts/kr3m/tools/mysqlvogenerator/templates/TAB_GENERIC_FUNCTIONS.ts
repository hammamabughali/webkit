		public isColumnName(name:string):boolean
		{
			return (##columnNames##).indexOf(name) >= 0;
		}



		public getColumnNames():string[]
		{
			return ##columnNames##;
		}



		/*
			Generates an ORDER BY string for mysql from the strings
			given in ordering.

			The parameter ordering can contain columnNames of the table
			or "asc" / "desc" (case is ignored). asc and desc will be
			added to the last columnName added before the asc / desc
			parameter.

			Values that are neither "asc", "desc" or a columnName will
			be silently ignored.

			Example:
				table.buildOrdering(["lastName", "firstName", "ASC", "age", "DESC"]);
		*/
		public buildOrdering(ordering:string[]):string
		{
			var parts:string[] = [];
			var ascDescRe = /^asc|desc$/i;
			for (var i = 0; i < ordering.length; ++i)
			{
				if (this.isColumnName(ordering[i]))
					parts.push(db.escapeId(ordering[i]));
				else if (ascDescRe.test(ordering[i]) && parts.length > 0)
					parts[parts.length - 1] += " " + ordering[i].toUpperCase();
			}
			return parts.length > 0 ? " ORDER BY " + parts.join(", ") : "";
		}



		public getCount(
			where:string,
			callback:NumberCallback,
			errorCallback:ErrorCallback):void;

		public getCount(
			where:string,
			callback:NumberCallback):void;

		public getCount(
			callback:NumberCallback,
			errorCallback:ErrorCallback):void;

		public getCount(
			callback:NumberCallback):void;

		public getCount():void
		{
			var u = kr3m.util.Util;

			var where = <string> u.getFirstOfType(arguments, "string", 0, 0) || "1";
			where = where.replace(/^\s*where\s*/i, " ");

			var callback = <(count:number) => void> u.getFirstOfType(arguments, "function", 0, 0);
			var errorCallback = <ErrorCallback> u.getFirstOfType(arguments, "function", 0, 1);

			var sql = "SELECT COUNT(*) FROM `##tableName##` WHERE " + where;
			db.fetchOne(sql, callback, errorCallback);
		}



		private wrapErrorCallback(
			errorCallback:ErrorCallback,
			functionName:string):ErrorCallback
		{
			if (!errorCallback)
				return errorCallback;

			var newCallback = (errorMessage) =>
			{
				errorCallback("##className##." + functionName + " - " + errorMessage);
			}
			return newCallback;
		}



		public get(
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:CB<##className##[]>):void;

		public get(
			whereSql:string,
			offset:number,
			limit:number,
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			whereSql:string,
			offset:number,
			limit:number,
			callback:CB<##className##[]>):void;

		public get(
			whereSql:string,
			ordering:string[],
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			whereSql:string,
			ordering:string[],
			callback:CB<##className##[]>):void;

		public get(
			whereSql:string,
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			whereSql:string,
			callback:CB<##className##[]>):void;

		public get(
			offset:number,
			limit:number,
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			offset:number,
			limit:number,
			callback:CB<##className##[]>):void;

		public get(
			callback:CB<##className##[]>,
			errorCallback:ErrorCallback):void;

		public get(
			callback:CB<##className##[]>):void;

		public get():void
		{
			var u = kr3m.util.Util;

			var whereSql = <string> u.getFirstOfType(arguments, "string", 0, 0) || "1";
			whereSql = whereSql.replace(/^\s*where\s*/i, " ");

			var callback = <CB<##className##[]>> u.getFirstOfType(arguments, "function", 0, 0);
			var errorCallback = <ErrorCallback> u.getFirstOfType(arguments, "function", 0, 1);
			errorCallback = this.wrapErrorCallback(errorCallback, "get");

			var sql = "SELECT * FROM `##tableName##` WHERE " + whereSql;

			var ordering = <string[]> u.getFirstOfType(arguments, "object", 0, 0) || [];
			if (ordering.length > 0)
				sql += this.buildOrdering(ordering);

			var offset = <number> u.getFirstOfType(arguments, "number", 0, 0) || 0;
			var limit = <number> u.getFirstOfType(arguments, "number", 0, 1) || 0;
			if (limit > 0)
				sql += db.escape(" LIMIT ?, ?", [offset, limit]);

			db.fetchAll(sql, (rows:any[]) =>
			{
				for (var i = 0; i < rows.length; ++i)
				{
					rows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;
					rows[i].postLoad();
				}
				callback(rows);
			}, errorCallback);
		}



		public getIterative(
			where:string,
			dataCallback:(vos:##className##[], callback:Callback) => void,
			doneCallback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "getIterative");
			where = where.replace(/^\s*where\s*/i, " ");
			var sql = "SELECT * FROM `##tableName##` WHERE " + where;
			db.queryIterative(sql, (rows, nextBatch) =>
			{
				for (var i = 0; i < rows.length; ++i)
				{
					rows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;
					rows[i].postLoad();
				}
				dataCallback(rows, nextBatch);
			}, doneCallback, 20, errorCallback);
		}



		/*
			Saves the given objects into the table without and kind of checking.
		*/
		public updateRaw(
			rows:any[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "updateRaw");
			db.updateBatch("##tableName##", rows, callback, db.defaultBatchSize, "id", errorCallback);
		}



		/*
			Calls the function of the same name from kr3m.db.MySqlDb using this
			table's name and changing the result elements into VOs before returning
			them.

			Careful: if joins are used, the returned VOs may contain attributes that
			aren't defined in the class definition (in Typescript).
		*/
		public fetchPage(
			where:Object|string,
			orderBy:{col:string, asc:boolean}[],
			joins:{localCol:string, foreignCol:string, tableName:string}[],
			offset:number, limit:number,
			callback:(rows:any[], totalCount:number) => void):void
		{
			db.fetchPage("##tableName##", where, orderBy, joins, offset, limit, (rows:any[], totalCount:number) =>
			{
				for (var i = 0; i < rows.length; ++i)
				{
					rows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;
					rows[i].postLoad();
				}
				callback(rows, totalCount);
			});
		}



		public fetchCol(
			colName:string,
			distinct:boolean,
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:(col:any[]) => void,
			errorCallback:ErrorCallback):void;

		public fetchCol(
			colName:string,
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:(col:any[]) => void,
			errorCallback:ErrorCallback):void;

		public fetchCol(
			colName:string,
			distinct:boolean,
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:(col:any[]) => void):void;

		public fetchCol(
			colName:string,
			whereSql:string,
			offset:number,
			limit:number,
			ordering:string[],
			callback:(col:any[]) => void):void;

		public fetchCol(
			colName:string,
			distinct:boolean,
			whereSql:string,
			callback:(col:any[]) => void,
			errorCallback:ErrorCallback):void;

		public fetchCol(
			colName:string,
			whereSql:string,
			callback:(col:any[]) => void,
			errorCallback:ErrorCallback):void;

		public fetchCol(
			colName:string,
			distinct:boolean,
			whereSql:string,
			callback:(col:any[]) => void):void;

		public fetchCol(
			colName:string,
			whereSql:string,
			callback:(col:any[]) => void):void;

		public fetchCol(
			colName:string,
			distinct:boolean,
			callback:(col:any[]) => void):void;

		public fetchCol(
			colName:string,
			callback:(col:any[]) => void):void;

		public fetchCol():void
		{
			var u = kr3m.util.Util;

			var colName = <string> u.getFirstOfType(arguments, "string", 0, 0);
			var whereSql = <string> u.getFirstOfType(arguments, "string", 0, 1) || "1";
			var offset = <number> u.getFirstOfType(arguments, "number", 0, 0) || 0;
			var limit = <number> u.getFirstOfType(arguments, "number", 0, 1) || 0;
			var ordering = <string[]> u.getFirstOfType(arguments, "object", 0, 1) || [];
			var distinct = <boolean> u.getFirstOfType(arguments, "boolean", 0, 0) || false;
			var callback = <(col:any[]) => void> u.getFirstOfType(arguments, "function", 0, 0);
			var errorCallback = <ErrorCallback> u.getFirstOfType(arguments, "function", 0, 1);
			errorCallback = this.wrapErrorCallback(errorCallback, "fetchCol");

			if (!this.isColumnName(colName))
			{
				var error = "invalid column name for table ##tableName##: " + colName;
				if (errorCallback)
					return errorCallback(error);

				logError(error);
				return callback([]);
			}

			whereSql = whereSql.replace(/^\s*where\s*/i, " ");
			var limitSql = (limit > 0 || offset > 0) ? " LIMIT " + offset + ", " + (offset + limit) : "";
			var orderSql = this.buildOrdering(ordering);
			var distinctSql = distinct ? "DISTINCT " : "";

			var sql = "SELECT " + distinctSql + "`" + colName + "` FROM `##tableName##` WHERE " + whereSql + orderSql + limitSql;
			db.fetchCol(sql, callback, errorCallback);
		}



		public fetchOne(
			colName:string,
			whereSql:string,
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "fetchOne");
			if (!this.isColumnName(colName))
			{
				var error = "invalid column name for table ##tableName##: " + colName;
				if (errorCallback)
					return errorCallback(error);

				logError(error);
				return callback(undefined);
			}

			whereSql = whereSql.replace(/^\s*where\s*/i, " ");
			var sql = "SELECT `" + colName + "` FROM `##tableName##` WHERE " + whereSql + " LIMIT 1;";
			db.fetchOne(sql, callback, errorCallback);
		}



		public fetchPairs(
			keyName:string,
			valueName:string,
			whereSql:string,
			callback:(pairs:{[name:string]:any}) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "fetchPairs");
			if (!this.isColumnName(keyName))
			{
				var error = "invalid column name for table ##tableName##: " + keyName;
				if (errorCallback)
					return errorCallback(error);

				logError(error);
				return callback([]);
			}

			if (!this.isColumnName(valueName))
			{
				var error = "invalid column name for table ##tableName##: " + valueName;
				if (errorCallback)
					return errorCallback(error);

				logError(error);
				return callback([]);
			}

			if (keyName == valueName)
				valueName += "` AS `_" + valueName;

			whereSql = whereSql.replace(/^\s*where\s*/i, " ");
			var sql = "SELECT `" + keyName + "`, `" + valueName + "` FROM `##tableName##` WHERE " + whereSql;
			db.fetchPairs(sql, callback, errorCallback);
		}



		public deleteWhere(
			where:Object|string,
			callback?:(deletedCount:number) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "deleteWhere");
			db.deleteBatch("##tableName##", where, callback, errorCallback);
		}



		public getTableName():string
		{
			return "##tableName##";
		}

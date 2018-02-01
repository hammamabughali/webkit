		public ##finderName##(
			where:string|{[colName:string]:any},
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(
			where:string|{[colName:string]:any},
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##(
			where:string|{[colName:string]:any},
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(
			where:string|{[colName:string]:any},
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##(
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##():void
		{
			var u = kr3m.util.Util;

			var whereObj = <{[colName:string]:any}> u.getFirstOfType(arguments, "object", 0, 0);
			var whereString = whereObj ? db.where(whereObj) : <string> u.getFirstOfType(arguments, "string", 0, 0);
			var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";

			var offset = <number> u.getFirstOfType(arguments, "number", 0, 0);
			var limit = <number> u.getFirstOfType(arguments, "number", 0, 1);
			var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";

			var callback = <CB<##resultClassName##[]>> u.getFirstOfType(arguments, "function", 0, 0);
			var errorCallback = <ErrorCallback> u.getFirstOfType(arguments, "function", 0, 1);
			errorCallback = this.wrapErrorCallback(errorCallback, "##finderName##");

			var sql = "SELECT * FROM `##constraintForeignTable##` WHERE `##constraintForeignColumn##` = ? " + where + limits;
			sql = db.escape(sql, [this.##constraintColumn##]);
			db.fetchAll(sql, (rows) =>
			{
				for (var i = 0; i < rows.length; ++i)
				{
					rows[i].__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;
					rows[i].postLoad();
				}
				callback(rows);
			}, errorCallback);
		}

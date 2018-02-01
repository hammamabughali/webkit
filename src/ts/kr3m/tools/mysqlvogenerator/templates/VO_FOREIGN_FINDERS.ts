		public ##finderName##(##bonusParams##
			where:string|{[colName:string]:any},
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(##bonusParams##
			where:string|{[colName:string]:any},
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##(##bonusParams##
			where:string|{[colName:string]:any},
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(##bonusParams##
			where:string|{[colName:string]:any},
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##(##bonusParams##
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(##bonusParams##
			offset:number,
			limit:number,
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##(##bonusParams##
			callback:CB<##resultClassName##[]>,
			errorCallback:ErrorCallback):void;

		public ##finderName##(##bonusParams##
			callback:CB<##resultClassName##[]>):void;

		public ##finderName##():void
		{
			var u = kr3m.util.Util;
			##bonusOverloads##
			var whereObj = <{[colName:string]:any}> u.getFirstOfType(arguments, "object", 0, 0);
			var whereString = whereObj ? db.where(whereObj) : <string> u.getFirstOfType(arguments, "string", 0, ##bonusParamsStringCount##);
			var where = whereString ? " AND (" + whereString.replace(/\bWHERE\b/i, "") + ") " : "";

			var offset = <number> u.getFirstOfType(arguments, "number", ##bonusOffset##, 0);
			var limit = <number> u.getFirstOfType(arguments, "number", ##bonusOffset##, 1);
			var limits = (offset !== undefined && limit !== undefined) ? db.escape(" LIMIT ?, ?", [offset, limit]) : "";

			var callback = <CB<##resultClassName##[]>> u.getFirstOfType(arguments, "function", ##bonusOffset##, 0);
			var errorCallback = <ErrorCallback> u.getFirstOfType(arguments, "function", ##bonusOffset##, 1);
			errorCallback = this.wrapErrorCallback(errorCallback, "##finderName##");

			var sql = "SELECT * FROM `##foreignConstraintTable##` WHERE ##foreignConstraintColumn## " + where + limits;
			sql = db.escape(sql, [this.##foreignConstraintForeignColumn##]);
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

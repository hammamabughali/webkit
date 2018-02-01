		public ##finderName##(
			##typedParams##,
			callback:CB<##className##[]>,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "finderName");
			var sql = "SELECT * FROM `##tableName##` WHERE `##keysSql##` = ?";
			sql = db.escape(sql, [##keysComma##]);
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

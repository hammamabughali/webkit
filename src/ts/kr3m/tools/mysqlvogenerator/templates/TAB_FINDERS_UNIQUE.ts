		public ##finderName##(
			##typedParams##,
			callback:CB<##className##>,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "##finderName##");
			var sql = "SELECT * FROM `##tableName##` WHERE `##keysSql##` = ? LIMIT 0,1";
			sql = db.escape(sql, [##keysComma##]);
			db.fetchRow(sql, (row) =>
			{
				if (!row)
					return callback(undefined);

				row.__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;
				row.postLoad();
				callback(row);
			}, errorCallback);
		}

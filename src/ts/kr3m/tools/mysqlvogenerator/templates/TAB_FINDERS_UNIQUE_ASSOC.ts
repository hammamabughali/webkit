		/*
			Function for loading several objects at once based on their
			unique ##keySingular##.

			A map is returned that contains all found objects with the
			unique ##keySingular## as a key.
		*/
		public ##finderName##(
			##typedParams##,
			callback:(vosBy##keyCapital##:{[##keySingular##:##keyType##]:##className##}) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "##finderName##");
			if (##keyPlural##.length == 0)
				return callback({});

			var sql = "SELECT * FROM `##tableName##` WHERE `##keySingular##` IN (?)";
			sql = db.escape(sql, [##keyPlural##]);
			db.fetchAll(sql, (rows) =>
			{
				for (var i = 0; i < rows.length; ++i)
				{
					rows[i].__proto__ = kr3m.util.Factory.getInstance().map(##className##).prototype;
					rows[i].postLoad();
				}
				callback(kr3m.util.Util.arrayToAssoc(rows, "##keySingular##"));
			}, errorCallback);
		}

		public ##finderName##(
			callback:CB<##resultClassName##>,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "##finderName##");
			var sql = "SELECT * FROM `##constraintForeignTable##` WHERE `##constraintForeignColumn##` = ? LIMIT 0,1";
			sql = db.escape(sql, [this.##constraintColumn##]);
			db.fetchRow(sql, (data) =>
			{
				if (!data)
					return callback(undefined);

				data.__proto__ = kr3m.util.Factory.getInstance().map(##resultClassName##).prototype;
				data.postLoad();
				callback(data);
			}, errorCallback);
		}

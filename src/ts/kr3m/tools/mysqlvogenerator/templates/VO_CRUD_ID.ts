		protected check##idNameCapital##(
			callback:(wasGenerated:boolean) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "check##idNameCapital##");
			if (this.##idName##)
				return callback(false);

			kr3m.async.Loop.loop((loopDone) =>
			{
				kr3m.util.Rand.getSecureString(##idLength##, null, (secureValue) =>
				{
					this.##idName## = secureValue;
					db.fetchOne(db.escape("SELECT ##idName## FROM ##tableName## WHERE ##idName## = ? LIMIT 0,1;", [this.##idName##]), dummy => loopDone(!!dummy), errorCallback);
				});
			}, () => callback(true));
		}



		public insert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insert");
			var retries = 3;
			kr3m.async.Loop.loop((loopDone) =>
			{
				this.check##idNameCapital##((wasGenerated) =>
				{
					this.preStore();
					db.insert("##tableName##", this, () =>
					{
						this.postStore();
						callback && callback();
					}, (errorMessage) =>
					{
						if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0)
						{
							if (errorCallback)
								return errorCallback(errorMessage);

							logError(errorMessage);
							return callback && callback();
						}

						logWarning(errorMessage);
						logWarning("retrying");
						--retries;
						loopDone(true);
					});
				});
			});
		}



		public upsert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
			var retries = 3;
			kr3m.async.Loop.loop((loopDone) =>
			{
				this.check##idNameCapital##((wasGenerated) =>
				{
					this.preStore();
					db.upsert("##tableName##", this, () =>
					{
						this.postStore();
						callback && callback();
					}, null, (errorMessage) =>
					{
						if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0)
						{
							if (errorCallback)
								return errorCallback(errorMessage);

							logError(errorMessage);
							return callback && callback();
						}

						logWarning(errorMessage);
						logWarning("retrying");
						--retries;
						loopDone(true);
					});
				});
			});
		}



		public update(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "update");
			this.preStore();
			db.update("##tableName##", this, () =>
			{
				this.postStore();
				callback && callback();
			}, "##idName##", errorCallback);
		}



		public delete(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "delete");
			var where = db.escape("##idName## = ?", [this.##idName##]);
			db.deleteBatch("##tableName##", where, callback, errorCallback);
		}

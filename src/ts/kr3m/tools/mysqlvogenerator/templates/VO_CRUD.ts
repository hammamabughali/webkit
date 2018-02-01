		public insert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insert");
			this.preStore();
			db.insert("##tableName##", this, () =>
			{
				this.postStore();
				callback && callback();
			}, errorCallback);
		}



		public upsert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
			this.preStore();
			db.upsert("##tableName##", this, () =>
			{
				this.postStore();
				callback && callback();
			}, null, errorCallback);
		}



		public update(
			whereKeys:string[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "update");
			this.preStore();
			db.update("##tableName##", this, () =>
			{
				this.postStore();
				callback && callback();
			}, whereKeys, errorCallback);
		}



		public delete(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "delete");
			db.deleteBatch("##tableName##", this, callback, errorCallback);
		}

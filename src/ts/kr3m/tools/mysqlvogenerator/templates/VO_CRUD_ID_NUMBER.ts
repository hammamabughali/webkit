		public insert(
			callback?:(inserted##idNameCapital##:##idType##) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insert");
			this.preStore();
			db.insert("##tableName##", this, (inserted##idNameCapital##:##idType##) =>
			{
				this.##idName## = inserted##idNameCapital##;
				this.postStore();
				callback && callback(inserted##idNameCapital##);
			}, errorCallback);
		}



		public upsert(
			callback?:(inserted##idNameCapital##:##idType##) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
			this.preStore();
			db.upsert("##tableName##", this, (inserted##idNameCapital##:##idType##) =>
			{
				this.##idName## = inserted##idNameCapital## || this.##idName##;
				this.postStore();
				callback && callback(inserted##idNameCapital##);
			}, null, errorCallback);
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

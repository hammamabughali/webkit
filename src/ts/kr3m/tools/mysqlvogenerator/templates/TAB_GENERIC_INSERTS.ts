		public upsertBatch(
			vos:##className##[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
			for (var i = 0; i < vos.length; ++i)
				vos[i].preStore();

			db.upsertBatch("##tableName##", vos, () =>
			{
				for (var i = 0; i < vos.length; ++i)
					vos[i].postStore();

				callback && callback();
			}, db.defaultBatchSize, null, errorCallback);
		}



		public insertBatch(
			vos:##className##[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
			for (var i = 0; i < vos.length; ++i)
				vos[i].preStore();

			db.insertBatch("##tableName##", vos, () =>
			{
				for (var i = 0; i < vos.length; ++i)
					vos[i].postStore();

				callback && callback();
			}, db.defaultBatchSize, errorCallback);
		}

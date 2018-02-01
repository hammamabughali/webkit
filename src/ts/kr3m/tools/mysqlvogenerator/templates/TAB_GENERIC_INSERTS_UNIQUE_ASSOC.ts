		public upsertBatch(
			vos:##className##[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsertBatch");
			vos = vos.slice();
			var no##capitalKey##Vos:##className##[] = [];
			for (var i = 0; i < vos.length; ++i)
			{
				if (!vos[i].##key##)
				{
					no##capitalKey##Vos.push(vos[i]);
					vos.splice(i--, 1);
				}
			}

			for (var i = 0; i < vos.length; ++i)
				vos[i].preStore();

			db.upsertBatch("##tableName##", vos, () =>
			{
				for (var i = 0; i < vos.length; ++i)
					vos[i].postStore();

				kr3m.async.Loop.forEach(no##capitalKey##Vos, (no##capitalKey##Vo, next) =>
				{
					no##capitalKey##Vo.upsert(next);
				}, () => callback && callback());
			}, db.defaultBatchSize, null, errorCallback);
		}



		public updateBatch(
			vos:##className##[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "updateBatch");
			for (var i = 0; i < vos.length; ++i)
			{
				if (!vos[i].##key##)
				{
					if (errorCallback)
						return errorCallback("some vos are missing their ##key## attribute in updateBatch call");

					throw new Error("some vos are missing their ##key## attribute in updateBatch call");
				}
			}

			for (var i = 0; i < vos.length; ++i)
				vos[i].preStore();

			db.updateBatch("##tableName##", vos, () =>
			{
				for (var i = 0; i < vos.length; ++i)
					vos[i].postStore();

				callback && callback();
			}, db.defaultBatchSize, "##key##", errorCallback);
		}



		public insertBatch(
			vos:##className##[],
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insertBatch");
			vos = vos.slice();
			var no##capitalKey##Vos:##className##[] = [];
			for (var i = 0; i < vos.length; ++i)
			{
				if (!vos[i].##key##)
				{
					no##capitalKey##Vos.push(vos[i]);
					vos.splice(i--, 1);
				}
			}

			for (var i = 0; i < vos.length; ++i)
				vos[i].preStore();

			db.insertBatch("##tableName##", vos, () =>
			{
				for (var i = 0; i < vos.length; ++i)
					vos[i].postStore();

				kr3m.async.Loop.forEach(no##capitalKey##Vos, (no##capitalKey##Vo, next) =>
				{
					no##capitalKey##Vo.insert(next);
				}, () => callback && callback());
			}, db.defaultBatchSize, errorCallback);
		}

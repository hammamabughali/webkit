		/*
			Handles Dojo requests and returns a matching object.

			The WHERE statement can be extended using conditions
			and escapeArgs.
		*/
		public getDojo(
			params:any,
			callback:(forDojo:kr3m.dojo.GridQueryResponse<##className##>) => void,
			conditions:string[] = [],
			escapeArgs:any[] = [],
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "getDojo");
			var columnNames = this.getColumnNames();

			var offset = params.start || 0;
			var limit = params.count || 20;
			var sort = params.sort || "##key##";

			for (var i = 0; i < columnNames.length; ++i)
			{
				if (params.hasOwnProperty(columnNames[i]) && params[columnNames[i]])
				{
					conditions.push("`" + columnNames[i] + "` = ?");
					escapeArgs.push(params[columnNames[i]]);
				}
			}
			var where = db.escape(conditions.join(" AND "), escapeArgs);
			if (where == "")
				where = "1";

			var ordering = [];
			if (sort.substring(0, 1) == "-")
				ordering.push(sort, "ASC");
			else
				ordering.push(sort, "DESC");

			this.getCount(where, (count:number) =>
			{
				this.get(where, offset, limit, ordering, (vos:any) => callback(new kr3m.dojo.GridQueryResponse<##className##>(vos, "##key##", count, "##key##", sort)), errorCallback);
			}, errorCallback);
		}

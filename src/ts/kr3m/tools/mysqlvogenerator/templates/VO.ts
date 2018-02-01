		public static isColumnName(name:string):boolean
		{
			return (##copyFields##).indexOf(name) >= 0;
		}



		public static getColumnNames():string[]
		{
			return ##copyFields##;
		}



		/*
			Builds a proper ##resultClassName## class object from
			a POD / JSON object.

			If this is not possible, because some required attributes
			are missing for example, null will be returned.
		*/
		public static buildFrom(raw:any):##resultClassName##
		{
			var helper = new kr3m.services.ParamsHelper(raw);
			if (!helper.validate(##validateObject##, ##validateFallbacks##))
				return null;

			var foreignKeyNames = ##foreignKeyNames##;
			var vo = new ##resultClassName##();
			var copyFields = ##copyFields##;
			for (var i = 0; i < copyFields.length; ++i)
			{
				vo[copyFields[i]] = raw[copyFields[i]];
				if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
					vo[copyFields[i]] = null;
			}
			return vo;
		}



		public constructor(rawData?:any)
		{
			if (rawData)
			{
				for (var i in rawData)
				{
					if (##resultClassName##.isColumnName(i))
						this[i] = rawData[i];
				}
			}
		}



		private wrapErrorCallback(
			errorCallback:ErrorCallback,
			functionName:string):ErrorCallback
		{
			if (!errorCallback)
				return errorCallback;

			var newCallback = (errorMessage) =>
			{
				errorCallback("##resultClassName##." + functionName + " - " + errorMessage);
			}
			return newCallback;
		}

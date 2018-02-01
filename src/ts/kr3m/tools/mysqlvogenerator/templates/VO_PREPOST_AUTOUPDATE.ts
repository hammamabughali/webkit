		/*
			Will be called after the class was created and filled
			with content from the database.
		*/
		public postLoad():void
		{
			var autoUpdateFields = ##autoUpdateFields##;
			var oldValues:{[field:string]:Date} = {};
			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				oldValues[field] = this[field];
			}
			Object.defineProperty(this, "__oldAutoUpdateFieldValues", {value : oldValues, enumerable : false});
		}



		/*
			Will be called before the class' content will be
			written into the database.
		*/
		public preStore():void
		{
			var autoUpdateFields = ##autoUpdateFields##;

			if (!this["__oldAutoUpdateFieldValues"])
				Object.defineProperty(this, "__oldAutoUpdateFieldValues", {value : {}, enumerable : false});

			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				if (this[field] == this["__oldAutoUpdateFieldValues"][field])
					delete this[field];
				else
					this["__oldAutoUpdateFieldValues"][field] = this[field];
			}
		}



		/*
			Will be called after the class' content was
			written into the database.
		*/
		public postStore():void
		{
			var autoUpdateFields = ##autoUpdateFields##;
			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				this[field] = this["__oldAutoUpdateFieldValues"][field];
			}
		}

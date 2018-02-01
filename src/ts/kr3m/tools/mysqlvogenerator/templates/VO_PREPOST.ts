		/*
			Will be called after the class was created and filled
			with content from the database.
		*/
		public postLoad():void
		{
			// can be overwritten in derived classes
		}



		/*
			Will be called before the class' content will be
			written into the database.
		*/
		public preStore():void
		{
			// can be overwritten in derived classes
		}



		/*
			Will be called after the class' content was
			written into the database.
		*/
		public postStore():void
		{
			// can be overwritten in derived classes
		}

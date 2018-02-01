//# EXPERIMENTAL
module cas.async
{
	export class Promise
	{
		private value:any;
		private error:Error;

		private next:Promise;

		private thenFunc:(value:any) => any;
		private errorFunc:(error:Error) => void;



		private chain():void
		{
			if (this.error)
			{
				if (this.errorFunc)
					this.errorFunc(this.error);
				else if (this.next)
					this.next.throwError(this.error);
				return;
			}

			if (this.value)
			{
				if (this.thenFunc)
				{
					try
					{
						var thenReturn = this.thenFunc(this.value);
					}
					catch(e)
					{
						this.throwError(e);
						return;
					}

					if (thenReturn instanceof Promise && this.next)
					{
						var p = <Promise> thenReturn;
						p.next = this.next;
						p.chain();
					}
				}
				else if (this.next)
				{
					this.next.setValue(this.value);
				}
				return;
			}
		}



		public setValue(value:any):void
		{
			if (this.value || this.error)
				return;

			this.value = value;
			this.chain();
		}



		public throwError(error:Error):void
		{
			this.error = error;
			this.value = null;
			this.chain();
		}



		public setCallbacks(
			thenFunc:(value:any) => any,
			errorFunc:(error:Error) => void):Promise
		{
			this.next = new Promise();
			this.next.thenFunc = thenFunc;
			this.next.errorFunc = errorFunc;
			this.next.chain();
			return this.next;
		}



		public then(thenFunc:(value:any) => any):Promise
		{
			return this.setCallbacks(thenFunc, null);
		}



		public catch(errorFunc:(error:Error) => void):Promise
		{
			return this.setCallbacks(null, errorFunc);
		}
	}
}
//# /EXPERIMENTAL

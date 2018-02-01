/// <reference path="../constants.ts"/>



module kr3m.services
{
	export class CallbackResult<T = any>
	{
		public success:boolean;
		public status:string;
		public data:T;

		public feedback:any;



		constructor(status:string, data?:T)
		{
			this.status = status;
			this.success = this.status == kr3m.SUCCESS;
			this.data = data;
		}
	}
}

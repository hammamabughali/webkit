/// <reference path="../util/ajax.ts"/>



module kr3m.loading
{
	export class LoadRequest
	{
		public static PENDING = "PENDING";
		public static LOADING = "LOADING";
		public static COMPLETE = "COMPLETE";
		public static FAILED = "FAILED";

		public url:string;
		public status:string = LoadRequest.PENDING;
		public callback:(data:any) => void;
		public errorCallback:(requestStatus:number) => void;
		public data:any;



		constructor(url:string, callback:(data:any) => void, errorCallback:(requestStatus:number) => void = null)
		{
			this.url = url;
			this.callback = callback;
			this.errorCallback = errorCallback;
		}



		public load(callback:(request:LoadRequest) => void):void
		{
			this.status = LoadRequest.LOADING;
			var type = kr3m.util.Ajax.getTypeFromUrl(this.url) || "json";
			if (type == "image")
			{
				this.data = new Image();
				this.data.onload = () =>
				{
					this.status = LoadRequest.COMPLETE;
					callback(this);
				};
				this.data.src = this.url;
			}
			else
			{
				kr3m.util.Ajax.call(this.url, (data:any) =>
				{
					this.status = LoadRequest.COMPLETE;
					this.data = data;
					callback(this);
				}, null, this.errorCallback);
			}
		}
	}
}

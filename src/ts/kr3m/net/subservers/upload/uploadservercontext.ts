/// <reference path="../../../net/requestcontext.ts"/>
/// <reference path="../../../net/subservers/upload/uploaddata.ts"/>



module kr3m.net.subservers.upload
{
	export class UploadServerContext
	{
		public requestContext:kr3m.net.RequestContext;
		public uploadData:UploadData;



		constructor(requestContext:kr3m.net.RequestContext)
		{
			this.requestContext = requestContext;
			this.uploadData = new UploadData(this.requestContext.uri);
		}
	}
}

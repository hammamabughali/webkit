/// <reference path="../../../net/subservers/upload/uploadresultfile.ts"/>



module kr3m.net.subservers.upload
{
	export class UploadResult
	{
		public uploadId:string;
		public status:string;
		public files:UploadResultFile[] = [];



//# SERVER
		constructor(uploadId:string, status:string)
		{
			this.uploadId = uploadId;
			this.status = status;
		}
//# /SERVER
	}
}

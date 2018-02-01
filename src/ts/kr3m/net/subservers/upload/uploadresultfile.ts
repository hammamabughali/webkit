//# SERVER
/// <reference path="../../../net/subservers/upload/uploaddatafile.ts"/>
//# /SERVER



module kr3m.net.subservers.upload
{
	export class UploadResultFile
	{
		public fileName:string;
		public size:number;
		public mimeType:string;
		public url:string;



//# SERVER
		constructor(file:UploadDataFile)
		{
			this.fileName = file.fileName;
			this.size = file.data.length;
			this.mimeType = file.mimeType;
			this.url = file.url;
		}
//# /SERVER
	}
}

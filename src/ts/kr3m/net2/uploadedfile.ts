/// <reference path="../types.ts"/>



module kr3m.net2
{
	export class UploadedFile
	{
		fileName:string;
		inputName:string;
		mimeType:string;
		data:Buffer;



		public saveAs(
			filePath:string,
			callback?:SuccessCallback):void
		{
			fsLib.writeFile(filePath, this.data, (err:Error) => callback && callback(!err));
		}



		public saveIn(
			directoryPath:string,
			callback?:SuccessCallback):void
		{
			var filePath = directoryPath + "/" + this.fileName;
			filePath = filePath.replace(/[\/\\]+/g, "/");
			fsLib.writeFile(filePath, this.data, (err:Error) => callback && callback(!err));
		}
	}
}

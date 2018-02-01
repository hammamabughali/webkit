module kr3m.util
{
	export class ClientFile
	{
		private originalFile:File;

		public name:string;
		public lastModified:Date;
		public size:number;
		public mimeType:string;

		private textContent:string;
		private dataUrl:string;



		constructor(file:File, mimeType?:string)
		{
			this.originalFile = file;

			this.name = file.name;
			this.lastModified = file.lastModifiedDate;
			this.size = file.size;
			this.mimeType = mimeType || file.type;
		}



		public getDataUrl(
			callback:(dataUrl:string) => void):void
		{
			if (this.dataUrl)
				return callback(this.dataUrl);

			var reader = new FileReader();
			reader.onload = (evt:any) =>
			{
				this.dataUrl = evt.target.result;
				callback(this.dataUrl);
			};
			reader.readAsDataURL(this.originalFile);
		}



		public getTextContent(
			callback:(content:string) => void):void
		{
			if (this.textContent)
				return callback(this.textContent);

			var reader = new FileReader();
			reader.onload = (evt:any) =>
			{
				this.textContent = evt.target.result;
				callback(this.textContent);
			};
			reader.readAsText(this.originalFile, "UTF-8");
		}
	}
}

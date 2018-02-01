/// <reference path="../../ui/element.ts"/>
/// <reference path="../../ui/image.ts"/>
/// <reference path="../../ui/textbox.ts"/>
/// <reference path="../../ui/upload.ts"/>



module kr3m.ui.ex
{
	/*
		Zeigt ein Bild von einer URL an. Durch Klick auf
		das Bild kann man ein anderes Bild hochladen,
		welches das angezeigte Bild dann ersetzt.
	*/
	export class UploadableImage extends kr3m.ui.Element
	{
		protected upload:kr3m.ui.Upload;
		protected image:kr3m.ui.Image;
		protected errorMessage:kr3m.ui.Textbox;



		constructor(
			parent:kr3m.ui.Element, uploadUrl:string,
			src:string = "", className:string = "", attributes:any = {}, sizeLimit:number = 2000000)
		{
			attributes["tab-index"] = attributes["tab-index"] || "0";
			super(parent, null, "div", attributes);
			this.addClass("profileImage");

			this.upload = new kr3m.ui.Upload(this, uploadUrl, sizeLimit, "image/*", false);
			this.upload.onUploadStarted(this.onUploadStarted.bind(this));
			this.upload.onUploaded(this.onUploaded.bind(this));

			this.image = new kr3m.ui.Image(this.upload, src);
			this.image.css("cursor", "pointer");

			this.errorMessage = new kr3m.ui.Textbox(this, "", "errorMessage");
		}



		public getImageUrl():string
		{
			return this.image.getUrl();
		}



		private onUploadStarted():void
		{
			this.errorMessage.setText(kr3m.util.Localization.get("UPLOAD_STARTED"));
		}



		private onUploaded(
			status:string,
			file:kr3m.net.subservers.upload.UploadResultFile):void
		{
			if (status == kr3m.SUCCESS)
			{
				this.image.setUrl(file.url);
				this.errorMessage.setText("");
			}
			else
			{
				this.errorMessage.setText(kr3m.util.Localization.get(status));
			}
		}



		public setParam(name:string, value:any):void
		{
			this.upload.setParam(name, value);
		}



		public setAccept(accept:string):void
		{
			this.upload.setAccept(accept);
		}



		public setImageUrl(url:string):void
		{
			this.image.setUrl(url);
		}
	}
}

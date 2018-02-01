/// <reference path="../net/subservers/upload/uploadresult.ts"/>
/// <reference path="../ui/element.ts"/>
/// <reference path="../ui/iframe.ts"/>
/// <reference path="../util/browser.ts"/>
/// <reference path="../util/trysafe.ts"/>



module kr3m.ui
{
	/*
		Ein Element zum Hochladen von Dateien zum Server. Es wird als
		das Standardupload-Element des Browsers angezeigt, außer es wird
		noch ein Element an das Upload-Element angehängt. In diesem Fall
		wird das Upload-Element selbst ausgeblendet und das angehängte
		Child-Elemente löst den Upload aus. Parameter, die beim Upload
		einer Datei mit an den Server geschickt werden sollen, können
		über setParam gesetzt werden.
	*/
	export class Upload extends kr3m.ui.Element
	{
		private static freeUploadId = 0;
		private static uploadElementsById:any = {};

		private paramInputs:any = {};
		private fileInput:kr3m.ui.Element;

		private target:string;
		private accept:string;
		private multiple:boolean;
		private sizeLimit:number;

		private uploadStartListeners:Callback[] = [];
		private uploadListeners:Array<(status:string, file:kr3m.net.subservers.upload.UploadResultFile) => void> = [];



		/*
			@param parent Das Objekt, an welches sich dieses Upload-Objekt
				anhängen soll. Im Normalfall eine Instanz von
				kr3m.ui.Element oder kr3m.app.Application
			@param uploadUrl Die Url, an der die Dateien hochgeladen werden
				sollen - das .php Skript, das die Dateien entgegen nimmt
				oder die uri des UploadServers
			@param sizeLimit Wird hier ein Wert größer als 0 eingetragen,
				werden Dateien die größer sind als dieser Wert (in Bytes)
				nicht akzeptiert.
			@param accept Das accept-Attribut eines normalen
				HTML-Upload-Eingabefeldes. Entweder ein Mime-Typ (inklusive
				Joker) oder mehrere, mit Komma getrennt. Wird der Parameter
				auf null gesetzt, werden alle Dateitypen akzeptiert. Ein
				paar Beispiele für akzeptable accept Parameter: "image/png",
				"image/*", "image/jpeg,image/png" oder "text/javascript".
			@param multiple Ist dieser Wert auf true können mehrere Dateien
				gleichzeitig hochgeladen werden. Ansonsten immer nur eine.
		*/
		constructor(
			parent:any,
			uploadUrl:string,
			sizeLimit = 2000000,
			accept?:string,
			multiple = false)
		{
			super(parent, null, "form", {action : uploadUrl, method : "POST", enctype : "multipart/form-data", onsubmit : "return false;"});

			this.accept = accept;
			this.multiple = multiple;
			this.sizeLimit = sizeLimit;

			this.setParam("_uploadId", kr3m.ui.Upload.freeUploadId++);
		}



		public setAccept(accept:string):void
		{
			this.accept = accept;
		}



		public onAddedToStage():void
		{
			super.onAddedToStage();

			if (!this.target)
			{
				this.target = kr3m.ui.Element.getFreeId();
				var targetFrame = new kr3m.ui.IFrame(this.parent, "", {name:this.target});
				targetFrame.hide();
			}

			this.setAttribute("target", this.target);

			var id = kr3m.ui.Element.getFreeId();
			this.fileInput = new kr3m.ui.Element(this, null, "input", {name:id, id:id, type:"file"});
			if (this.accept)
				this.fileInput.setAttribute("accept", this.accept);

			this.fileInput.on("change", this.onFileChanged.bind(this));
		}



		public onUploadStarted(listener:Callback):void
		{
			this.uploadStartListeners.push(listener);
		}



		public onUploaded(listener:(status:string, file:kr3m.net.subservers.upload.UploadResultFile) => void):void
		{
			var uploadId = this.getParam("_uploadId");
			if (!kr3m.ui.Upload.uploadElementsById[uploadId])
				kr3m.ui.Upload.uploadElementsById[uploadId] = this;

			this.uploadListeners.push(listener);
		}



		public static uploadCallback(
			result:kr3m.net.subservers.upload.UploadResult):void
		{
			for (var i = 0; i < result.files.length; ++i)
			{
				var upload = <kr3m.ui.Upload>kr3m.ui.Upload.uploadElementsById[result.uploadId];
				if (upload)
					upload.onFileUploaded(result.status, result.files[i]);
			}
		}



		private onFileUploaded(
			status:string,
			result?:kr3m.net.subservers.upload.UploadResultFile):void
		{
			this.fileInput.dom.val("");
			for (var i = 0; i < this.uploadListeners.length; ++i)
				trySafe(this.uploadListeners[i], status, result);
		}



		private onFileChanged():void
		{
			var files = <FileList> this.fileInput.dom.get(0).files;
			if (files)
			{
				if (files.length < 1)
					return;

				for (var i = 0; i < this.uploadStartListeners.length; ++i)
					this.uploadStartListeners[i]();

				if (!this.multiple && files.length > 1)
					return this.onFileUploaded(kr3m.ERROR_UPLOAD_COUNT);

				if (this.accept)
				{
					var parts = this.accept.split(",");
					var pats:RegExp[] = [];
					for (var i = 0; i < parts.length; ++i)
						pats.push(new RegExp(parts[i].replace(/\*/g, "\\w+").replace(/\//g, "\\/"), "i"));

					for (var i = 0; i < files.length; ++i)
					{
						var isOk = false;
						for (var j = 0; j < pats.length; ++j)
						{
							if (pats[j].test(files[i].type))
							{
								isOk = true;
								break;
							}
						}
						if (!isOk)
							return this.onFileUploaded(kr3m.ERROR_UPLOAD_TYPE);
					}
				}

				if (this.sizeLimit > 0)
				{
					for (var i = 0; i < files.length; ++i)
					{
						if (files[i].size > this.sizeLimit)
							return this.onFileUploaded(kr3m.ERROR_UPLOAD_SIZE);
					}
				}
			}
			this.dom.get(0).submit();
		}



		public setParam(name:string, value:any):void
		{
			if (typeof this.paramInputs[name] != "undefined")
				this.paramInputs[name].setAttribute("value", value);
			else
				this.paramInputs[name] = new kr3m.ui.Element(this, null, "input", {type:"hidden", name:name, value:value});
		}



		public getParam(name:string):any
		{
			var ele = this.paramInputs[name];
			return ele ? ele.getAttribute("value") : null;
		}



		private isOverlay(child:kr3m.ui.Element):boolean
		{
			if (child.getTag() == "LABEL")
				return false;
			if (child.getTag() == "INPUT"
				&& (child.getAttribute("type") == "hidden"
				|| child.getAttribute("type") == "file"))
				return false;
			return true;
		}



		protected handleOverlayClick():void
		{
			this.fileInput.click();
		}



		public addChild(child:kr3m.ui.Element):void
		{
			if (this.isOverlay(child))
			{
//# IE8
				if (!kr3m.util.Browser.isOldBrowser() && !kr3m.util.Browser.isSafari())
				{
//# /IE8
					super.addChild(child);
					child.dom.on("click", (jqEvent:JQueryEventObject) => this.handleOverlayClick());
					if (this.fileInput)
						this.fileInput.hide();
//# IE8
				}
				else
				{
					//# TODO: addChild NYI für ätzende Browser
				}
//# /IE8
			}
			else
			{
				super.addChild(child);
			}
		}



		public removeChild(child:kr3m.ui.Element):void
		{
			if (this.isOverlay(child))
			{
//# IE8
				if (!kr3m.util.Browser.isOldBrowser() && !kr3m.util.Browser.isSafari())
				{
//# /IE8
					child.dom.off("click");
//# IE8
				}
				else
				{
					//# TODO: removeChild NYI für ätzende Browser
				}
//# /IE8
			}

			super.removeChild(child);

			for (var i = 0; i < this.children.length; ++i)
			{
				if (this.isOverlay(this.children[i]))
					return;
			}
			this.fileInput.show();
		}
	}
}

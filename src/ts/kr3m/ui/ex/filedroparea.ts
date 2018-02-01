/// <reference path="../../net/mimetypes.ts"/>
/// <reference path="../../ui/element.ts"/>
/// <reference path="../../util/clientfile.ts"/>



module kr3m.ui.ex
{
	export class FileDropArea extends kr3m.ui.Element
	{
		public static isSupported():boolean
		{
			return !!(window["File"] && window["FileReader"] && window["FileList"] && window["Blob"]);
		}



		private dropListeners:Array<(files:kr3m.util.ClientFile[]) => void> = [];
		private acceptPattern = /^.+$/;
		private sizeLimit = 1024 * 1024;



		constructor(
			parent:kr3m.ui.Element, className:string = "", attributes:any = {})
		{
			super(parent, null, "div", attributes);
			if (className)
				this.addClass(className);

			this.on("dragover", this.handleDragOver.bind(this));
			this.on("drop", this.handleDrop.bind(this));
		}



		public accept(filter:string):void
		{
			filter = "^" + filter.replace(/\*/g, ".+") + "$";
			this.acceptPattern = new RegExp(filter);
		}



		public setSizeLimit(limit:number):void
		{
			this.sizeLimit = limit;
		}



		public onDrop(listener:(files:kr3m.util.ClientFile[]) => void):void
		{
			this.dropListeners.push(listener);
		}



		private handleDragOver(evt:JQueryEventObject):void
		{
			evt.stopPropagation();
			evt.preventDefault();
			evt.originalEvent["dataTransfer"].dropEffect = "copy";
		}



		private handleDrop(evt:JQueryEventObject):void
		{
			evt.stopPropagation();
			evt.preventDefault();

			var droppedFiles:kr3m.util.ClientFile[] = [];
			var files = <FileList> evt.originalEvent["dataTransfer"].files;

			for (var i = 0; i < files.length; ++i)
			{
				if (this.sizeLimit && this.sizeLimit < files[i].size)
					continue;

				var mimeType = files[i].type || kr3m.net.MimeTypes.getMimeTypeByUrl(files[i].name);
				if (!this.acceptPattern.test(mimeType))
					continue;

				droppedFiles.push(new kr3m.util.ClientFile(files[i], mimeType));
			}

			if (droppedFiles.length == 0)
				return;

			for (var i = 0; i < this.dropListeners.length; ++i)
				this.dropListeners[i](droppedFiles);
		}
	}
}

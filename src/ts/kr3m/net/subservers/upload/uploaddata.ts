/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/subservers/upload/uploaddatafile.ts"/>
/// <reference path="../../../util/binary.ts"/>
/// <reference path="../../../util/file.ts"/>



module kr3m.net.subservers.upload
{
	/*
		Diese Klasse enthält alle Informationen, die bei einem
		Datei-Upload anfallen.
	*/
	export class UploadData
	{
		public requestUri:string;
		public files:kr3m.net.subservers.upload.UploadDataFile[] = [];
		public params:any = {};



		constructor(uri:string = null)
		{
			this.requestUri = uri;
		}



		public addPart(messagePart:NodeBuffer):void
		{
			var httpHeaders:any = {};
			var lineSeperator:NodeBuffer = new Buffer("\r\n");
			var valueSeperator:NodeBuffer = new Buffer(":");
			var offset = 0;
			var data:NodeBuffer = null;
			while (true)
			{
				var line = kr3m.util.Binary.getNextSplitPart(messagePart, lineSeperator, offset);
				if (!line)
					break;

				offset += line.length + lineSeperator.length;
				var parts = kr3m.util.Binary.split(line, valueSeperator);
				if (parts && parts.length >= 2)
				{
					var field = parts[0].toString();
					var value = "";
					for (var i = 1; i < parts.length; ++i)
						value += parts[i].toString();
					httpHeaders[field] = value.trim();
				}
				else
				{
					data = messagePart.slice(offset);
					break;
				}
			}

			if (typeof httpHeaders["Content-Disposition"] != "undefined")
			{
				var cd:string = httpHeaders["Content-Disposition"];
				var inputName:string = cd.match(/name="([^"]*)"/)[1];
				var matchesFile = cd.match(/filename="([^"]*)"/);
				if (matchesFile)
				{
					var file = new kr3m.net.subservers.upload.UploadDataFile();
					file.fileName = kr3m.util.File.getFilenameFromPath(matchesFile[1]);
					file.inputName = inputName;
					file.data = data;
					file.mimeType = httpHeaders["Content-Type"];
					this.files.push(file);
				}
				else
				{
					this.params[inputName] = data.toString("utf8");
				}
			}
		}
	}
}

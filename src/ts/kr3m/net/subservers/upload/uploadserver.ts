/// <reference path="../../../async/loop.ts"/>
/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/subserver2.ts"/>
/// <reference path="../../../net/subservers/upload/uploaddata.ts"/>
/// <reference path="../../../net/subservers/upload/uploadresult.ts"/>
/// <reference path="../../../net/subservers/upload/uploadservercontext.ts"/>
/// <reference path="../../../types.ts"/>
/// <reference path="../../../util/binary.ts"/>
/// <reference path="../../../util/json.ts"/>
/// <reference path="../../../util/url.ts"/>
/// <reference path="../../../util/validator.ts"/>



module kr3m.net.subservers.upload
{
	/*
		Dieser Server stellt eine Art Gateway für Dateiuploads
		dar. Immer wenn eine Datei hochgeladen wird, ruft er die
		beim Konstuktor übergebene callback Funktion mit entsprechenden
		Parametern auf.
	*/
	export class UploadServer extends kr3m.net.SubServer2
	{
		private callback:(uploadContext:UploadServerContext, callback:StatusCallback) => void;

		public fileSizeLimit = 0; // die maximale Größe von hochgeladenen Dateien (in Bytes) - Dateien, die größer sind, werden abgelehnt. 0 bedeutet "keine Beschränkung"



		constructor(
			callback:(uploadContext:UploadServerContext, callback:StatusCallback) => void)
		{
			super();
			this.callback = callback;
		}



		protected buildResult(
			status:string,
			uploadContext:UploadServerContext):UploadResult
		{
			var result = new UploadResult(uploadContext.uploadData.params["_uploadId"], status);
			for (var i = 0; i < uploadContext.uploadData.files.length; ++i)
			{
				if (!uploadContext.uploadData.files[i].url)
					uploadContext.uploadData.files[i].url = uploadContext.uploadData.files[i].fileName + "?_=" + Date.now();

				var file = new UploadResultFile(uploadContext.uploadData.files[i]);
				result.files.push(file);
			}
			return result;
		}



		protected sendReply(
			status:string,
			uploadContext:UploadServerContext):void
		{
			var result = this.buildResult(status, uploadContext);
			var reply = "<html><head><meta charset='utf-8'></head><body><script>if (parent.window) parent.window.kr3m.ui.Upload.uploadCallback("
			reply += kr3m.util.Json.encode(result);
			reply += ");</script></body></html>";
			uploadContext.requestContext.setResponseContent(reply, "text/html");
			uploadContext.requestContext.flushResponse(200);
		}



		private parseMultipartContent(
			boundary:string,
			buffer:NodeBuffer,
			uploadContext:UploadServerContext):void
		{
			var seperator = new Buffer("--" + boundary);
			var parts:NodeBuffer[] = kr3m.util.Binary.split(buffer, seperator);
			for (var i = 0; i < parts.length; ++i)
			{
				if (parts[i][0] != 45 || parts[i][1] != 45)
				{
					if (i < parts.length - 1)
						uploadContext.uploadData.addPart(parts[i].slice(2, parts[i].length - 2));
					else
						uploadContext.uploadData.addPart(parts[i].slice(2));
				}
			}
			this.callback(uploadContext, (status) =>
			{
				this.sendReply(status, uploadContext);
			});
		}



		public needsSession(
			context:kr3m.net.RequestContext,
			callback:BooleanCallback):void
		{
			callback(false);
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:BooleanCallback):void
		{
			var uploadContext = new UploadServerContext(context);
			if (typeof context.request.headers["content-length"] != "undefined")
			{
				var boundary = context.request.headers["content-type"].match(/multipart\/form\-data; boundary=(\S+)/);
				if (!boundary)
				{
					this.sendReply(kr3m.ERROR_INTERNAL, uploadContext);
					return;
				}

				var abort = false;

				boundary = boundary[1];
				var buffer:NodeBuffer = null;
				context.request.on("data", (data:NodeBuffer) =>
				{
					if (abort)
						return;

					if (buffer)
						buffer = Buffer.concat([buffer, data]);
					else
						buffer = data;

					if (this.fileSizeLimit > 0 && buffer.length > this.fileSizeLimit)
					{
						abort = true;
						this.sendReply(kr3m.ERROR_UPLOAD_SIZE, uploadContext);
					}
				});
				context.request.on("end", () =>
				{
					if (!abort)
						this.parseMultipartContent(boundary, buffer, uploadContext);
				});
			}
			else
			{
				this.sendReply(kr3m.ERROR_EMPTY_DATA, uploadContext);
			}
			callback(true);
		}
	}
}

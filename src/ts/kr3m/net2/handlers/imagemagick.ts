/// <reference path="../../images/imagemagick.ts"/>
/// <reference path="../../net2/handlers/filesystem.ts"/>
/// <reference path="../../util/file.ts"/>



module kr3m.net2.handlers
{
	export class ImageMagick extends FileSystem
	{
		private imageCache:{[hash:string]:{data:Buffer, lastAccess:number, accessCount:number}} = {};



		constructor(
			uriPattern = /\.(?:jpg|jpeg|bmp|png)$/i)
		{
			super(uriPattern);
		}



		protected getQueryHash(context:Context):string
		{
			var resource = this.getResourceRealpath(context);
			var query = context.request.getQueryValues();

			if (/^\d+x\d+$/i.test(query["fit"]))
				return resource + "?fit=" + query["fit"];

			if (/^\d+x\d+$/i.test(query["scale"]))
				return resource + "?scale=" + query["scale"];

			return "";
		}



		protected deliverResource(
			context:Context):void
		{
			var realPath = this.getResourceRealpath(context);
			var contentType = kr3m.net.MimeTypes.getMimeTypeByFileName(realPath);
			if (!kr3m.net.MimeTypes.isImageType(contentType))
				return context.flush(500);

			var hash = this.getQueryHash(context);
			if (!hash)
				return super.deliverResource(context);

			var cache = this.imageCache[hash];
			if (cache)
			{
				++cache.accessCount;
				cache.lastAccess = Date.now();
				return context.flush(200, cache.data, contentType);
			}

			var magic = new kr3m.images.ImageMagick();
			magic.image(realPath);

			var fitMatch = hash.match(/\?fit=(\d+)x(\d+)/);
			if (fitMatch)
				magic.adjustToFit(parseFloat(fitMatch[1]), parseFloat(fitMatch[2]));

			var scaleMatch = hash.match(/\?scale=(\d+)x(\d+)/);
			if (scaleMatch)
				magic.scale(parseFloat(scaleMatch[1]), parseFloat(scaleMatch[2]));

			kr3m.util.File.getTempFilePath((tempPath) =>
			{
				magic.flush(tempPath, (success) =>
				{
					if (!success)
						return context.flush(500);

					fsLib.readFile(tempPath, (err:Error, data:Buffer) =>
					{
						if (err)
						{
							fsLib.unlink(tempPath);
							return context.flush(500);
						}

						var cache =
						{
							data : data,
							accessCount : 1,
							lastAccess : Date.now()
						};

						//# FIXME: reload images when image file changes in the file system

						this.imageCache[hash] = cache;
						context.flush(200, data, contentType);
						fsLib.unlink(tempPath);
					});
				});
			});
		}
	}
}

/// <reference path="../../async/switch.ts"/>
/// <reference path="../../constants.ts"/>
/// <reference path="../../images/imagemagick.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.tools.compress
{
	export class Compress
	{
		private compressPng(path:string, callback:Callback):void
		{
			log("  compressing png");
			var magic = new kr3m.images.ImageMagick();
			magic.image(path).usePalette().flush(path, () => callback());
		}



		public runWithParameters(
			params:any):void
		{
			if (params.values.length == 0)
			{
				logError("work folder path required");
				process.exit(1);
			}

			var workPath = params.values[0];
			log("working on folder", workPath);
			kr3m.util.File.crawlAsync(workPath, (relativePath, next, isFolder, absolutePath) =>
			{
				log("checking", relativePath);
				var ext = kr3m.util.File.getExtension(relativePath).slice(1);
				kr3m.async.Switch.byThen(ext,
				{
					png : (switchDone) => this.compressPng(workPath + "/" + relativePath, next)
				}, (switchDone) =>
				{
					log("  skipping");
					switchDone();
				}, next);
			}, {wantFiles : true, wantFolders : true, recursive : true}, () =>
			{
				log("done");
			});
		}



		public run():void
		{
			var params = kr3m.util.StringEx.getNamedArguments(process.argv.slice(2), {});
			this.runWithParameters(params);
		}
	}
}

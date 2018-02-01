/// <reference path="../../async/delayed.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../async/queue.ts"/>
/// <reference path="../../constants.ts"/>
/// <reference path="../../images/imagemagick.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/log.ts"/>
/// <reference path="../../util/stringex.ts"/>
/// <reference path="../../xml/parser.ts"/>



module kr3m.tools.appassetsgenerator
{
	export class Generator
	{
		private delay = new kr3m.async.Delayed();



		private createImages(
			configPath:string,
			sourceIcons:any[],
			targetIcons:any[],
			callback:Callback):void
		{
			if (sourceIcons.length == 0 || targetIcons.length == 0)
				return callback();

			var source = kr3m.util.File.resolvePath(configPath, sourceIcons[0]._attributes.src);
			log("source", source);

			kr3m.async.Loop.forEach(targetIcons, (targetIcon, next) =>
			{
				var target = kr3m.util.File.resolvePath(configPath, targetIcon._attributes.src);
				log("target", target);

				var width = targetIcon._attributes.width;
				var height = targetIcon._attributes.height;

				if (!width || !height)
				{
					log("skipping - no width / height attributes set");
					return next();
				}

				var magic = new kr3m.images.ImageMagick();
				magic.image(source).adjustToFit(width, height).flush(target, (success) =>
				{
					if (!success)
						log("creation failed");

					next();
				});
			}, callback);
		}



		public runWithParameters(
			params:any):void
		{
			if (params.values.length == 0)
			{
				logError("config.xml file path required");
				process.exit(1);
			}

			var configPath = params.values.shift();
			log("loading configuration from", configPath);
			kr3m.xml.parseLocalFile(configPath, (xml) =>
			{
				if (!xml)
					process.exit(2);

				log("creating icons");
				var sourceIcons = xml.icon.filter(icon => !icon._attributes.platform);
				var targetIcons = xml.icon.filter(icon => icon._attributes.platform);
				this.createImages(configPath, sourceIcons, targetIcons, () =>
				{
					log("done");
				});
			});
		}



		public run():void
		{
			var params = kr3m.util.StringEx.getNamedArguments(process.argv.slice(2), {});
			this.runWithParameters(params);
		}
	}
}

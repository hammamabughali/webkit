/// <reference path="../../cache/files/downloads.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net2/constants.ts"/>
/// <reference path="../../net2/handlers/abstract.ts"/>
/// <reference path="../../util/json.ts"/>



module kr3m.net2.handlers
{
	export class Relay extends Abstract
	{
		protected cache = kr3m.cache.files.Downloads.getInstance();



		constructor(
			uriPattern:RegExp = /^\/r\/\w+$/)
		{
			super(uriPattern);
		}



		protected extractOptions(
			context:Context,
			callback:(extractedOptions:any) => void):void
		{
			try
			{
				var decipher = cryptoLib.createDecipher("aes192", kr3m.net2.RELAY_PASSWORD);
				var uri = context.getCurrentUri();
				uri = uri.split("/").slice(-1).join("");
				var json = decipher.update(uri, "hex", "utf8") + decipher.final("utf8");
				var options = kr3m.util.Json.decode(json);
				if (!options || !options.url)
					return callback(undefined);

				callback(options);
			}
			catch(e)
			{
				logWarning("error while extracting relay uri", uri);
				logWarning(e);
				callback(undefined);
			}
		}



		public handle(context:Context):void
		{
			this.extractOptions(context, (options) =>
			{
				if (!options)
					return context.flush(404);

				this.cache.getNewerFile(options.url, options.cacheDuration || 0, (content, mimeType) =>
				{
					if (!content)
						return context.flush(404);

					context.flush(200, content, mimeType);
				});
			});
		}
	}
}

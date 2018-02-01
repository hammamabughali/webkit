/// <reference path="../../constants.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../tools/autoformatter/languages/css.ts"/>
/// <reference path="../../tools/autoformatter/languages/html.ts"/>
/// <reference path="../../tools/autoformatter/languages/javascript.ts"/>
/// <reference path="../../tools/autoformatter/languages/php.ts"/>
/// <reference path="../../tools/autoformatter/languages/typescript.ts"/>
/// <reference path="../../tools/autoformatter/parameters.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.tools.autoformatter
{
	export class AutoFormatter
	{
		private params:kr3m.tools.autoformatter.Parameters;



		private handle(path:string):void
		{
			var stats = fsLib.statSync(path);
			if (stats.isDirectory())
			{
				var files = fsLib.readdirSync(path);
				for (var i = 0; i < files.length; ++i)
					this.handle((path + "/" + files[i]).replace(/\/\/+/g, "/"));
			}
			else
			{
				for (var i = 0; i < kr3m.tools.autoformatter.languages.Language.languages.length; ++i)
				{
					var language = kr3m.tools.autoformatter.languages.Language.languages[i];
					if (language.filePattern.test(path))
					{
						if (!this.params.silent)
							log(path);

						var content = fsLib.readFileSync(path, {encoding : "utf-8"});
						var newContent = language.autoformat(content, path);
						if (content != newContent)
							fsLib.writeFileSync(path, newContent, {encoding : "utf-8"});
						break;
					}
				}
			}
		}



		public runWithParameters(params:kr3m.tools.autoformatter.Parameters):void
		{
			this.params = params;
			this.handle(params.rootPath);
		}



		public run():void
		{
			var params = new kr3m.tools.autoformatter.Parameters();
			this.runWithParameters(params);
		}
	}
}

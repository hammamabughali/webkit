/// <reference path="../../async/loop.ts"/>
/// <reference path="../../net2/handlers/serversidejavascript.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/tokenizer.ts"/>



module kr3m.net2.handlers
{
	/*
		Ein Erweiterung des ServerSideJavascript, welche die
		Möglichkeit bietet, <fragment> Tags im HTML-Code und
		fragment() Aufrufe im Javascriptcode zu verwenden und
		diese durch den Inhalt anderer HTML-Dateien ersetzt.
	*/
	export class Fragment extends ServerSideJavascript
	{
		protected fragmentInitScript:kr3m.javascript.Script;



		constructor(
			uriPattern:RegExp = /\.html$/i)
		{
			super(uriPattern);
			this.fragmentInitScript = new kr3m.javascript.Script("//# EMBED(embed/fragmentInit.js, jsonNoQuotes)");
		}



		protected createSandbox(
			context:kr3m.net2.Context,
			callback:(sandbox:kr3m.javascript.Sandbox) => void):void
		{
			super.createSandbox(context, (sandbox) =>
			{
				sandbox.run(this.fragmentInitScript);
				callback(sandbox);
			});
		}



		protected locateFragment(
			context:kr3m.net2.Context,
			subUri:string,
			fragmentPath:string,
			callback:(realPath:string) => void):void
		{
			var filePath = kr3m.util.File.resolvePath(context.documentRoot + subUri, fragmentPath);
			this.cache.fileExists(filePath, (exists) => callback(exists ? filePath : ""));
		}



		protected getFragment(
			context:kr3m.net2.Context,
			sandbox:kr3m.javascript.Sandbox,
			subUri:string,
			fragmentPath:string,
			attributes:{[name:string]:string},
			callback:(fragment:string) => void):void
		{
			var abort = (message:string) => callback("<div style='font-weight: bold; color: red;'>" + message + "</div>");
			this.locateFragment(context, subUri, fragmentPath, (realPath) =>
			{
				if (!realPath)
					return abort("fragment " + fragmentPath + " not found");

				this.cache.getTextFile(realPath, (fragment) =>
				{
					if (!fragment)
						return abort("fragment file " + realPath + " could not be loaded");

					fragment = tokenize(fragment, attributes);

					var newSubUri = kr3m.util.File.resolvePath(subUri, fragmentPath);
					this.processPart(context, sandbox, newSubUri, fragment, callback);
				});
			});
		}



		protected processPart(
			context:kr3m.net2.Context,
			sandbox:kr3m.javascript.Sandbox,
			subUri:string,
			subContent:string,
			callback:StringCallback):void
		{
			super.processPart(context, sandbox, subUri, subContent, (subContent) =>
			{
				var searchPattern = /<fragment([^>]*)>([\s\S]*?)<\/fragment>/gi;
				kr3m.async.Loop.loop((loopDone) =>
				{
					var matches = searchPattern.exec(subContent);
					if (!matches)
						return callback(subContent);

					var fragmentPath = matches[2];
					var rawAttributes = kr3m.util.StringEx.splitNoQuoted(matches[1].trim().replace(/\s+/g, " "), " ")
						.map((attribute) => ({name : attribute.replace(/\s*=.*$/, ""), value : attribute.replace(/^[^=]+=\s*["']?(.*?)["']?$/, "$1")}));
					var attributes = kr3m.util.Util.arrayToPairs(rawAttributes, "name", "value");

					this.getFragment(context, sandbox, subUri, fragmentPath, attributes, (fragment) =>
					{
						subContent = subContent.slice(0, matches.index) + fragment + subContent.slice(searchPattern.lastIndex);
						searchPattern.lastIndex = matches.index;
						loopDone();
					});
				});
			});
		}



		protected process(
			context:kr3m.net2.Context,
			content:string,
			callback:StringCallback):void
		{
			super.process(context, content, (processed) =>
			{
				if (!context.localization)
					return callback(processed);

				context.localization.parse(context, processed, {}, callback);
			});
		}
	}
}

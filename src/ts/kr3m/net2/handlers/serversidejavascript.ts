/// <reference path="../../async/if.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../javascript/sandbox.ts"/>
/// <reference path="../../javascript/script.ts"/>
/// <reference path="../../net2/handlers/serversidescripting.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/url.ts"/>

//# DEBUG
/// <reference path="../../util/tokenizer.ts"/>
//# /DEBUG



module kr3m.net2.handlers
{
	export type JsSandboxCreatedEvent = {handler:kr3m.net2.handlers.ServerSideJavascript, sandbox:kr3m.javascript.Sandbox};



	/*
		Ein Handler, der es auf der Serverseite erlaubt, Javascript
		in HTML-Seiten zu verwenden. Für jede betroffene Anfrage
		wird eine Javascript-Sandbox erzeugt und der Inhalt der
		einzelnen <serverScript> Tags in der Sandbox ausgeführt.
		Alles, was die Javascript-Sandbox anbietet kann darin
		verwendet werden (z.B. echo-Ausgaben, RPC-Calls,
		Datenaustausch mit dem node.js-Server usw.).
	*/
	export class ServerSideJavascript extends ServerSideScripting
	{
		protected locaInitScriptBase = "//# EMBED(embed/locaInit.js, jsonNoQuotes)";
		protected locaInitScripts:{[locale:string]:{script:kr3m.javascript.Script, timestamp:number}} = {};

		protected errorElementCode = "//# EMBED(embed/errorelement.html, jsonNoQuotes)";



		protected buildDummyDocument(context:Context):any
		{
			var doc:any = {};
			doc.location = {};
			doc.location.href = context.request.getLocation();
			var urlParts = kr3m.util.Url.parse(doc.location.href);
			doc.location.protocol = urlParts.protocol + ":";
			doc.location.host = urlParts.domain + ":" + urlParts.port;
			doc.location.hostname = urlParts.domain;
			doc.location.port = urlParts.port;
			doc.location.pathname = urlParts.resource;
			doc.location.search = urlParts.query ? "?" + urlParts.query : "";
			doc.location.hash = "";
			doc.location.username = urlParts.user || "";
			doc.location.password = urlParts.password || "";
			doc.location.origin = doc.location.href;
			return doc;
		}



		protected getLocaleScript(
			context:Context,
			callback:CB<kr3m.javascript.Script>):void
		{
			if (!context.localization)
				return callback(undefined);

			context.localization.getTimestamp(context, (timestamp) =>
			{
				context.localization.getHash(context, (hash) =>
				{
					var meta = this.locaInitScripts[hash];
					if (meta && meta.timestamp >= timestamp)
						return callback(meta.script);

					if (timestamp === undefined)
						return callback(undefined);

					context.localization.getTexts(context, (texts) =>
					{
						texts = texts || {};
						var scriptCode = "_locData = " + kr3m.util.Json.encode(texts) + "\n" + this.locaInitScriptBase;
						var script = new kr3m.javascript.Script(scriptCode);
						this.locaInitScripts[hash] = {script : script, timestamp : timestamp};
						callback(script);
					});
				});
			});
		}



		protected createSandbox(
			context:Context,
			callback:(sandbox:kr3m.javascript.Sandbox) => void):void
		{
			var sandbox = new kr3m.javascript.Sandbox();
			sandbox.enableConsole();
			sandbox.enableEcho();

			if (context.config.sandbox && context.config.sandbox.allowFileAccess)
				sandbox.enableFileAccess();

			if (context.config.sandbox && context.config.sandbox.allowWebAccess)
				sandbox.enableWebAccess();

			context.request.getFormValues((formValues) =>
			{
				var queryValues = context.request.getQueryValues();
				sandbox.setGlobal("params", {POST : formValues, GET : queryValues});

				var doc = this.buildDummyDocument(context);
				sandbox.setGlobal("document", doc);
				sandbox.setGlobal("location", doc.location);

				var sbContext =
				{
					uriOriginal : context.request.getUri(),
					uriRedirected : context.getCurrentUri(),
					error : context.error ?
					{
						httpCode : context.error.httpCode,
						content : context.error.content ? context.error.content.toString() : null
					} : null
				}
				sandbox.setGlobal("context", sbContext);

				this.getLocaleScript(context, (localeScript) =>
				{
					if (localeScript)
						sandbox.run(localeScript);
					callback(sandbox);
				});
			});
		}



		protected processPart(
			context:Context,
			sandbox:kr3m.javascript.Sandbox,
			subUri:string,
			subContent:string,
			callback:StringCallback):void
		{
			subContent = subContent.replace(/<\?=(.+?)\?>/g, "<script server>echo($1)</script>");
			var searchPattern = /<script\s+(?:type=["']?serverscript['"]?|server)\s*>((?:[^"']|"[^"]*"|'[^']*')*?)<\/script>/gi;
			kr3m.async.Loop.loop((loopDone) =>
			{
				var matches = searchPattern.exec(subContent);
				if (!matches)
					return loopDone(false);

				var code = matches[1];
				kr3m.async.If.then(!sandbox, (thenDone) =>
				{
					this.createSandbox(context, (newSandbox) =>
					{
						sandbox = newSandbox;
						this.dispatch("sandboxCreated", {handler : this, sandbox : sandbox});
						thenDone();
					});
				}, () =>
				{
					sandbox.runRpc(code, (error) =>
					{
						var consoleOutput = sandbox.getConsoleOutput();
						var echo = sandbox.getEchoOutput().map(line => line.join(" ")).join("");

						for (var i = 0; i < consoleOutput.length; ++i)
						{
							if (consoleOutput[i].type == "err")
								logWarning("js sandbox console:", consoleOutput[i].text);
							else
								log("js sandbox log:", consoleOutput[i].text);
						}

						if (error)
						{
							var errorMessage = error.toString();
							var lineNumber = parseInt(error.stack.match(/evalmachine\.\<anonymous\>\:(\d+)/)[1], 10);
							var errorLine = code.split(/\r?\n/)[lineNumber - 1].replace(/^\s+/, "");
							logWarning("js sandbox error:", error.toString(), "in line", lineNumber, ":", errorLine);
//# DEBUG
							var tokens =
							{
								errorMessage : kr3m.util.Util.encodeHtml(errorMessage),
								script : kr3m.util.Util.encodeHtml(code).replace(/\r?\n/g, "<br/>"),
								errorLine : errorLine,
								lineNumber : lineNumber
							};
							echo += tokenize(this.errorElementCode, tokens);
//# /DEBUG
						}

						subContent = subContent.slice(0, matches.index) + echo + subContent.slice(searchPattern.lastIndex);
						searchPattern.lastIndex = matches.index;
						loopDone(true);
					});
				});
			}, () => callback(subContent));
		}



		protected process(
			context:Context,
			content:string,
			callback:StringCallback):void
		{
			this.processPart(context, null, context.getCurrentUri(), content, callback);
		}
	}
}

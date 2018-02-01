/// <reference path="../../../async/loop.ts"/>
/// <reference path="../../../javascript/sandbox.ts"/>
/// <reference path="../../../net/subservers/serversidescript/serversidescriptserver.ts"/>



module kr3m.net.subservers.serversidescript
{
	export class JavascriptServer extends kr3m.net.subservers.serversidescript.ServerSideScriptServer
	{
		protected createSandbox(
			context:kr3m.net.RequestContext,
			callback:(sandbox:kr3m.javascript.Sandbox) => void):void
		{
			var sandbox = new kr3m.javascript.Sandbox();
			sandbox.enableConsole();
			sandbox.enableEcho();
			callback(sandbox);
		}



		protected process(
			context:kr3m.net.RequestContext, content:string,
			callback:(processedContent:string) => void):void
		{
			this.createSandbox(context, (sandbox:kr3m.javascript.Sandbox) =>
			{
				var searchPattern = /<serverscript>([\s\S]*?)<\/serverscript>/gi;
				kr3m.async.Loop.loop((loopDone:(again:boolean) => void) =>
				{
					var matches = searchPattern.exec(content);
					if (!matches)
						return loopDone(false);

					sandbox.runRpc(matches[1], (error:Error) =>
					{
						var consoleOutput = sandbox.getConsoleOutput();
						var echo = sandbox.getEchoOutput().map((line:string[]) => line.join(" ")).join("");

						for (var i = 0; i < consoleOutput.length; ++i)
						{
							if (consoleOutput[i].type == "err")
								logWarning("sandbox-console:", consoleOutput[i].text);
							else
								log("sandbox-console:", consoleOutput[i].text);
						}

						if (error)
						{
							logWarning("sandbox-error:", error.toString());
//# DEBUG
							echo = error.toString();
//# /DEBUG
						}

						content = content.slice(0, matches.index) + echo + content.slice(searchPattern.lastIndex);
						searchPattern.lastIndex = matches.index;
						loopDone(true);
					});
				}, () => callback(content));
			});
		}
	}
}

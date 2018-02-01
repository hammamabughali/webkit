/// <reference path="../../../async/criticalsection.ts"/>
/// <reference path="../../../lib/childprocess.ts"/>
/// <reference path="../../../lib/node.ts"/>
/// <reference path="../../../net/subserver2.ts"/>



module kr3m.net.subservers.php
{
	export class PhpServer extends kr3m.net.SubServer2
	{
		public static commandLine = "php";
		public static showPhpErrors = true;

		private static cs = new kr3m.async.CriticalSection(10);



		public static setParallelCount(count:number):void
		{
			PhpServer.cs.setConcurrentLimit(count);
		}



		/*
			Diese Methode gibt zurück, welche Datei geladen
			werden soll abhängig von den Werten in context.

			Für nicht-triviale Routings einfach überschreiben.
		*/
		protected route(
			context:kr3m.net.RequestContext):string
		{
			return context.uriResourcePath;
		}



		public needsSession(
			context:kr3m.net.RequestContext,
			callback:(needSession:boolean) => void):void
		{
			callback(false);
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			PhpServer.cs.enter((exit:() => void) =>
			{
				var resourcePath = this.route(context);
				fsLib.exists(resourcePath, (exists:boolean) =>
				{
					if (!exists)
						return callback(false);

					callback(true);

					var op = PhpServer.commandLine + " " + resourcePath;
					//# DEPRECATED: don't use childProcessLib.exec directly, use kr3m.util.ChildProcess instead
					childProcessLib.exec(op, {maxBuffer : 10 * 1024 * 1024}, (error:Error, stdout:NodeBuffer, stderr:NodeBuffer) =>
					{
						exit();
						if (error)
						{
							if (PhpServer.showPhpErrors)
								return context.return500(stderr.toString());
							else
								return context.return500("error in php script");
						}

						context.setResponseContent(stdout.toString(), "text/html");
						context.flushResponse(200);
					});
				});
			});
		}
	}
}

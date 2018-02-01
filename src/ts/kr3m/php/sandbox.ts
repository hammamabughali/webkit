/// <reference path="../constants.ts"/>
/// <reference path="../net2/headers.ts"/>
/// <reference path="../php/cgioptions.ts"/>
/// <reference path="../util/childprocess.ts"/>
/// <reference path="../util/stringex.ts"/>



module kr3m.php
{
	export class Sandbox
	{
		public static commandPath = "";

		public showPhpErrors = true;
		public showPhpWarnings = false;



		public runFile(
			filePath:string,
			callback:(status:string, output:string) => void):void
		{
			var process = new kr3m.util.ChildProcess(Sandbox.commandPath + "php", [filePath]);
			process.exec((status) =>
			{
				if (status != kr3m.SUCCESS)
				{
					if (this.showPhpErrors)
						return callback(kr3m.ERROR_EXTERNAL, process.getErrorString());
					else
						return callback(kr3m.ERROR_EXTERNAL, "error in php script");
				}

				callback(kr3m.SUCCESS, process.getOutputString());
			});
		}



		/*
			See:
				https://ma.ttias.be/running-php-cgi-scripts-via-the-cli-as-a-webserver-would-by-faking-them/
				https://en.wikipedia.org/wiki/Common_Gateway_Interface
				http://serverfault.com/questions/187025/how-to-pass-get-variables-to-a-php-script-via-the-command-line
				http://stackoverflow.com/questions/4030147/how-to-pass-post-data-to-the-php-cgi
				https://www.nginx.com/resources/wiki/start/topics/examples/phpfcgi/
		*/
		public runCGI(
			options:CgiOptions,
			callback:(status:string, output:string|Buffer, headers:kr3m.net2.Headers) => void):void
		{
			var headers = new kr3m.net2.Headers();
			fsLib.realpath(options.environment.SCRIPT_FILENAME, (err:Error, filePath:string) =>
			{
				if (err)
					return callback(kr3m.ERROR_FILE, "", headers);

				options.environment.SCRIPT_FILENAME = filePath;

				var process = new kr3m.util.ChildProcess(Sandbox.commandPath + "php-cgi", []);
				process.environment = options.environment;
				if (options.content)
					process.stdin = options.content;

				process.exec((status) =>
				{
					if (process.exitCode != 0)
					{
						if (this.showPhpErrors)
							var errorMessage = process.getOutputString() + "\n" + process.getErrorString();
						else
							var errorMessage = "error in php script";

						return callback(kr3m.ERROR_EXTERNAL, errorMessage, headers);
					}

					var warnings:string[] = [];
					var offset = 0;
					var lineSep = Buffer.from("\r\n");
					var stdout = process.getOutput();
					var nextBreak = stdout.indexOf(lineSep, offset);
					var line = stdout.slice(offset, nextBreak).toString("utf-8");
					offset = nextBreak + 2;
					while (line)
					{
						var name = kr3m.util.StringEx.getBefore(line, ":");
						var value = line.slice(name.length + 1);
						if (name.match(/^[a-z]/i))
							headers.set(name.trim(), value.trim());
						else
							warnings.push(line);

						nextBreak = stdout.indexOf(lineSep, offset);
						line = stdout.slice(offset, nextBreak).toString("utf-8");
						offset = nextBreak + 2;
					}

					if (this.showPhpWarnings && warnings.length > 0)
						logWarning("PHP Warning:\n" + warnings.join("\n"));

					callback(kr3m.SUCCESS, stdout.slice(offset), headers);
				});
			});
		}
	}
}

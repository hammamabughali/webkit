/// <reference path="../async/criticalsection.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../lib/childprocess.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../lib/os.ts"/>
/// <reference path="../types.ts"/>



﻿module kr3m.util
{
	/*
		Convenience wrapper class for node.js' childProcess module
		including critical section to prevent too many external
		processes to run at the same time.
	*/
	export class ChildProcess
	{
		private static cs = new kr3m.async.CriticalSection(3);

		private running = false;

		public encoding = "utf8";
		public environment:{[name:string]:string};
		public stdin:string|Buffer;

		public exitCode:number;
		public error:Error;

		private stdout:Buffer;
		private stderr:Buffer;



		constructor(
			private command:string,
			private args:{toString():string}[] = [])
		{
		}



		public getOutputString():string
		{
			return this.stdout.toString(this.encoding);
		}



		public getErrorString():string
		{
			return this.stderr.toString(this.encoding);
		}



		public getOutput():Buffer
		{
			return this.stdout;
		}



		public exec(
			callback:StatusCallback):void
		{
			if (this.running)
				return callback(kr3m.ERROR_FLOOD);

			this.running = true;
			ChildProcess.cs.enter((exit) =>
			{
				this.exitCode = 0;
				this.error = undefined;

				this.stdout = Buffer.alloc(0);
				this.stderr = Buffer.alloc(0);

				var options:any = {};
				if (this.environment)
					options.env = this.environment;

				if (osLib.platform() == kr3m.PLATFORM_WINDOWS)
					options.shell = true;

				var args = this.args.map(arg => arg.toString());
				var spawn = childProcessLib.spawn(this.command, args, options);

				if (this.stdin)
					spawn.stdin.write(this.stdin);

				spawn.stdout.on("data", data => this.stdout = Buffer.concat([this.stdout, data]));
				spawn.stderr.on("data", data => this.stderr = Buffer.concat([this.stderr, data]));
				spawn.on("error", (error:Error) => this.error = error);

				spawn.on("close", (exitCode) =>
				{
					exit();
					this.exitCode = exitCode;
					this.running = false;
					callback(exitCode == 0 && !this.error ? kr3m.SUCCESS : kr3m.ERROR_EXTERNAL);
				});
			});
		}



		public static exec(
			commandLine:string,
			args:{toString():string}[],
			callback:StatusCallback):ChildProcess
		{
			var process = new ChildProcess(commandLine, args);
			process.exec(callback);
			return process;
		}
	}
}

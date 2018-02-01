/// <reference path="../constants.ts"/>
/// <reference path="../svn/logentry.ts"/>
/// <reference path="../util/childprocess.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.svn
{
	/*
		Mit dieser Klasse können SVN Anweisungen ausgeführt werden.

		Intern werden die normalen SVN-Kommandozeilenanweisungen
		benutzt - es handelt sich also nicht um einen kompletten
		SVN-Client. Entsprechend muss SVN auf dem Rechner installiert
		und über die Kommandozeile im aktuellen Verzeichnis aufrufbar
		sein (oder toolPath gesetzt).
	*/
	export class CliInterface
	{
		public static toolPath = "svn";
		public static logHeaderPattern = /^r(\d+) \| ([^|]+) \| ([^|]+) \| (\d+) lines?$/;



		constructor(
			private workFolder:string,
			private repositoryUrl:string,
			private username?:string,
			private password?:string)
		{
		}



		private exec(
			args:{toString():string}[],
			callback:(status:string, output:string) => void):void
		{
			if (this.username)
				args.push("--username", this.username);

			if (this.password)
				args.push("--password", this.password);

			var process = new kr3m.util.ChildProcess(CliInterface.toolPath, args);
			process.encoding = "latin1";
			process.exec(status => callback(status, process.getOutputString()));
		}



		public checkout(
			callback:(status:string, revision:number) => void):void
		{
			var args = ["checkout", this.repositoryUrl, this.workFolder];
			this.exec(args, (status, output) =>
			{
				if (status != kr3m.SUCCESS)
					return callback(status, 0);

				var matches = output.match(/Checked out revision (\d+)\./);
				if (!matches)
				{
					logWarning("unknown svn-checkout response:", output);
					return callback(kr3m.ERROR_EXTERNAL, 0);
				}

				var revision = parseInt(matches[1], 10);
				callback(status, revision);
			});
		}



		public update(
			callback:(status:string, revision:number) => void):void
		{
			var args = ["update", this.workFolder];
			this.exec(args, (status, output) =>
			{
				if (status != kr3m.SUCCESS)
					return callback(status, 0);

				var matches = output.match(/(?:At|Updated to) revision (\d+)\./);
				if (!matches)
				{
					logWarning("unknown svn-update response:", output);
					return callback(kr3m.ERROR_EXTERNAL, 0);
				}

				var revision = parseInt(matches[1], 10);
				callback(status, revision);
			});
		}



		/*
			Mischung aus update und checkout. Existiert das
			Verzeichnis schon, wird ein Update ausgeführt.
			Wenn nicht, wird ausgecheckt.
		*/
		public fetch(
			callback:(status:string, revision?:number) => void):void
		{
			fsLib.exists(this.workFolder, (exists) =>
			{
				if (exists)
				{
					this.update((status, revision) =>
					{
						if (status != kr3m.SUCCESS)
							return callback(status);

						callback(kr3m.SUCCESS, revision);
					});
				}
				else
				{
					kr3m.util.File.createFolder(this.workFolder, (success) =>
					{
						if (!success)
							return callback(kr3m.ERROR_FILE);

						this.checkout((status, revision) =>
						{
							if (status != kr3m.SUCCESS)
								return kr3m.util.File.deleteFolder(this.workFolder, () => callback(status));

							callback(kr3m.SUCCESS, revision);
						});
					});
				}
			});
		}



		public getRevisionLogEntry(
			revision:number|string,
			callback:(entry:LogEntry) => void):void
		{
			var args = ["log", "-r", revision, this.workFolder];
			this.exec(args, (status, output) =>
			{
				if (status != kr3m.SUCCESS)
					return callback(null);

				var lines = output.split(/\r?\n/);
				var matches = lines[1].match(CliInterface.logHeaderPattern);
				if (!matches)
					return callback(null);

				var entry = new LogEntry();
				entry.revision = parseInt(matches[1], 10);
				entry.author = matches[2];
				entry.timestamp = new Date(matches[3]);

				var descriptionLinesCount = parseInt(matches[4], 10);
				entry.description = lines.slice(2, 2 + descriptionLinesCount).join("\n");

				callback(entry);
			});
		}



		public getRevisionLogEntries(
			fromRevision:number|string,
			toRevision:number|string,
			callback:(entries:LogEntry[]) => void):void
		{
			var args = ["log", "-r", fromRevision + ":" + toRevision, this.workFolder];
			this.exec(args, (status, output) =>
			{
				if (status != kr3m.SUCCESS)
					return callback([]);

				var entries:LogEntry[] = [];
				var lines = output.split(/\r?\n/);
				for (var i = 0; i < lines.length; ++i)
				{
					var matches = lines[i].match(CliInterface.logHeaderPattern);
					if (!matches)
						continue;

					var entry = new LogEntry();
					entry.revision = parseInt(matches[1], 10);
					entry.author = matches[2];
					entry.timestamp = new Date(matches[3]);

					var descriptionLinesCount = parseInt(matches[4], 10);
					entry.description = lines.slice(i + 2, i + 2 + descriptionLinesCount).join("\n");
					entries.push(entry);

					i += descriptionLinesCount;
				}
				callback(entries);
			});
		}
	}
}

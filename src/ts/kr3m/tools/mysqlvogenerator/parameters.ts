module kr3m.tools.mysqlvogenerator
{
	export class Parameters
	{
		public verbose = false;
		public silent = false;

		public moduleName = "test";
		public targetPath = "";

		public dbHost = "localhost";
		public dbUser = "root";
		public dbPassword = "";
		public dbDatabase = "";



		constructor(args:string[])
		{
			args = args.slice(2);
			for (var i = 0; i < args.length; ++i)
			{
				switch (args[i])
				{
					case "-v":
						this.verbose = true;
						break;

					case "-s":
						this.silent = true;
						break;

					case "-h":
						if (i < args.length - 1)
							this.dbHost = args[++i];
						break;

					case "-u":
						if (i < args.length - 1)
							this.dbUser = args[++i];
						break;

					case "-p":
						if (i < args.length - 1)
							this.dbPassword = args[++i];
						break;

					case "-m":
						if (i < args.length - 1)
							this.moduleName = args[++i];
						break;

					default:
						if (this.dbDatabase == "")
							this.dbDatabase = args[i];
						else if (this.targetPath == "")
							this.targetPath = args[i].replace(/\\/g, "/");
						break;
				}
			}
			if (this.targetPath != ""
				&& this.targetPath.slice(-1) != "/")
				this.targetPath += "/";
		}
	}
}

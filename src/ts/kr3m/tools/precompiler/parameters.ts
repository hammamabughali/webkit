module kr3m.tools.precompiler
{
	export class Parameters
	{
		public command:string;
		public sourcePath:string;
		public targetPath:string;
		public greyOnly = false;
		public verbose = false;
		public silent = false;
		public showComments = false;
		public generateDescription = false;
		public checkReferenceLoops = false;
		public minimize = false;
		public target:string;
		public kind:string;
		public tscVersion:string;

		public flags:{[flag:string]:boolean} = {};
		public replacements:any[] = [];

		public unknownParams:string[] = [];



		constructor(args:string[])
		{
			var args = args.slice(2);
			for (var i = 0; i < args.length; ++i)
			{
				switch (args[i])
				{
					case "-c": this.showComments = true; break;
					case "-d": this.generateDescription = true; break;
					case "-m": this.minimize = true; break;
					case "-s": this.silent = true; break;
					case "-v": this.verbose = true; break;
					case "-l": this.checkReferenceLoops = true; break;
					case "-g": this.greyOnly = true; break;

					case "-t":
						if (i < args.length - 1)
						{
							this.target = args[++i];
							if (this.target == "ES5")
							{
								this.flags["ES5"] = true;
							}
							else if (this.target == "ES6")
							{
								this.flags["ES5"] = true;
								this.flags["ES6"] = true;
							}
						}
						break;

					case "-k":
						if (i < args.length - 1)
							this.kind = args[++i];

					case "-f":
						if (i < args.length - 1)
							this.flags[args[++i]] = true;
						break;

					case "-r":
						if (i < args.length - 2)
							this.replacements.push({pattern:args[++i], value:args[++i]});
						break;

					case "-o":
						if (i < args.length - 1)
							this.targetPath = args[++i];
						break;

					default:
						if (!this.command)
							this.command = args[i];
						else if (!this.sourcePath)
							this.sourcePath = args[i];
						else
							this.unknownParams.push(args[i]);
						break;
				}
			}
			if (!this.targetPath && this.sourcePath)
				this.targetPath = this.sourcePath.replace(/\.ts$/i, ".js");
		}



		public hasFlag(flag:string):boolean
		{
			return this.flags[flag];
		}
	}
}

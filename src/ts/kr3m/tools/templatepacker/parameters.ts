/// <reference path="../../util/map.ts"/>



module kr3m.tools.templatepacker
{
	export class Parameters
	{
		public sourcePath:string = null;
		public targetPath:string = null;
		public verbose:boolean = false;
		public silent:boolean = false;



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

					case "-o":
						if (i < args.length - 1)
						{
							this.targetPath = args[i + 1];
							++i;
						}
						break;

					default:
						if (!this.sourcePath)
							this.sourcePath = args[i];
						break;
				}
			}
			this.targetPath = this.targetPath || this.sourcePath + ".json";
		}
	}
}

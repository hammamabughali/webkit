/// <reference path="../../../tools/precompiler/parameters.ts"/>
/// <reference path="../../../util/file.ts"/>
/// <reference path="../../../util/stringex.ts"/>



module kr3m.tools.precompiler.handlers
{
	export class Abstract
	{
		public params:kr3m.tools.precompiler.Parameters;

		private errorCount = 0;
		private warningCount = 0;
		private currentPath:string;
		private lastPath:string;



		constructor(params:kr3m.tools.precompiler.Parameters)
		{
			this.params = params;
		}



		public hasErrors(strict = false):boolean
		{
			return this.errorCount > 0 || (strict && this.warningCount > 0);
		}



		public getErrorCount(strict = false):number
		{
			return this.errorCount + (strict ? this.warningCount : 0);
		}



		public getCompiledFileName(oldPath:string):string
		{
			var extension = kr3m.util.File.getExtension(oldPath);
			var newPath = oldPath.substr(0, oldPath.length - extension.length);
			newPath += ".pc.ts";
			return newPath;
		}



		protected error(message:string):void
		{
			if (this.currentPath != this.lastPath)
			{
				log(this.currentPath);
				this.lastPath = this.currentPath;
			}

			log(kr3m.util.Log.COLOR_BRIGHT_RED + "  " + message + kr3m.util.Log.COLOR_RESET);
			++this.errorCount;
		}



		protected warning(message:string):void
		{
			if (this.currentPath != this.lastPath)
			{
				log(this.currentPath);
				this.lastPath = this.currentPath;
			}

			log(kr3m.util.Log.COLOR_BRIGHT_YELLOW + "  " + message + kr3m.util.Log.COLOR_RESET);
			++this.warningCount;
		}



		protected deprecated(message:string):void
		{
			if (this.currentPath != this.lastPath)
			{
				log(this.currentPath);
				this.lastPath = this.currentPath;
			}

			log(kr3m.util.Log.COLOR_DARK_CYAN + "  " + message + kr3m.util.Log.COLOR_RESET);
			++this.warningCount;
		}



		protected unstable(message:string):void
		{
			if (this.currentPath != this.lastPath)
			{
				log(this.currentPath);
				this.lastPath = this.currentPath;
			}

			log(kr3m.util.Log.COLOR_DARK_PINK + "  " + message + kr3m.util.Log.COLOR_RESET);
			++this.warningCount;
		}



		protected comment(message:string):void
		{
			if (this.currentPath != this.lastPath)
			{
				log(this.currentPath);
				this.lastPath = this.currentPath;
			}

			log(kr3m.util.Log.COLOR_DARK_YELLOW + "  " + message + kr3m.util.Log.COLOR_RESET);
		}



		public handle(currentPath:string, content:string):void
		{
			this.currentPath = currentPath;
		}
	}
}

/// <reference path="../../../tools/precompiler/handlers/abstract.ts"/>



module kr3m.tools.precompiler.handlers
{
	export class Clean extends Abstract
	{
		constructor(params:kr3m.tools.precompiler.Parameters)
		{
			super(params);
		}



		public handle(currentPath:string, content:string):void
		{
			super.handle(currentPath, content);

			var newFileName = this.getCompiledFileName(currentPath);
			if (this.params.verbose)
				log("  deleting file " + newFileName);
			if (fsLib.existsSync(newFileName))
				fsLib.unlinkSync(newFileName);
		}
	}
}

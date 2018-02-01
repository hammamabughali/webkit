/// <reference path="../../util/stringex.ts"/>



module kr3m.tools.autoformatter
{
	export class Parameters
	{
		public static MAPPING = {};

		public rootPath:string;
		public silent:boolean = false;



		constructor()
		{
			var params = kr3m.util.StringEx.getNamedArguments(process.argv, kr3m.tools.autoformatter.Parameters.MAPPING);
			for (var i in this)
				this[i] = params[i] || this[i];

			this.rootPath = params.values[2] || ".";
		}
	}
}

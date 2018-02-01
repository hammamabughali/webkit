/// <reference path="../lib/vm.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.javascript
{
	export class Script
	{
		private precompiled:any;



		constructor(
			private code:string)
		{
			this.precompiled = new vmLib.Script(code);
		}



		public concat(...others:Array<string|Script>):Script
		{
			var code = this.code;
			code += "\n" + others.map((other) => typeof other == "string" ? other : other.code).join("\n");
			return new Script(code);
		}



		public getCode():string
		{
			return this.code;
		}



		public getPrecompiled():any
		{
			return this.precompiled;
		}
	}
}

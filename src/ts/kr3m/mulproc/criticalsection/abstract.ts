/// <reference path="../../types.ts"/>



module kr3m.mulproc.criticalsection
{
	export abstract class Abstract
	{
		constructor(
			protected id:string,
			protected limit:number = 1)
		{
		}



		public abstract enter(callback:(exit:Callback) => void):void;
	}
}

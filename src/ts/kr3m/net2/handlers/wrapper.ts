/// <reference path="../../net2/handlers/abstract.ts"/>



module kr3m.net2.handlers
{
	export class Wrapper extends Abstract
	{
		constructor(
			public uriPattern:RegExp,
			public handleFunc:(context:Context) => void)
		{
			super(uriPattern);
		}



		public handle(context:Context):void
		{
			this.handleFunc(context);
		}
	}
}

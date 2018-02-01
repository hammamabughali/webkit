/// <reference path="../async/timeout.ts"/>
/// <reference path="../types.ts"/>



module kr3m.unittests
{
	export class Case<RT>
	{
		constructor(
			protected name:string,
			protected testFunc:(callback:CB<RT>) => void,
			protected expected:RT,
			protected timeout = 0)
		{
		}



		public getName():string
		{
			return this.name;
		}



		public getExpected():RT
		{
			return this.expected;
		}



		public run(timeout:number, callback:CB<RT|Error>):void
		{
			timeout = this.timeout || timeout;

			if (timeout <= 0)
				return this.testFunc(callback);

			kr3m.async.Timeout.call(timeout, this.testFunc, callback, () => callback(new Error("Timeout")));
		}
	}
}

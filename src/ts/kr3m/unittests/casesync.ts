/// <reference path="../types.ts"/>
/// <reference path="../unittests/case.ts"/>



module kr3m.unittests
{
	export class CaseSync<RT> extends Case<RT>
	{
		constructor(name:string, testFunc:() => RT, expectedResult:RT)
		{
			super(name, (callback:(result:RT) => void) => callback(testFunc()), expectedResult);
		}
	}
}

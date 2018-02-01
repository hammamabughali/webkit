// ES6
// EXPERIMENTAL
module kr3m.async
{
	export function runGenerator(func:Function):void
	{
		var iterator = func();
		var callback = (result?:any) =>
		{
			var step = iterator.next(result);
			if (step.done)
				return;

			step.value(callback);
		};
		var step = iterator.next();
		if (!step.done)
			step.value(callback);
	}



	export function wrapAsync(thisObj:any, func:Function):Function
	{
		var wrapped = (...params:any[]) =>
		{
			var temp = (callback:Function) =>
			{
				params.push((...results:any[]) => callback(results));
				func.apply(thisObj, params);
			};
			return temp;
		};
		return wrapped;
	}
}
// /EXPERIMENTAL
// /ES6

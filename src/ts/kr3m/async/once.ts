module kr3m.async
{
	/*
		Returns a wrapper function that calls func the first time
		the wrapper function is called and then never again.
	*/
	export function once(func:(...params:any[]) => void):(...params:any[]) => void
	{
		var ran = false;
		var wrapped = (...params:any[]) =>
		{
			if (!ran)
				func(...params);
			ran = true;
		};
		return wrapped;
	}
}

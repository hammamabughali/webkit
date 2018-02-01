/// <reference path="../util/log.ts"/>



module kr3m.util
{
	export function trySafe(func:Function, ...params:any[]):void
	{
		try
		{
			func(...params);
		}
		catch(e)
		{
			Log.logError(e);
		}
	}
}



/*
	Bequemlichkeitsfunktion um nicht immer

		try {func(params[0], params[1], ...)} catch(e) {logError(e)}

	schreiben zu müssen.
*/
function trySafe(func:Function, ...params:any[]):void
{
	try
	{
		func(...params);
	}
	catch(e)
	{
		kr3m.util.Log.logError(e);
	}
}

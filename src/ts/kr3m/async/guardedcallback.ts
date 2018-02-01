/// <reference path="../util/log.ts"/>



/*
	Mit dieser Funktion können callback-Funktionen überwacht
	werden. D.h. wenn die Funktion sehr lange nicht aufgerufen
	wird, oder wenn sie mehrfach aufgerufen wird werden
	Fehlermeldungen ausgegeben.
*/
// EXPERIMENTAL
function guardedCallback(
	callback:(...params:any[]) => void,
	warningTimeout:number = 1000,
	errorTimeout:number = 10000):(...params:any[]) => void
{
//# DEBUG
	var timerWarning = setTimeout(() =>
	{
		kr3m.util.Log.logWarning("guarded callback taking longer than 1s");
		kr3m.util.Log.logStackTrace(false);
	}, warningTimeout);

	var timerError = setTimeout(() =>
	{
		kr3m.util.Log.logError("guarded callback taking longer than 10s");
		kr3m.util.Log.logStackTrace(true);
	}, errorTimeout);
//# /DEBUG

	var wasCalled = false;

	var helper = (...params:any[]) =>
	{
		if (wasCalled)
		{
			kr3m.util.Log.logError("executed guarded callback function is being called again");
			kr3m.util.Log.logStackTrace(true);
			return;
		}
//# DEBUG
		clearTimeout(timerWarning);
		clearTimeout(timerError);
//# /DEBUG
		wasCalled = true;
		callback(...params);
	};
	return helper;
}
// /EXPERIMENTAL

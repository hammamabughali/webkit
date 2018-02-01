/// <reference path="../async/loop.ts"/>
/// <reference path="../types.ts"/>



module kr3m.async
{
	/*
		Verschiedene Funktionen, um Funktionen mehrfach
		aufzurufen bis sie erfolgreich waren. Alternativ
		kann nach einer bestimmten Anzahl von Versuchen
		auch abgebrochen werden.
	*/
	export class Retry
	{
		/*
			Ruft die gegebene Funktion func wiederholt auf bis
			diese ihre Callback-Funktion mit success = true
			aufruft, dann wird successCallback aufgerufen.
			Nach count Fehlversuchen wird abgebrochen und
			abortCallback aufgerufen. Zwischen den einzelnen
			Versuchen wird delay ms gewartet.
		*/
		public static times(
			count:number,
			delay:number,
			func:(callback:SuccessCallback) => void,
			callback?:Callback,
			errorCallback?:Callback):void
		{
			kr3m.async.Loop.loop((loopDone) =>
			{
				func((success) =>
				{
					if (success)
					{
						if (callback)
							return callback();
						else
							return;
					}

					setTimeout(() =>
					{
						loopDone(--count > 0);
					}, delay);
				});
			}, () =>
			{
				if (errorCallback)
					errorCallback();
			});
		}
	}
}

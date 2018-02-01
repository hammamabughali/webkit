/// <reference path="../types.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.async
{
	export class Timeout
	{
		/*
			Calls the given function callFunc with an internally generated
			callback function. If the callback function is then called by
			callFunc before timeout milliseconds expire, successCallback
			will be called and the parameters callback received will be
			given to successCallback. If callback is not called before the
			timeout expires, timeoutCallback will be called with no parameters.
			If no timeoutCallback function is given, successCallback will be
			called instead without parameters.

			Example: load a file using a given URL and show its contents in an
			alert dialog - but show an error message if loading the file takes
			longer than five seconds.

				kr3m.async.Timeout.call(5000, (callback) =>
				{
					kr3m.util.Ajax.call(url, callback);
				}, (response) =>
				{
					alert(response);
				}, () =>
				{
					alert("timeout!");
				});
		*/
		public static call(
			timeout:number,
			callFunc:(callback:ParamsCallback) => void,
			successCallback:ParamsCallback,
			timeoutCallback?:Callback):void
		{
			timeoutCallback = timeoutCallback || <Callback> successCallback;
			var hadTimeout = false;
			var timer:any;
			var helper = function()
			{
				if (!hadTimeout)
				{
					clearTimeout(timer);
					successCallback.apply(null, arguments);
				}
			};
			timer = setTimeout(function()
			{
				hadTimeout = true;
				timeoutCallback();
			}, timeout);
			try
			{
				callFunc(helper);
			}
			catch (ex)
			{
				kr3m.util.Log.logDebug(ex.toString());
				hadTimeout = true;
				clearTimeout(timer);
				timeoutCallback();
			}
		}
	}
}

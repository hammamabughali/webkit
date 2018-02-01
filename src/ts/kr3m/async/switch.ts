/// <reference path="../types.ts"/>



module kr3m.async
{
	export class Switch
	{
		public static byThen(
			value:string,
			optionCallbacks:{[value:string]:(switchDone:Callback) => void},
			defaultCallback?:(switchDone:Callback) => void,
			callback?:Callback):void
		{
			var switchDone = () => callback && callback();
			if (optionCallbacks[value])
				return optionCallbacks[value](switchDone);

			if (defaultCallback)
				return defaultCallback(switchDone);

			switchDone();
		}



		public static by(
			value:string,
			optionCallbacks:{[value:string]:() => void},
			defaultCallback?:Callback):void
		{
			if (optionCallbacks[value])
				return optionCallbacks[value]();

			if (defaultCallback)
				return defaultCallback();
		}
	}
}

/// <reference path="../types.ts"/>



module kr3m.model
{
	export interface ContextOptions
	{
		// will be overwritten in derived classes
	}



	export class Context
	{
		private customValues:{[name:string]:any} = {};



		public need(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			//# TODO: if need is called synchronously the asynchronous check-methods overwrite each others loaded fields

			// will be overwritten in derived classes
			callback();
		}



		public setCustomValue(name:string, value:any):void
		{
			this.customValues[name] = value;
		}



		public getCustomValue(name:string):any
		{
			return this.customValues[name];
		}
	}
}

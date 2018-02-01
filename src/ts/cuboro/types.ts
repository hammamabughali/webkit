/// <reference path="../kr3m/services/callbackresult.ts"/>



module cuboro
{
	export type ResultCB<T = void> = (result:T, status:string) => void;
}

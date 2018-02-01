module kr3m.math
{
	export interface Accumulable<T>
	{
		accumulate(other:T):void;
		fromRaw(rawData:any):T;
	}
}

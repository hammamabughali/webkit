module kr3m.math
{
	export interface Interpolatable<T>
	{
		interpolated(f:number, other:T):T;
		fromRaw(rawData:any):T;
	}
}

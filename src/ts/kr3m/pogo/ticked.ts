/// <reference path="../pogo/tickdata.ts"/>



module pogo
{
	export interface Ticked
	{
		update(data:pogo.TickData):void;
	}
}

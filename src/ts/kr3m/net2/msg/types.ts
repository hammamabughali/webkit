module kr3m.net2.msg
{
	export type ResultCallback = (result:any, status:string) => void;



	export interface ServiceCall
	{
		cancel():void;
	};
}

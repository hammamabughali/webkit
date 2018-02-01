module kr3m.net2.msg
{
	export class Envelope
	{
		public serviceName:string;
		public payload:any;

		public status:string;
		public callbackId:number;
	}
}

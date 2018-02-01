module kr3m.net.msg
{
	export class Envelope
	{
		public name:string;
		public status:string;
		public callbackId:number;
		public clientId:number;
		public content:any;
	}
}

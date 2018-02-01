module kr3m.net.socket
{
	export class ServiceListener
	{
		public type:string;
		public listener:(data:any) => void;



		constructor(type:string = '', listener:(data:any) => void = null)
		{
			this.type = type;
			this.listener = listener;
		}
	}
}

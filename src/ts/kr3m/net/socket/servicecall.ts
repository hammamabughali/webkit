module kr3m.net.socket
{
	export class ServiceCall
	{
		public className:string;
		public methodName:string;
		public params:any[];



		constructor(className:string = "", methodName:string = "", params:any[] = null)
		{
			this.className = className;
			this.methodName = methodName;
			this.params = (params !== null) ? params : [];
		}
	}
}

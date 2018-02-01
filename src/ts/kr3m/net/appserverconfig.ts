module kr3m.net
{
	export class AppServerConfig
	{
		public port:number = 80;
		public https =
		{
			port : 443,
			key : "",
			certificate : "",
			intermediate : ""
		};
		public documentRoot:string = "./";
		public baseUrl:string = "http://localhost/";
		public db:any = null;
		public email:any = null;
	}
}

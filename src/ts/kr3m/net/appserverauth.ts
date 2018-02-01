module kr3m.net
{
	export class AppServerAuth
	{
		private uriPattern:RegExp;
		private user:string;
		private password:string;
		private realm:string;



		constructor(uriPattern:RegExp, user:string, password:string, realm:string)
		{
			this.uriPattern = uriPattern;
			this.user = user;
			this.password = password;
			this.realm = realm;
		}



		public equals(auth:kr3m.net.AppServerAuth):boolean
		{
			return this.uriPattern == auth.uriPattern;
		}



		public appliesTo(uri:string):boolean
		{
			return this.uriPattern.test(uri);
		}



		public matches(authData:string):boolean
		{
			return (this.user + ":" + this.password) == authData;
		}



		public getRealm():string
		{
			return this.realm;
		}
	}
}

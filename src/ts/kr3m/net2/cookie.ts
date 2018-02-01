module kr3m.net2
{
	export class Cookie
	{
		constructor(
			public name?:string,
			public value?:string,
			public expires?:Date,
			public isHttpOnly:boolean = false)
		{
		}



		public toString():string
		{
			var result = this.name + "=" + encodeURIComponent(this.value) + "; Path=/";

			if (this.expires)
				result += "; Expires=" + this.expires.toUTCString();

			if (this.isHttpOnly)
				result += "; HttpOnly";

			return result;
		}
	}
}

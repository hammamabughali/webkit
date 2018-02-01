/// <reference path="../../lib/node.ts"/>
/// <reference path="../../net/httprequest.ts"/>
/// <reference path="../../util/json.ts"/>



module kr3m.fb
{
	/*
		Eine Wrapper- bzw. Bequemlichkeitsklasse
		zum einfacheren Arbeiten mit Facebook.
	*/
	export class BackendWrapper
	{
		private appId:string;
		private appSecret:string;
		private appAccessToken:string;



		constructor(appId:string, appSecret:string)
		{
			this.appId = appId;
			this.appSecret = appSecret;
			this.appAccessToken = appId + "|" + appSecret;
		}



		private graph(
			action:string, params:any,
			callback:(response:any) => void):void
		{
			var url = "https://graph.facebook.com" + action;
			var request = new kr3m.net.HttpRequest(url, params);
			request.send((responseBody:string) =>
			{
				var response = kr3m.util.Json.decode(responseBody) || {success : false};
				callback(response);
			}, () =>
			{
				callback({success : false});
			});
		}



		public sendAppNotification(
			userId:string, message:string, url:string,
			callback:(success:boolean) => void):void
		{
			var action = "/" + userId + "/notifications";
			var params = {access_token : this.appAccessToken, template : message.slice(0, 320), href : url};
			this.graph(action, params, (response:any) =>
			{
				callback(response.success);
			});
		}



		public getVerifiedSignedRequest(value:string):any
		{
			if (!value)
				return null;

			var parts = value.split(".");
			if (parts.length != 2)
				return null;

			var signed = parts[0];
			var encoded = parts[1];

			var decoded = decodeBase64EncodedString(encoded.replace(/\-/g, "+").replace(/_/g, "/"));
			var request = kr3m.util.Json.decode(decoded);
			var expected = cryptoLib
				.createHmac("SHA256", this.appSecret).update(encoded).digest("base64")
				.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

			if (signed != expected)
				return null;

			return request;
		}
	}
}

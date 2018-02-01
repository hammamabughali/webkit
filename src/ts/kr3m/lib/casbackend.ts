/// <reference path="../lib/cas.ts"/>
/// <reference path="../net/httprequest.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/util.ts"/>



//# CLIENT
//# ERROR: cas.Backend darf niemals in einen Client kompiliert werden
//# /CLIENT
module cas
{
	/*
		Bequemlichkeitsklasse zum Zugreifen auf das CAS-Backend
	*/
	export class Backend
	{
		private gameId:string;
		private secretKey:string;
		private backendUrl:string;



		constructor(gameId:string, secretKey:string, backendUrl?:string)
		{
			this.gameId = gameId;
			this.secretKey = secretKey;
//# DEBUG
			this.backendUrl = backendUrl || "https://cas-dev.das-onlinespiel.de/backend";
//# /DEBUG
//# RELEASE
			this.backendUrl = backendUrl || "https://cas-live.das-onlinespiel.de/backend";
//# /RELEASE
		}



		private callService(
			params:any,
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			var request = new kr3m.net.HttpRequest(this.backendUrl, params, "POST");
			request.send((response:any) =>
			{
				callback(kr3m.util.Json.decode(response));
			}, errorCallback);
		}



		public verifyUser(
			userId:number,
			token:string,
			callback:(isVerified:boolean) => void,
			errorCallback?:ErrorCallback):void
		{
			var params = {action : "verifyUser", gameId : this.gameId, secret : this.secretKey, userId : userId, token : token};
			this.callService(params, (response:any) =>
			{
				if (!response)
					return callback(false);

				callback(response.verified);
			}, errorCallback);
		}



		public getUser(
			userId:number,
			token:string,
			callback:CB<cas.vo.User>,
			errorCallback?:ErrorCallback):void;

		public getUser(
			userId:number,
			callback:CB<cas.vo.User>,
			errorCallback?:ErrorCallback):void;

		public getUser():void
		{
			var first = kr3m.util.Util.getFirstOfType.bind(null, arguments);
			var userId = <number> first("number");
			var token = <string> first("string");
			var callback = <CB<cas.vo.User>> first("function", 0, 0);
			var errorCallback = <ErrorCallback> first("function", 0, 1);

			var params = {action : "getUser", gameId : this.gameId, secret : this.secretKey, userId : userId, token : token};
			this.callService(params, (response) =>
			{
				if (!response)
					return callback(null);

				callback(response.user);
			}, errorCallback);
		}



		//# TODO: fehlende Backend-Services hier noch nachtragen
	}
}

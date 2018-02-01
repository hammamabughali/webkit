/// <reference path="../lib/cas.ts"/>
/// <reference path="../net/httprequest.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/json.ts"/>



//# CLIENT
//# ERROR: cas.Admin darf niemals in einen Client kompiliert werden
//# /CLIENT
module cas
{
	/*
		Bequemlichkeitsklasse zum Zugreifen auf die CAS-Admin-API
	*/
	export class Admin
	{
		private secretKey = "hjHsdfsFSDd9huq2jHys2sljk";



		constructor(private apiUrl?:string)
		{
//# LOCALHOST
			this.apiUrl = apiUrl || "http://localhost:8080/admin";
//# /LOCALHOST
//# !LOCALHOST
//# DEBUG
			this.apiUrl = apiUrl || "https://cas-dev.das-onlinespiel.de/admin";
//# /DEBUG
//# RELEASE
			this.apiUrl = apiUrl || "https://cas-live.das-onlinespiel.de/admin";
//# /RELEASE
//# /!LOCALHOST
		}



		private callService(
			action:string,
			params:any,
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			params.action = action;
			params.secret = this.secretKey;
			var request = new kr3m.net.HttpRequest(this.apiUrl, params, "POST");
			request.send((response:Buffer) =>
			{
				var result = kr3m.util.Json.decode(response.toString());
				if (result.success)
					callback(result);
				else
					errorCallback && errorCallback(result.status);
			}, errorCallback);
		}



		public getDomainNames(
			callback:(domainNames:{[id:string]:string}) => void,
			errorCallback?:ErrorCallback):void
		{
			this.callService("getDomainNames", {}, (result:any) => callback(result.domainNames), errorCallback);
		}



		public getGameNames(
			domainId:string|number,
			callback:(gameNames:{[id:string]:string}) => void,
			errorCallback?:ErrorCallback):void
		{
			this.callService("getGameNames", {domainId : domainId}, (result:any) => callback(result.gameNames), errorCallback);
		}



		//# TODO: fehlende API-Services hier noch nachtragen
	}
}

/// <reference path="../../lib/wl/types.ts"/>
/// <reference path="../../net/httprequest.ts"/>
/// <reference path="../../types.ts"/>
/// <reference path="../../util/json.ts"/>



module kr3m.wl
{
	/*
		Simple convenience class for working with the Wize.life
		(formerly known as Seniorbook) API.
	*/
	export class BackendWrapper
	{
		constructor(
//# RELEASE
			private apiUrl = "http://wize.life/user/kr3m/api",
//# /RELEASE
//# !RELEASE
			private apiUrl = "http://senior-book.biz/user/kr3m/api",
//# /!RELEASE
			private username = "kr3m",
			private password = "RBy2Lddh8Zo29t33q6xP")
		{
		}



		public callService(
			serviceName:string,
			params:any,
			callback:AnyCallback,
			errorCallback?:ErrorCallback):void
		{
			params.method = serviceName;
			var request = new kr3m.net.HttpRequest(this.apiUrl, params);
			request.setHttpAuth(this.username, this.password);
			request.send((responseBody:string) =>
			{
				var response = kr3m.util.Json.decode(responseBody);
				if (!response || !response.success)
				{
					if (errorCallback)
						return errorCallback(responseBody ? responseBody.toString() : "");

					if (responseBody.indexOf("invalid token or userId") >= 0)
						return callback(null);

					logError("error while calling wize life api");
					logError("params", params);
					logError("responseBody", responseBody ? responseBody.toString() : null);
				}
				callback(response);
			}, (errorMessage:string) =>
			{
				if (errorCallback)
					return errorCallback(errorMessage);

				if (errorMessage.indexOf("invalid token or userId") >= 0)
					return callback(null);

				logError("error while calling wize life api");
				logError("params", params);
				logError("errorMessage", errorMessage);
				callback(null);
			});
		}



		public ping(
			callback:(serverTimestamp:number) => void):void
		{
			this.callService("ping", {}, (response:any) => callback(response.pong));
		}



		public getProfile(
			userId:number, token:string,
			callback:(userProfile:UserProfile) => void):void
		{
			var params = {userId : userId, token : token};
			this.callService("getProfile", params, (response) =>
			{
				if (!response || !response.success)
					return callback(null);

				callback(response.profile);
			});
		}



		public share(
			userId:number,
			token:string,
			message:string,
			headline?:string,
			url?:string,
			imageUrl?:string,
			callback?:SuccessCallback):void
		{
			var params =
			{
				userId : userId,
				token : token,
				description : message,
				headline : headline,
				backlink : url,
				imageurl : imageUrl
			};
			this.callService("share", params, (response:any) =>
			{
				var success = (response && response.success) ? true : false;
				callback && callback(success);
			});
		}



		public notify(
			userId:number,
			token:string,
			message:string,
			headline?:string,
			url?:string,
			imageUrl?:string,
			callback?:SuccessCallback):void
		{
			var params =
			{
				userId : userId,
				token : token,
				description : message,
				headline : headline,
				backlink : url,
				imageurl : imageUrl
			};
			this.callService("notify", params, (response:any) =>
			{
				var success = (response && response.success) ? true : false;
				callback && callback(success);
			});
		}



		public request(
			userId:number,
			token:string,
			friendIds:number[],
			message:string,
			headline?:string,
			url?:string,
			imageUrl?:string,
			callback?:SuccessCallback):void
		{
			if (friendIds.length < 1)
				return callback && callback(false);

			url = url || "";
			var hashPos = url.indexOf("#");
			url = (hashPos < 0) ? "" : url.slice(hashPos);

			var params:any =
			{
				userId : userId,
				token : token,
				description : message,
				headline : headline,
				backlink : url,
				imageurl : imageUrl
			};
			for (var i = 0; i < friendIds.length; ++i)
				params["selectedFriendUserIds[" + i + "]"] = friendIds[i];

			this.callService("sendRequest", params, (response:any) =>
			{
				var success = (response && response.success) ? true : false;
				callback && callback(success);
			});
		}



		public getFriends(
			userId:number, token:string,
			callback:(friends:UserProfile[]) => void):void
		{
			var params = {userId : userId, token : token};
			this.callService("getFriends", params, (response:any) =>
			{
				if (!response || !response.success)
					return callback([]);

				callback(response.friends);
			});
		}
	}
}

/// <reference path="../../cuboro/stubs/abstract.ts"/>
/// <reference path="../../kr3m/lib/cas.ts"/>



module cuboro.stubs
{
	export class User extends Abstract
	{
		public login(
			casUserId:number,
			casToken:string,
			callback?:ResultCB<cuboro.vo.User>):void
		{
			var params = {casUserId : casUserId, casToken : casToken};
			this.callService("User.login", params, response => callback && callback(response.data, response.status));
		}



		public logout(
			callback?:StatusCallback):void
		{
			var params = {};
			this.callService("User.logout", params, response => callback && callback(response.status));
		}
	}
}



var sUser = new cuboro.stubs.User();

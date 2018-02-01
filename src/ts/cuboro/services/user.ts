/// <reference path="../../cuboro/services/abstract.ts"/>
/// <reference path="../../cuboro/vo/user.ts"/>



module cuboro.services
{
	export class User extends Abstract
	{
		public login(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<cuboro.vo.User>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({casUserId : "uint", casToken : "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mUser.login(context, params.casUserId, params.casToken, (user, status) => callback(new kr3m.services.CallbackResult(status, user)));
		}



		public logout(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult>):void
		{
			mUser.logout(context, status => callback(new kr3m.services.CallbackResult(status)));
		}
	}
}

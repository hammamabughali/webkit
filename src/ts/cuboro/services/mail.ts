/// <reference path="../../cuboro/models/mail.ts"/>
/// <reference path="../../cuboro/services/abstract.ts"/>



module cuboro.services
{
	export class Mail extends Abstract
	{
		public sendEcard(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({trackId:"uint",recipienEmail : "string", recipienName : "string",senderEmail : "string",senderName: "string", message: "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mMail.sendEcard(context, params.trackId ,params.recipienEmail, params.recipienName, params.senderEmail, params.senderName, params.message,(status, isSent) => callback(new kr3m.services.CallbackResult(isSent, status)));
		}


		public sendContact(
			context:cuboro.Context,
			params:any,
			callback:CB<kr3m.services.CallbackResult<boolean>>):void
		{
			var helper = new kr3m.services.ParamsHelper(params);
			if (!helper.validate({senderName : "string",senderEmail: "string", message: "string"}))
				return callback(new kr3m.services.CallbackResult(kr3m.ERROR_PARAMS));

			mMail.sendContact(context, params.senderEmail, params.senderName, params.message,(status, isSent) => callback(new kr3m.services.CallbackResult(isSent, status)));
		}
	}
}

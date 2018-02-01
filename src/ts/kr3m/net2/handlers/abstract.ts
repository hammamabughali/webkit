/// <reference path="../../lib/node.ts"/>
/// <reference path="../../model/eventdispatcher.ts"/>
/// <reference path="../../net2/constants.ts"/>
/// <reference path="../../net2/context.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.net2.handlers
{
	export abstract class Abstract extends kr3m.model.EventDispatcher
	{
		constructor(
			public uriPattern:RegExp)
		{
			super();
		}



		public accepts(context:kr3m.net2.Context):boolean
		{
			return true;
		}



		/*
			Checks whether the user is logged in using http-auth.
			If he is logged in, callback is called, otherwise an
			access-denied-response is sent to the requesting browser.
		*/
		protected checkAuth(
			context:kr3m.net2.Context,
			realm:string,
			user:string,
			password:string,
			callback:Callback):void
		{
			var match = user + ":" + password;
			var auth = context.request.getHeader("authorization") || "";
			var authDataBase64 = auth.substring(5);
			var authData = decodeBase64EncodedString(authDataBase64);
			if (authData == match)
				return callback();

			context.response.setHeader("WWW-Authenticate", "Basic realm=\"" + realm + "\"");
			context.flush(HTTP_ERROR_AUTH);
		}



		public abstract handle(context:Context):void;
	}
}

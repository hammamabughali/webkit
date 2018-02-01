/// <reference path="../../lib/external/fbsdk/fbsdk.d.ts"/>
/// <reference path="../../lib/fb/types.ts"/>



module kr3m.fb
{
	/*
		Bindet die Facebook-SDK in die aktuelle Seite ein.
	*/
	export function initFacebook(
		appId:string,
		callback?:() => void,
		params?:FBInitParams,
		language?:string):void
	{
		if (window.fbAsyncInit)
			return kr3m.util.Log.logError("Facebook init already called");

		params = params || {};
		params.appId = appId;
		params.status = params.status !== undefined ? params.status : true;
		params.xfbml = params.xfbml !== undefined ? params.xfbml : false;
		params.cookie = params.cookie !== undefined ? params.cookie : true;
		params.version = params.version || kr3m.fb.API_VERSION;

		language = language || "de_DE";

		window.fbAsyncInit = () =>
		{
			FB.init(params);
			callback && callback();
		};

		if (document.getElementById("facebook-jssdk"))
			return kr3m.util.Log.logError("Facebook init already called");

		var js = document.createElement("script");
		js.id = "facebook-jssdk";

		js.src = "//connect.facebook.com/" + language + "/sdk.js";

		var fjs = document.getElementsByTagName("script")[0];
		if (fjs)
			fjs.parentNode.insertBefore(js, fjs);
		else
			document.body.appendChild(js);
	}
}

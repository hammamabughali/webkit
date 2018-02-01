/// <reference path="../async/if.ts"/>
/// <reference path="../model/context.ts"/>
/// <reference path="../net2/constants.ts"/>
/// <reference path="../net2/localizations/abstract.ts"/>
/// <reference path="../net2/request.ts"/>
/// <reference path="../net2/response.ts"/>
/// <reference path="../net2/routers/abstract.ts"/>
/// <reference path="../net2/session.ts"/>
/// <reference path="../net2/sessionmanagers/abstract.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/json.ts"/>



module kr3m.net2
{
	export interface ContextOptions extends kr3m.model.ContextOptions
	{
		session?:boolean;
		locales?:boolean;
	}



	export class Context extends kr3m.model.Context
	{
		public session:Session;
		public request:Request;
		public response:Response;
		public locales:string[];
		public environment:{[name:string]:string} = {};

		public config:kr3m.net2.configs.AppServer;
		public router:kr3m.net2.routers.Abstract;
		public localization:kr3m.net2.localizations.Abstract;
		public sessionManager:kr3m.net2.sessionmanagers.Abstract;

		private currentUri:string;
		private redirectHandler:Callback;

		public error:{httpCode:number, content:any, mimeType:string, encoding:string};

		public documentRoot = "public";



		constructor(
			rawRequest:any,
			rawResponse:any,
			config:kr3m.net2.configs.AppServer,
			router:kr3m.net2.routers.Abstract,
			localization:kr3m.net2.localizations.Abstract,
			sessionManager:kr3m.net2.sessionmanagers.Abstract)
		{
			super();
			this.request = new Request(rawRequest);
			this.response = new Response(rawResponse);

			this.config = config;
			this.router = router;
			this.localization = localization;
			this.sessionManager = sessionManager;
		}



		public getCurrentUri():string
		{
			return this.currentUri ? this.currentUri : this.request.getUri();
		}



		public getLoc(
			callback:CB<LocFunc>):void
		{
			this.localization.getLoc(this, callback);
		}



		public getSyncParseFunc(
			callback:CB<LocFunc>):void
		{
			this.localization.getSyncParseFunc(this, callback);
		}



		public setRedirectHandler(handler:Callback):void
		{
			this.redirectHandler = handler;
		}



		public setCurrentUri(uri:string):void
		{
			this.currentUri = uri;
		}



		public redirect(toUri:string):void
		{
			this.currentUri = toUri;
			if (this.redirectHandler)
				this.redirectHandler();
			else
				logError("redirecting to", toUri, "but no redirect handler is set");
		}



		public need(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			super.need(options, () =>
			{
				this.checkLocales(options, () =>
				{
					this.checkSession(options, () =>
					{
						callback();
					}, errorCallback);
				}, errorCallback);
			}, errorCallback);
		}



		protected checkLocales(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			if (!options.locales)
				return callback();

			if (this.locales)
				return callback();

			var locales = this.request.getLocales();
			if (locales.length > 0)
			{
				this.locales = locales;
				return callback();
			}

			errorCallback && errorCallback("locales");
		}



		protected checkSession(
			options:ContextOptions,
			callback:Callback,
			errorCallback?:(missingFieldId:string) => void):void
		{
			if (!options.session)
				return callback();

			if (this.session)
				return callback();

			if (!this.sessionManager)
				return errorCallback && errorCallback("session");

			this.sessionManager.get(this, (session) =>
			{
				if (!session)
					return errorCallback && errorCallback("session");

				this.session = session;
				callback();
			});
		}



		public redirectToError():void
		{
			this.redirect("/error.html");
		}



		/*
			Puts the context into an error state but continues processing (as
			opposed to flush, which stops immediately). This is primarily used
			to signal an error but allow the app server to handle that error
			gracefully instead of immediately returning whatever happened.
		*/
		public setError(
			httpCode:number,
			callback:Callback,
			content?:any,
			mimeType?:string,
			encoding = "utf8"):void
		{
			this.setRedirectHandler(callback);
			this.error = null;
			this.flush(httpCode, content, mimeType, encoding);
		}



		/*
			Immediately stop all further processing of this request and return the given status code and content. If an error occured, error
			processing might still happen before the response is actually returned
			to the browser.
		*/
		public flush(
			httpCode = HTTP_SUCCESS,
			content?:any,
			mimeType?:string,
			encoding = "utf8"):void
		{
			kr3m.async.If.then(this.session, thenDone => this.sessionManager.release(this, this.session, thenDone), () =>
			{
				if ((httpCode < 200 || httpCode >= 400) && !this.error)
				{
					this.error = {httpCode : httpCode, content : content, mimeType : mimeType, encoding : encoding};
					return this.redirectToError();
				}

				if (content)
				{
					if (typeof content == "string")
					{
						mimeType = mimeType || "text/plain; charset=utf-8";
					}
					else if (content instanceof Buffer)
					{
						mimeType = mimeType || "application/octet-stream";
					}
					else
					{
						content = kr3m.util.Json.encode(content);
						mimeType = mimeType || "application/json; charset=utf-8";
					}
					this.response.setContent(content, mimeType, encoding);
				}
				this.response.flush(this.error ? this.error.httpCode : httpCode);
			});
		}
	}
}

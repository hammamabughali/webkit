/// <reference path="../../db/mysqldbconfig.ts"/>
/// <reference path="../../mail/email2config.ts"/>
/// <reference path="../../net2/configs/http.ts"/>
/// <reference path="../../net2/configs/https.ts"/>
/// <reference path="../../net2/configs/localization.ts"/>
/// <reference path="../../net2/configs/sandbox.ts"/>
/// <reference path="../../net2/configs/share.ts"/>



module kr3m.net2.configs
{
	export class AppServer
	{
		// always available
		public documentRoot = "public";
		public http = new Http();
		public localization = new Localization();
		public sandbox = new Sandbox();
		public workerCount = 0; // set to 0 to create one worker per CPU core
		public forceHttps = false;
		public useLogColors = false;

		// optional
		public email:kr3m.mail.Email2Config;
		public https:Https;
		public mysql:kr3m.db.MySqlDbConfig;
		public share:Share;
	}
}

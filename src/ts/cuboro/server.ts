/// <reference path="../cuboro/constants.ts"/>
/// <reference path="../cuboro/context.ts"/>
/// <reference path="../cuboro/db.ts"/>
/// <reference path="../cuboro/handlers/gateway.ts"/>
/// <reference path="../cuboro/handlers/language.ts"/>
/// <reference path="../cuboro/handlers/status.ts"/>
/// <reference path="../cuboro/localization.ts"/>
/// <reference path="../kr3m/db/mysqldbupdater.ts"/>
/// <reference path="../kr3m/net2/appserver.ts"/>
/// <reference path="../kr3m/net2/handlers/filesystem.ts"/>
/// <reference path="../kr3m/net2/handlers/share.ts"/>
/// <reference path="../kr3m/util/folderwatcher.ts"/>
/// <reference path="../kr3m/util/util.ts"/>



module cuboro
{
	export class AppServer extends kr3m.net2.AppServer
	{
		constructor()
		{
			super();

			this.contextClass = cuboro.Context;

			this.flags.onceSet("config", () =>
			{
				this.defaultLocalization = new Localization(this.config.localization);
			});
		}



		private initMail():void
		{
			kr3m.mail.Email2.init(this.config.email);
		}



		private initDatabase(
			callback:Callback):void
		{
			var dbConfig = kr3m.util.Util.mergeAssoc(new kr3m.db.MySqlDbConfig(), this.config.mysql);
			db = new kr3m.db.MySqlDb(dbConfig);
			this.flags.set("sessions");

			var updater = new kr3m.db.MySqlDbUpdater(db);
			updater.update(DB_VERSION, (status) =>
			{
				if (status == kr3m.SUCCESS)
				{
					this.defaultSessionManager = new kr3m.net2.sessionmanagers.MySql(db);
					this.flags.set("sessions", "mySql");
					this.flags.set("mySql");
					return callback();
				}

				logError("database update check failed with status", status);

				this.shutdownOnFileChange("server.js");
				this.shutdownOnFolderChange("database");
			});
		}



		protected setupContext(
			request:any,
			response:any,
			callback:CB<kr3m.net2.Context>):void
		{
			super.setupContext(request, response, (context) =>
			{
				context.response.addAccessControl();
				callback(context);
			});
		}



		protected runMaster():void
		{
			log("--------------------------------------------------------");
			log("starting AppServer master");
			log("--------------------------------------------------------");
			log("kr3m-Framework-Version:", kr3m.VERSION);
			log("Cuboro-Version:", cuboro.VERSION);
			log("--------------------------------------------------------");

			this.initDatabase(() =>
			{
				this.shutdownOnFileChange(this.configPath);
				this.shutdownOnFileChange(process.argv[1]);
			});
		}



		protected runWorker(callback:Callback):void
		{
			this.addHandler(new cuboro.handlers.Gateway());
			this.addHandler(new cuboro.handlers.Language());
			this.addHandler(new cuboro.handlers.Status());
			this.addHandler(new kr3m.net2.handlers.FileSystem());
			this.addHandler(new kr3m.net2.handlers.Share());

			super.runWorker(() =>
			{
				this.initMail();
				this.initDatabase(() =>
				{
					callback();
				});
			});
		}
	}
}



var server = new cuboro.AppServer();
server.run();

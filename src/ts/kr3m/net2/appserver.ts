/// <reference path="../async/flags.ts"/>
/// <reference path="../async/join.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../db/mysqldb.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../mulproc/cluster.ts"/>
/// <reference path="../net2/configs/appserver.ts"/>
/// <reference path="../net2/context.ts"/>
/// <reference path="../net2/handlers/filesystem.ts"/>
/// <reference path="../net2/handlers/fragment.ts"/>
/// <reference path="../net2/handlers/relay.ts"/>
/// <reference path="../net2/handlers/status.ts"/>
/// <reference path="../net2/handlers/wrapper.ts"/>
/// <reference path="../net2/httpserver.ts"/>
/// <reference path="../net2/httpsserver.ts"/>
/// <reference path="../net2/localizations/abstract.ts"/>
/// <reference path="../net2/localizations/simple.ts"/>
/// <reference path="../net2/routers/abstract.ts"/>
/// <reference path="../net2/routers/simple.ts"/>
/// <reference path="../net2/sessionmanagers/mysql.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/file.ts"/>
/// <reference path="../util/folderwatcher.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.net2
{
	/*
		Der Nachfolger des AppServer, der bisher verwendet wurde.
		Praktisch der "Node-Server 2.0". Folgende Gesichtspunkte
		wurden bei der Entwicklung berücksichtigt:
		- einfacheres Erstellen von Spezialverhalten für beliebige
		Ressourcen-URIs
		- von Anfang an mit Cluster-Technologien erstellt, alle
		Arbeitsweisen darauf ausgelegt
		- von Anfang an mit klar durchdachtem Session-Management
		anstelle von nachträglich rangetackert
		- mächtigere Context-Klassen um auf "globale" Objekte eines
		einzelnen Requests zuzugreifen und doppelte Lese- und
		Schreibzugriffe auf die Datenbank zu verhinden
	*/
	export class AppServer
	{
		protected isShuttingDown = false;

		public flags = new kr3m.async.Flags();

		protected config:kr3m.net2.configs.AppServer;

		public defaultRouter:kr3m.net2.routers.Abstract;
		public defaultLocalization:kr3m.net2.localizations.Abstract;
		public defaultSessionManager:kr3m.net2.sessionmanagers.Abstract;

		protected handlers:kr3m.net2.handlers.Abstract[] = [];
		protected httpServer:HttpServer;
		protected httpsServer:HttpsServer;

		public contextClass = Context;

		protected cluster = new kr3m.mulproc.Cluster();



		constructor(protected configPath = "config/config.json")
		{
			if (clusterLib.isMaster)
				log("loading config from", configPath);

			kr3m.util.File.loadJsonFile(configPath, (jsonConfig) =>
			{
				this.config = new kr3m.net2.configs.AppServer();
				if (!jsonConfig)
				{
					log("config file not found:", configPath);
					this.configPath = "";
				}
				else
				{
					this.config = kr3m.util.Util.mergeAssocRecursive(this.config, jsonConfig);
				}

				kr3m.mulproc.adjustLog(this.config.useLogColors);

				this.defaultRouter = new kr3m.net2.routers.Simple();
				this.defaultLocalization = new kr3m.net2.localizations.Simple(this.config.localization);

				this.flags.set("config");
			});

			process.on("uncaughtException", this.handleUncaughtException.bind(this));
		}



		protected handleUncaughtException(err:Error):void
		{
			logError(err["stack"]);
			logError("[SERVER TERMINATED]");
			process.exit(1);
		}



		protected terminate():void
		{
			log("[SERVER TERMINATED]");
			process.exit(0);
		}



		public shutdown():void
		{
			if (this.isShuttingDown)
				return;

			this.isShuttingDown = true;

			log("shutdown sequence started");

			var join = new kr3m.async.Join();

			if (this.httpServer)
				this.httpServer.shutdown(join.getCallback());

			if (this.httpsServer)
				this.httpsServer.shutdown(join.getCallback());

			this.cluster.shutdown(join.getCallback());

			var killTimer = <any>setTimeout(() =>
			{
				killTimer = null;
				log("server shutdown taking too long, forcing process exit");
				this.terminate();
			}, 1000);
			killTimer.unref();

			join.addCallback(() =>
			{
				if (killTimer)
					clearTimeout(killTimer);

				log("shutdown sequence completed");
				this.terminate();
			});
		}



		public shutdownOnFileChange(path:string):void
		{
			fsLib.watch(path, () =>
			{
				log("--------------------------------------------------------");
				log(path, "changed, shutting down");
				log("--------------------------------------------------------");

				this.shutdown();
			});
		}



		public shutdownOnFolderChange(path:string):void
		{
			kr3m.util.FolderWatcher.watch(path, (fileName:string) =>
			{
				log("--------------------------------------------------------");
				log(path, "folder changed, shutting down");
				log("--------------------------------------------------------");

				this.shutdown();
			});
		}



		public run():void
		{
			this.flags.onceSet("config", () =>
			{
				this.cluster.setMaster(() =>
				{
					this.runMaster();
				});

				var workerCount = this.config.workerCount || osLib.cpus().length;
				this.cluster.registerPersistant("webserver", {count : workerCount, staggered : true}, () =>
				{
					this.runWorker(() =>
					{
						this.cluster.persistantInitialized();
					});
				});

				this.cluster.run();
			});
		}



		protected runMaster():void
		{
			log("--------------------------------------------------------");
			log("starting AppServer master");
			log("--------------------------------------------------------");
			log("kr3m-Framework-Version:", kr3m.VERSION);
			log("--------------------------------------------------------");
			if (this.configPath)
				this.shutdownOnFileChange(this.configPath);
			this.shutdownOnFileChange(process.argv[1]);

			this.flags.set("master");
		}



		public getHandlersOfClass<T extends kr3m.net2.handlers.Abstract>(cls:{new():T}):T[]
		{
			return <any> this.handlers.filter(handler => handler instanceof cls);
		}



		public addHandler(
			handler:kr3m.net2.handlers.Abstract):void
		{
			this.handlers.push(handler);
		}



		public on(
			uriPattern:RegExp,
			listener:(context:Context) => void):void
		{
			this.handlers.push(new kr3m.net2.handlers.Wrapper(uriPattern, listener));
		}



		public getHandler(context:Context):kr3m.net2.handlers.Abstract
		{
			var bestOffset = -1;
			var bestLength = 0;
			var uri = context.getCurrentUri();
			for (var i = 0; i < this.handlers.length; ++i)
			{
				var matches = this.handlers[i].uriPattern.exec(uri);
				if (matches && matches[0].length > bestLength)
				{
					if (this.handlers[i].accepts(context))
					{
						bestLength = matches[0].length;
						bestOffset = i;
					}
				}
			}
			return this.handlers[bestOffset];
		}



		protected setupContext(
			request:any,
			response:any,
			callback:CB<Context>):void
		{
			var context = new this.contextClass(
				request,
				response,
				this.config,
				this.defaultRouter,
				this.defaultLocalization,
				this.defaultSessionManager);

			context.documentRoot = this.config.documentRoot;
			callback(context);
		}



		protected handleRequest(request:any, response:any):void
		{
			this.setupContext(request, response, (context) =>
			{
				if (this.config.forceHttps && !context.request.isSecure())
				{
					var newLocation = context.request.getLocation();
					newLocation = newLocation.replace(/^http\:/i, "https:");
					return context.response.redirect(newLocation);
				}

				context.router.route(context, () =>
				{
					var lastHandler:kr3m.net2.handlers.Abstract;
					var retryCount = 0;
					kr3m.async.Loop.loop((next) =>
					{
						context.setRedirectHandler(next);
						context.router.reroute(context, () =>
						{
							var handler = this.getHandler(context);
							if (!handler)
							{
//# DEBUG
								logWarning("no handler found for uri", context.getCurrentUri());
//# /DEBUG
								return context.flush(404);
							}

							retryCount = handler == lastHandler ? retryCount + 1 : 0;
							if (retryCount > 20)
							{
//# DEBUG
								logWarning("handler is stuck in endless error loop for uri", context.getCurrentUri());
//# /DEBUG
								return context.flush(404);
							}

							handler.handle(context);
						});
					});
				});
			});
		}



		protected runWorker(callback:Callback):void
		{
			log("starting AppServer worker W" + ("00" + clusterLib.worker.id).slice(-3));

			var listener = this.handleRequest.bind(this);

			if (this.config.http)
				this.httpServer = new HttpServer(this.config.http, listener);

			if (this.config.https)
				this.httpsServer = new HttpsServer(this.config.https, listener);

			this.flags.set("worker");
			callback();
		}



		/*
			A convenience method to run a simple AppServer with our default
			setup:
				- FileSystem handler for asset files in the document root
				- Fragment handler for html files in the document root
				- Status handler
				- Simple localization using the language files in the document root
				- MySQL-Database if configured in the config.json file
				- MySQL-based SessionManager if MySQL-database is available
		*/
		public initWithDefaults(
			options?:{noHandlers?:boolean},
			callback?:CB<{db?:kr3m.db.MySqlDb}>):void
		{
			options = options || {};
			this.flags.onceSet("config", () =>
			{
				if (this.config.mysql)
				{
					var dbConfig = kr3m.util.Util.mergeAssoc(new kr3m.db.MySqlDbConfig(), this.config.mysql);
					var db = new kr3m.db.MySqlDb(dbConfig);
					this.defaultSessionManager = new kr3m.net2.sessionmanagers.MySql(db);
					this.flags.set("sessions", "mySql");
				}

				if (clusterLib.isMaster)
					return callback && callback({db : db});

				if (!options.noHandlers)
				{
					this.addHandler(new kr3m.net2.handlers.FileSystem());
					this.addHandler(new kr3m.net2.handlers.Fragment());
					this.addHandler(new kr3m.net2.handlers.Relay());
					this.addHandler(new kr3m.net2.handlers.Status());
					this.flags.set("handlers");
				}

				callback && callback({db : db});
			});
		}
	}
}

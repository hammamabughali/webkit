/// <reference path="../async/join.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../constants.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../mulproc/cluster.ts"/>
/// <reference path="../mulproc/functions.ts"/>
/// <reference path="../net/appserverauth.ts"/>
/// <reference path="../net/appserverconfig.ts"/>
/// <reference path="../net/mimetypes.ts"/>
/// <reference path="../net/requestcontext.ts"/>
/// <reference path="../net/sessionmanager.ts"/>
/// <reference path="../net/sessionmanagers/memory.ts"/>
/// <reference path="../net/subserver2.ts"/>
/// <reference path="../net/subservers/files/fileserver.ts"/>
/// <reference path="../net/subservers/files/folderserver.ts"/>
/// <reference path="../net/subservers/wrapper.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/util.ts"/>



//# DEPRECATED: kr3m.net.AppServer is deprecated. Please use kr3m.net2.AppServer instead.
module kr3m.net
{
	/*
		Diese Klasse stellt die Grundlagen eines Webservers zur Verfügung.
		Insbesondere ist das ein http-Server und ein rpc-Server für AJAX-
		Aufrufe aus Clients.
	*/
	export class AppServer
	{
		public config:AppServerConfig;

		private httpServer:any;
		private httpsServer:any;

		private subServers:any[] = [];
		private authentications:AppServerAuth[] = [];

		protected sessionManager:SessionManager;

		protected cluster:kr3m.mulproc.Cluster;
		protected isShuttingDown = false;

		public accessControlAllowOrigin:string; // falls dieser Wert gesetzt wird, wird ein entsprechender Header in jeder Antwort bei jedem Request zurück geschickt



		constructor(config:AppServerConfig)
		{
			kr3m.mulproc.adjustLog();

			if (!config.port)
				config.port = 80;

			if (!config.documentRoot)
				config.documentRoot = "./";

			process.on("uncaughtException", this.onUncaughtException.bind(this));

			this.config = config;
			this.sessionManager = new kr3m.net.sessionmanagers.Memory();

			this.register(new kr3m.net.subservers.files.FolderServer());
			this.register(new kr3m.net.subservers.files.FileServer());
		}



		public getSessionManager():SessionManager
		{
			return this.sessionManager;
		}



		protected onUncaughtException(err:Error):void
		{
			logError(err["stack"]);
			logError("[SERVER TERMINATED]");
			process.exit(1);
		}



		/*
			Registriert einen SubServer2 oder eine HandleFunction für die Bearbeitung
			von HTTP-Requests, deren angefrage Resource-URI uriPattern entspricht.
			Wenn uriPattern ein String ist, werden alle Anfragen, deren Resource-URI
			genau gleich dem String ist an den SubServer2 / die HandleFunction geschickt,
			wenn uriPattern ein regulärer Ausdruck ist werden alle Anfragen, die diesen
			Ausdruck erfüllen an den SubServer2 / die HandleFunction geschickt. Ist
			subOrFunc ein SubServer2, muss dieser die handleRequest-Methode überschreiben
			um sich um Anfragen zu kümmern. Ist subOrFunc eine HandleFunction, wird
			intern ein SubServer2-Wrapper erstellt, der bei einem eingehenden Request
			einfach nur die HandleFunction aufruft. Die HandleFunction bzw. die
			handleRequest-Methode des SubServer2 bekommt als Parameter den Context des
			HTTP-Requests und eine callback Methode übergeben. Es ist die Aufgabe der
			HandleFunction / Methode, sich darum zu kümmern, dass die callback-Methode
			einmalig aufgerufen wird, und zwar mit true als Parameter, wenn sich die
			HandleFunction als verantwortlich für die Anfrage betrachtet und mit false
			als Parameter, wenn nicht. Außerdem ist die HandleFunction dafür verantwortlich,
			das context.response Objekt zu befüllen und letztendlich mit context.flushResponse
			oder einer der context.returnXXX Methoden eine Antwort an den Client zu schicken.
		*/
		public register(
			subOrFunc:SubServer2|HandleFunction,
			uriPattern:RegExp|string = /^.*$/):void
		{
			var sub = (subOrFunc instanceof SubServer2) ? <SubServer2> subOrFunc : new kr3m.net.subservers.Wrapper(<HandleFunction> subOrFunc);
			sub.setAppServer(this);
			this.subServers.push({uriPattern : uriPattern, sub : sub});
		}



		/*
			Etwas einfachere (und unflexiblere) Variante von register. Es werden zwei
			Parameter erwartet: das uriPattern, das für den Vergleich mit der
			Resource-URI von HTTP-Anfragen verwendet wird und eine listener-Funktion,
			die aufgerufen wird, wenn ein Request mit dem entsprechenden Resource-URI
			ankommt. Im Gegensatz zu register wird der Listener-Funktion kein callback
			übergeben - es wird davon ausgegangen, dass sich die Funktion um alle
			Anfragen, die ihrem uriPattern entsprechen kümmert.
		*/
		public registerFix(uriPattern:RegExp|string, listener:(context:RequestContext) => void):void
		{
			var sub = new kr3m.net.subservers.Wrapper((context:RequestContext, callback:(wasHandled:boolean) => void) =>
			{
				callback(true);
				listener(context);
			});
			sub.setAppServer(this);
			this.subServers.push({uriPattern : uriPattern, sub : sub});
		}



		/*
			Entfernt alle registrierten SubServer / HandleFunctions. Wird nicht
			irgendein verantwortlicher Objekt mit register oder registerFix
			hinzugefügt, wird der Server alle HTTP-Anfragen mit einem 404 Fehler
			beantworten.
		*/
		public unregisterAll():void
		{
			for (var i = 0; i < this.subServers.length; ++i)
				this.subServers[i].sub.setAppServer(null);

			this.subServers = [];
		}



		public getBaseUrl():string
		{
			return this.config.baseUrl;
		}



		public getSubServersForUri(uri:string):SubServer2[]
		{
			var subs:SubServer2[] = [];
			for (var i = this.subServers.length - 1; i >= 0; --i)
			{
				var uniPattern = this.subServers[i].uriPattern;
				if (typeof uniPattern == "string" && uniPattern == uri)
					subs.push(this.subServers[i].sub);
				if (uniPattern instanceof RegExp && uniPattern.test(uri))
					subs.push(this.subServers[i].sub);
			}
			return subs;
		}



		protected handleBySubServer(
			context:RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			var subs = this.getSubServersForUri(context.uri);
			kr3m.async.Loop.forEach(subs, (sub, next) =>
			{
				sub.handleRequest(context, (wasHandled) =>
				{
					if (wasHandled)
						return callback(true);

					next();
				});
			}, () => callback(false));
		}



		/*
			Abgeleitete AppServer-Klassen können diese Methode überschreiben, um den
			Zugriff auf belibige Dateien und Resourcen je nach Bedarf zu erlauben oder
			zu unterbinden. Mit Hilfe der Daten aus dem gegebenen context (Session, uri,
			uriResourcePath usw.) kann entschieden werden, ob ein User ein bestimmtes
			Objekt runterladen darf oder nicht (einfach callback mit false oder true
			aufrufen).
		*/
		protected mayAccess(
			context:RequestContext,
			callback:(may:boolean) => void):void
		{
			// diese Methode in abgeleiteten Klassen überschreiben
			callback(true);
		}



		/*
			Setzt einen Passwortschutz für bestimmte Resourcen. Wenn die URI einer
			Resource von uriPattern erkannt wird, werden die Zugangsdaten user und
			password benötigt, um sie herunterladen zu können. Es wird die normale
			HTTP Authentication verwendet.
			realm ist ein Name für einen "Bereich" auf dem Server, dessen Seiten
			sich die gleichen Zugangsdaten teilen. Verschiedene Bereiche auf dem
			Server können unterschiedliche Zugangsdaten haben, wenn sie verschiedene
			realms haben. Der entsprechende realm wird dann auch im Browser angezeigt.
		*/
		public setAuthentication(
			uriPattern:RegExp,
			user:string,
			password:string,
			realm:string = "Access denied!"):void
		{
			var auth = new AppServerAuth(uriPattern, user, password, realm);
			for (var i = 0; i < this.authentications.length; ++i)
			{
				if (this.authentications[i].equals(auth))
				{
					this.authentications[i] = auth;
					return;
				}
			}
			this.authentications.push(auth);
		}



		private hasAuth(
			context:RequestContext,
			callback:(hasAuth:boolean, realm?:string) => void):void
		{
			var authData = "";
			if (typeof context.request.headers.authorization != "undefined")
			{
				var auth = <string> context.request.headers.authorization;
				var authDataBase64 = auth.substring(5);
				authData = decodeBase64EncodedString(authDataBase64);
			}

			for (var i = 0; i < this.authentications.length; ++i)
			{
				if (this.authentications[i].appliesTo(context.uri))
				{
					if (!this.authentications[i].matches(authData))
						return callback(false, this.authentications[i].getRealm());
				}
			}
			callback(true);
		}



		/*
			Diese Methode in abgeleiteten Klassen überschreiben um
			die Fehlermeldung bei HTTP Fehlern zu verändern.
		*/
		public getErrorContent(
			context:RequestContext, errorCode:number,
			callback:(content:string, mimeType?:string) => void):void
		{
			callback(errorCode + " error\n", "text/plain; charset=utf-8");
		}



		public getUrlFromRequest(request:any):string
		{
			var url = decodeURIComponent(urlLib.parse(request.url).pathname);
			url = url.replace(/\/\/+/g, "/");
			return url;
		}



		/*
			Diese Methode bestimmt, welcher lokale Pfad einer gegebenen uri
			entspricht. Einfach in einer abgeleiteten Klasse überschreiben um
			das Verhalten zu ändern, z.B. um mehrere DocumentRoot Verzeichnisse
			zu haben oder eine Art mod_rewrite zu realisieren.
		*/
		public getResourcePathFromUri(uri:string):string
		{
			uri = kr3m.util.StringEx.getBefore(uri, "#");
			uri = kr3m.util.StringEx.getBefore(uri, "?");
			return pathLib.join(this.config.documentRoot, uri);
		}



		protected prepareSession(session:Session):void
		{
			// wird in abgeleiteten Klassen überschrieben
		}



		protected handleRequestContext(
			context:RequestContext):void
		{
			if (this.accessControlAllowOrigin)
				context.setResponseHeader("Access-Control-Allow-Origin", this.accessControlAllowOrigin);

			var request = context["request"];

			this.hasAuth(context, (hasAuth, realm) =>
			{
				if (!hasAuth)
					return context.return401(realm);

				this.mayAccess(context, (may) =>
				{
					if (!may)
						return context.return403();

					this.handleBySubServer(context, (wasHandled) =>
					{
						if (!wasHandled)
							context.return404();
					});
				});
			});
		}



		protected initSession(
			context:RequestContext,
			callback:Callback):void
		{
			if (context.session)
				return callback();

			this.sessionManager.getFromRequest(context.request, (session) =>
			{
				this.prepareSession(session);
				context.session = session;
				callback();
			});
		}



		protected handleRequest(request:any, response:any):void
		{
			var context = new RequestContext(request, response);
			context.getErrorContent = this.getErrorContent.bind(this, context);
			context.uri = this.getUrlFromRequest(request);
			context.uriResourcePath = this.getResourcePathFromUri(context.uri);

			var subs = this.getSubServersForUri(context.uri);

			kr3m.async.Loop.forEach(subs, (sub, next) =>
			{
				sub.needsSession(context, (needsSession) =>
				{
					if (!needsSession)
						return next();

					this.initSession(context, () =>
					{
						this.handleRequestContext(context);
					});
				});
			}, () => this.handleRequestContext(context));
		}



		private loadBundle(bundlePath:string):string[]
		{
			var content = fsLib.readFileSync(bundlePath, "utf8");
			var lines = content.split("\n");
			var results:string[] = [];
			for (var i = 0; i < lines.length; ++i)
			{
				if (lines[i].indexOf("-----BEGIN CERTIFICATE-----") == 0)
					results.push("");
				results[results.length - 1] += lines[i] + "\n";
			}
			return results;
		}



		private startHttpServer():void
		{
			this.httpServer = httpLib.createServer(this.handleRequest.bind(this)).listen(this.config.port);
			log("HTTP server listening on port " + this.config.port);
		}



		private startHttpsServer():void
		{
			if (!this.config.https
				|| !this.config.https.key
				|| !this.config.https.certificate)
			{
				log("HTTPS disabled");
				return;
			}

			try
			{
				var options:any =
				{
					secureProtocol : "SSLv23_method",
					secureOptions : constantsLib.SSL_OP_NO_SSLv3,
					key : fsLib.readFileSync(this.config.https.key, "utf8"),
					cert : fsLib.readFileSync(this.config.https.certificate, "utf8")
				};
				if (this.config.https.intermediate)
					options.ca = this.loadBundle(this.config.https.intermediate);

				this.httpsServer = httpsLib.createServer(options, this.handleRequest.bind(this)).listen(this.config.https.port);
				log("HTTPS server listening on port " + this.config.https.port);
			}
			catch(e)
			{
				logError(e);
				logError("HTTPS disabled because of invalid config");
			}
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
			if (this.httpsServer)
			{
				join.fork();
				log("HTTPS server shutting down");
				this.httpsServer.close(() =>
				{
					log("HTTPS server shut down");
					join.done();
				});
			}

			if (this.httpServer)
			{
				join.fork();
				log("HTTP server shutting down");
				this.httpServer.close(() =>
				{
					log("HTTP server shut down");
					join.done();
				});
			}

			if (this.cluster)
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



		public isMaster():boolean
		{
			return clusterLib.isMaster;
		}



		/*
			Startet den Server im Cluster- bzw. Multi-Process-Modus
		*/
		public runCluster(workerCount:number = osLib.cpus().length):void
		{
			if (this.cluster)
				return;

			this.cluster = new kr3m.mulproc.Cluster();
			this.cluster.setMaster(() => this.runMaster());
//# LOCALHOST
			this.cluster.registerPersistant("webserver", {count : 2}, () => this.runWorker());
//# /LOCALHOST
//# !LOCALHOST
			this.cluster.registerPersistant("webserver", {count : workerCount}, () => this.runWorker());
//# /!LOCALHOST
			this.cluster.run();
		}



		protected runMaster():void
		{
			// wird von abgeleiteten Klassen überschrieben
		}



		protected runWorker():void
		{
			log("starting AppServer worker " + clusterLib.worker.id);
			this.startHttpServer();
			this.startHttpsServer();
		}



		/*
			Startet den Server im Single-Thread-Modus
		*/
		public run():void
		{
			log("AppServer Version " + kr3m.VERSION);
			this.startHttpServer();
			this.startHttpsServer();
		}
	}
}

/// <reference path="../../async/loop.ts"/>
/// <reference path="../../async/switch.ts"/>
/// <reference path="../../net2/routers/simple.ts"/>
/// <reference path="../../util/file.ts"/>
/// <reference path="../../util/stringex.ts"/>



module kr3m.net2.routers
{
	class HtAccessResolveContext
	{
		public deny = false;
		public documentRoot:string;
		public searched:string[] = [];
		public workset:string[] = [];
		public environment:{[name:string]:string} = {};
		public httpCode = 200;
	}



	class HtAccessContext
	{
		public rewriteEngine = false;
		public rewriteCond = true;
		public rewriteCondOr = false;
		public rewriteLast = false;



		constructor(
			public context:HtAccessResolveContext)
		{
		}
	}



	export class ResolveResult
	{
		public success:boolean;



		constructor(
			public httpCode:number,
			public uri?:string,
			public environment?:{[name:string]:string})
		{
			this.success = httpCode > 199 && httpCode < 300;
		}
	}



	/*
		(Sehr) einfache Annährung an die Funktionalitäten von .htaccess
		Dateien in Apache, u.A. mod_rewrite und co. Eigentlich nur das
		Zeug, das man braucht um einfaches Zend-PHP unter node.js zu
		benutzen.

		Siehe auch:
			http://httpd.apache.org/docs/current/mod/mod_rewrite.html
	*/
	export class HtAccess extends Simple
	{
		public static ignoredCommands = ["#", "addDefaultCharset"];



		protected setEnv(
			context:HtAccessContext,
			params:string,
			callback:Callback):void
		{
			var name = kr3m.util.StringEx.getBefore(params, " ").trim();
			var value = kr3m.util.StringEx.getAfter(params, " ").trim();
			context.context.environment[name] = value;
			callback();
		}



		protected rewriteEngine(
			context:HtAccessContext,
			params:string,
			callback:Callback):void
		{
			context.rewriteEngine = params == "On";
			callback();
		}



		protected deny(
			context:HtAccessContext,
			params:string,
			callback:Callback):void
		{
			context.context.deny = true;
			callback();
		}



		protected resolveCondition(
			context:HtAccessContext,
			condition:string):string
		{
			condition = condition.replace(/\%\{(.+?)\}/g, (total, id) =>
			{
				if (id == "REQUEST_FILENAME")
				{
					var prefix = context.context.searched.join("/");
					var suffix = context.context.workset.join("/");
					if (!suffix)
						return "";

					return context.context.documentRoot + prefix + "/" + suffix;
				}

				logWarning("unknown htaccess condition token", id);
				return total;
			});
			return condition;
		}



		protected rewriteCond(
			context:HtAccessContext,
			params:string,
			callback:Callback):void
		{
			var paramParts = params.split(/\s+/);
			if (context.rewriteCondOr == context.rewriteCond)
			{
				context.rewriteCondOr = paramParts[2] == "[OR]";
				return callback();
			}

			var condition = this.resolveCondition(context, paramParts[0]);
			var fulfilled = false;
			kr3m.async.Switch.byThen(paramParts[1],
			{
				"-d" : (switchDone) =>
				{
					kr3m.util.File.folderExists(condition, (exists) =>
					{
						fulfilled = exists;
						switchDone();
					});
				},
				"-l" : (switchDone) =>
				{
					kr3m.util.File.fileExists(condition, (exists) =>
					{
						fulfilled = exists;
						switchDone();
					});
				}
			}, null, () =>
			{
				if (context.rewriteCondOr)
					context.rewriteCond = context.rewriteCond || fulfilled;
				else
					context.rewriteCond = context.rewriteCond && context.rewriteCondOr;
				context.rewriteCondOr = paramParts[2] == "[OR]";
				callback();
			});
		}



		protected rewriteRule(
			context:HtAccessContext,
			params:string,
			callback:Callback):void
		{
			if (!context.rewriteEngine || context.rewriteLast)
				return callback();

			if (!context.rewriteCond)
			{
				context.rewriteCond = true;
				return callback();
			}

			var resource = context.context.workset.join("/");
			var paramParts = params.split(/\s+/);
			var regex = new RegExp(paramParts[0]);
			if (!regex.test(resource))
				return callback();

			var flags = (paramParts[2] || "[]").toUpperCase().slice(1, -1).split(",").map(f => f.trim());
			for (var i = 0; i < flags.length; ++i)
			{
				if (flags[i] == "L")
					context.rewriteLast = true;

				var matches = flags[i].match(/^R\s*=\s*(\d+)$/);
				if (matches)
					context.context.httpCode = parseInt(matches[1], 10);
			}

			if (paramParts[1] == "-")
				return callback();

			resource = resource.replace(regex, paramParts[1]);
			context.context.workset = resource.split("/").filter((part) => part);
			callback();
		}



		protected handleFile(
			context:HtAccessResolveContext,
			content:string,
			callback:Callback):void
		{
			var lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line);
			var htContext = new HtAccessContext(context);
			kr3m.async.Loop.forEach(lines, (line, next) =>
			{
				var command = kr3m.util.StringEx.getBefore(line, " ").trim();
				command = command.slice(0, 1).toLowerCase() + command.slice(1);
				var params = kr3m.util.StringEx.getAfter(line, " ").trim();

				if (typeof this[command] == "function")
					return this[command](htContext, params, next);

				if (HtAccess.ignoredCommands.indexOf(command) < 0 && command.charAt(0) != "#")
					logWarning("unknown htaccess command", command);

				next();
			}, callback);
		}



		public resolve(
			documentRoot:string,
			uri:string,
			callback:CB<ResolveResult>):void
		{
			var context = new HtAccessResolveContext();
			context.documentRoot = documentRoot;
			context.workset = uri.split("/");
			kr3m.async.Loop.loop((next) =>
			{
				if (context.deny || context.workset.length == 0)
					return callback(new ResolveResult(404));

				context.searched.push(context.workset.shift());
				var current = context.documentRoot + context.searched.join("/");
				this.cache.fileExists(current, (exists) =>
				{
					if (exists)
						return callback(new ResolveResult(context.httpCode, context.searched.join("/"), context.environment));

					kr3m.util.File.folderExists(current, (exists) =>
					{
						if (!exists)
							return callback(new ResolveResult(404));

						this.cache.getTextFile(current + "/.htaccess", (content) =>
						{
							if (!content)
								return next();

							this.handleFile(context, content, next);
						});
					});
				});
			});
		}



		public route(
			context:Context,
			callback:Callback):void
		{
			super.route(context, () =>
			{
				this.resolve(context.documentRoot, context.getCurrentUri(), (resolved) =>
				{
					if (!resolved.success)
						return callback();

					context.setCurrentUri(resolved.uri);
					context.environment = kr3m.util.Util.mergeAssoc(context.environment, resolved.environment);
					callback();
				});
			});
		}
	}
}

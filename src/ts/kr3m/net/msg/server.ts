/// <reference path="../../async/join.ts"/>
/// <reference path="../../async/throttle.ts"/>
/// <reference path="../../net/msg/constants.ts"/>
/// <reference path="../../net/msg/envelope.ts"/>
/// <reference path="../../net/requestcontext.ts"/>
/// <reference path="../../net/subserver2.ts"/>
/// <reference path="../../services/paramshelper.ts"/>
/// <reference path="../../util/class.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/rand.ts"/>



module kr3m.net.msg
{
	export type ServiceFunc = (context:kr3m.net.RequestContext, gatewayId:string, envelope:Envelope, callback?:(status:string, response?:any) => void) => void;



	export class Server extends kr3m.net.SubServer2
	{
		private serviceFuncs:{[name:string]:ServiceFunc} = {};
		private outQueues:{[gatewayId:string]:Envelope[]} = {};
		private gatewayTokens:{[gatewayId:string]:string} = {};

		private discardCount = 0;
		private warningThrottle = new kr3m.async.Throttle(10 * 60 * 1000);
		private errorThrottle = new kr3m.async.Throttle(60 * 1000);



		public registerService(
			name:string,
			func:ServiceFunc):void
		{
			this.serviceFuncs[name] = func;
		}



		/*
			Registriert alle statischen Methoden der Klasse
			clazz als Services unter dem Namen
			"KLASSENNAME.METHODENNAME".
		*/
		public registerServiceClass(clazz:any):void
		{
			var className = kr3m.util.Class.getNameOfClass(clazz);
			for (var i in clazz)
				this.registerService(className + "." + i, clazz[i]);
		}



		/*
			Registriert alle Methoden des Objektes obj
			als Services unter dem Namen
			"KLASSENNAME.METHODENNAME".
		*/
		public registerServiceObject(obj:any):void
		{
			var className = kr3m.util.Class.getClassNameOfInstance(obj);
			for (var i in obj)
			{
				if (typeof obj[i] == "function")
					this.registerService(className + "." + i, obj[i].bind(obj));
			}
		}



		private push(gatewayId:string, envelope:Envelope):void
		{
			var queue = this.outQueues[gatewayId];
			if (!queue)
			{
				queue = [];
				this.outQueues[gatewayId] = queue;
			}

			if (queue.length > MESSAGE_LIMIT * 5)
			{
				++this.discardCount;
				this.errorThrottle.call(() =>
				{
					logError("message server flood error", this.discardCount, "messages discarded");
					this.discardCount = 0;
				});
			}

			queue.push(envelope);

			if (queue.length > MESSAGE_LIMIT * 2)
				this.warningThrottle.call(() => logWarning("message server flood warning"))
		}



		public send(gatewayId:string, msgName:string, message:any):void
		{
			var envelope = new Envelope();
			envelope.name = msgName;
			envelope.content = message;
			this.push(gatewayId, envelope);
		}



		public broadcast(msgName:string, msg:any):void
		{
			for (var i in this.outQueues)
				this.send(i, msgName, msg);
		}



		protected handleUnknownMessage(
			context:kr3m.net.RequestContext,
			gatewayId:string, message:Envelope,
			callback?:(status:string, response?:any) => void):void
		{
			// wird in abgeleiteten Klassen überschrieben
//# DEBUG
			logWarning("unknown message", message);
//# /DEBUG
		}



		private getService(name:string):ServiceFunc
		{
			return this.serviceFuncs[name] || this.handleUnknownMessage.bind(this);
		}



		protected handleMessage(
			context:kr3m.net.RequestContext,
			gatewayId:string, envelope:Envelope,
			callback:() => void):void
		{
//# VERBOSE
			log("==>", envelope.name, envelope.content);
//# /VERBOSE
			var service = this.getService(envelope.name);
			service(context, gatewayId, envelope, (status:string, response?:any) =>
			{
				envelope.status = status;
				envelope.content = response;
				this.push(gatewayId, envelope);
				if (envelope.callbackId)
					callback();
			});
			if (!envelope.callbackId)
				callback();
		}



		private getReplies(gatewayId:string):Envelope[]
		{
			var queue = this.outQueues[gatewayId];
			if (!queue)
				return [];

			var replies = queue.slice(0, MESSAGE_LIMIT);
			queue = queue.slice(MESSAGE_LIMIT);
			this.outQueues[gatewayId] = queue;
//# VERBOSE
			for (var i = 0; i < replies.length; ++i)
				log("<==", replies[i].name, replies[i].content);
//# /VERBOSE
			return replies;
		}



		private verifyToken(
			gatewayId:string, token:string,
			callback:(isVerified:boolean) => void):void
		{
			if (token == "undefined")
				token = undefined;

			if (token && this.gatewayTokens[gatewayId] == token)
				return callback(true);

			if (token && this.gatewayTokens[gatewayId] && token != this.gatewayTokens[gatewayId])
				return callback(false);

			kr3m.util.Rand.getSecureString(32, kr3m.util.Rand.CHARS_ALPHA_NUM, (token:string) =>
			{
				this.gatewayTokens[gatewayId] = token;
				this.send(gatewayId, "__gwt", token);
				callback(true);
			});
		}



		public handleRequest(
			context:kr3m.net.RequestContext,
			callback:(wasHandled:boolean) => void):void
		{
			context.getPostValues((values:{[name:string]:string}) =>
			{
				var gatewayId = values["gatewayId"];
				if (!gatewayId)
				{
					context.setResponseContent("[]");
					context.flushResponse(500);
					return;
				}

				var token = values["token"];
				this.verifyToken(gatewayId, token, (isVerified:boolean) =>
				{
					if (!isVerified)
					{
						context.setResponseContent("[]");
						context.flushResponse(500);
						return;
					}

					var messages = <Envelope[]> kr3m.util.Json.decode(decodeURIComponent(values["messages"]));
					if (!messages)
					{
						context.setResponseContent("[]");
						context.flushResponse(500);
						return;
					}

					var join = new kr3m.async.Join();

					var timerId = setTimeout(() =>
					{
						timerId = null;
						join.clearCallbacks(true);
					}, 100);

					for (var i = 0; i < messages.length; ++i)
					{
						var helper = new kr3m.services.ParamsHelper(messages[i]);
						if (!helper.validateVO(Envelope))
							logError("invalid message", messages[i]);
						else
							this.handleMessage(context, gatewayId, messages[i], join.getCallback());
					}
					join.addCallback(() =>
					{
						if (timerId)
							clearTimeout(timerId);

						var replies = this.getReplies(gatewayId);
						var encoded = kr3m.util.Json.encode(replies);
						context.setResponseContent(encoded);
						context.flushResponse(200);
					});
				});
			});
			callback(true);
		}
	}
}

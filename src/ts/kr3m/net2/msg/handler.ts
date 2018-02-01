/// <reference path="../../async/join.ts"/>
/// <reference path="../../net2/handlers/ajaxgateway.ts"/>
/// <reference path="../../net2/msg/envelope.ts"/>



module kr3m.net2.msg
{
	export class Handler extends kr3m.net2.handlers.AjaxGateway
	{
		public cookieValueName = "__pendingMessages";



		private getIncoming(
			context:Context,
			callback:CB<Envelope[]>):void
		{
			context.request.getContent((content) =>
			{
				var match = content.match(/payload=([^&]*)/);
				if (!match)
					return context.flush(500);

				var incoming = kr3m.util.Json.decode(decodeURIComponent(match[1]));
				callback(incoming);
			});
		}



		public send(
			context:Context,
			serviceName:string,
			payload:any,
			callback?:StatusCallback):void
		{
			context.need({session : true}, () =>
			{
				var envelope = new kr3m.net2.msg.Envelope();
				envelope.serviceName = serviceName;
				envelope.payload = payload;

				var pending = context.session.getValue(this.cookieValueName) || [];
				pending.push(envelope);
				context.session.setValue(this.cookieValueName, pending);
				callback && callback(kr3m.SUCCESS);
			}, () =>
			{
				logError("could not access user session");
				callback && callback(kr3m.ERROR_INTERNAL);
			});
		}



		protected getPending(
			context:Context,
			callback:CB<Envelope[]>):void
		{
			context.need({session : true}, () =>
			{
				var pending = context.session.getValue(this.cookieValueName);
				if (!pending || !pending.length)
					return callback([]);

				context.session.deleteValue(this.cookieValueName);
				callback(pending);
			}, () =>
			{
				logError("could not access user session");
				callback([]);
			});
		}



		public handle(context:Context):void
		{
			context.response.disableBrowserCaching();
			context.need({session : true}, () =>
			{
				this.getIncoming(context, (incoming) =>
				{
					var outgoing:Envelope[] = [];

					var join = new kr3m.async.Join();
					this.getPending(context, join.getCallback("__pending"));

					for (var i = 0; i < incoming.length; ++i)
					{
						var handler = this.handlers[incoming[i].serviceName];
						if (!handler)
						{
							if (incoming[i].callbackId)
							{
								incoming[i].status = kr3m.ERROR_NOT_SUPPORTED;
								incoming[i].payload = undefined;
								outgoing.push(incoming[i]);
							}
						}
						else
						{
							if (incoming[i].callbackId)
								handler(context, incoming[i].payload, join.getCallback(i));
							else
								handler(context, incoming[i].payload, response => {});
						}
					}

					join.addCallback(() =>
					{
						outgoing.push(...join.getResult("__pending"));
						for (var i = 0; i < incoming.length; ++i)
						{
							if (incoming[i].callbackId)
							{
								incoming[i].payload = join.getResult(i);
								incoming[i].status = kr3m.SUCCESS;
								outgoing.push(incoming[i]);
							}
						}

						var json = kr3m.util.Json.encode(outgoing);
						context.flush(200, json, "text/json; charset=utf-8");
					});
				});
			}, () =>
			{
				logError("could not access user session");
				context.flush(500);
			});
		}
	}
}

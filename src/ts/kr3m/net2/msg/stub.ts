/// <reference path="../../model/eventdispatcher.ts"/>
/// <reference path="../../net2/msg/envelope.ts"/>
/// <reference path="../../net2/msg/gateway.ts"/>
/// <reference path="../../net2/msg/types.ts"/>

//# !CLIENT
//# ERROR: kr3m.net2.handlers.msg.Stub is for use in the client only - don't use it in the server
//# /!CLIENT



module kr3m.net2.msg
{
	export class Stub extends kr3m.model.EventDispatcher
	{
		constructor(
			private gateway:Gateway = Gateway.getInstance())
		{
			super();
			gateway.addStub(this);
		}



		public callService(
			serviceName:string,
			payload:any,
			callback?:ResultCallback):ServiceCall
		{
			var envelope = new Envelope();
			envelope.serviceName = serviceName;
			envelope.payload = payload;

			if (callback)
			{
				var cancelled = false;
				this.gateway.send(envelope, (status, payload) =>
				{
					if (!cancelled)
						callback(status, payload);
				});
				return {cancel : () => cancelled = true};
			}
			else
			{
				this.gateway.send(envelope);
				return {cancel : () => {}};
			}
		}
	}
}

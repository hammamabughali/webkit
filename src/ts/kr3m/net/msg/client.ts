/// <reference path="../../net/msg/envelope.ts"/>
/// <reference path="../../net/msg/gateway.ts"/>
/// <reference path="../../util/ajax.ts"/>



module kr3m.net.msg
{
	export type Listener<M> = (message:M) => void;



	export class Client
	{
		private static freeId = 0;
		private static gateways:{[gatewayUrl:string]:Gateway} = {};

		private id:number;
		private gatewayUrl:string;
		private freeCallbackId = 0;
		private callbacks:{[callbackId:number]:(response:any, status?:string) => void} = {};
		private listeners:{[msgName:string]:Listener<any>[]} = {};



		constructor(gatewayUrl:string)
		{
			this.id = ++Client.freeId;
			this.gatewayUrl = gatewayUrl;
		}



		private gw():Gateway
		{
			var gateway = Client.gateways[this.gatewayUrl];
			if (!gateway)
			{
				gateway = new Gateway(this.gatewayUrl);
				Client.gateways[this.gatewayUrl] = gateway;
			}
			gateway.register(this.id, this);
			return gateway;
		}



		public expectMessages():void
		{
			this.gw().expectMessages();
		}



		public on(msgName:string, listener:Listener<any>):void
		{
			var listeners = this.listeners[msgName];
			if (!listeners)
			{
				listeners = [];
				this.listeners[msgName] = listeners;
			}
			listeners.push(listener);
		}



		public off(msgName:string, listener?:Listener<any>):void
		{
			var listeners = this.listeners[msgName];
			if (listeners)
			{
				if (listener)
					kr3m.util.Util.remove(listeners, listener);
				else
					this.listeners[msgName] = [];
			}
		}



		public handleUnknown(message:Envelope):boolean
		{
			var listeners = this.listeners[message.name];
			if (!listeners || listeners.length == 0)
				return false;

			for (var i = 0; i < listeners.length; ++i)
				listeners[i](message.content);
			return true;
		}



		public handleReply(reply:Envelope):void
		{
//# VERBOSE
			kr3m.util.Log.log("==> " + reply.name);
			kr3m.util.Log.log(reply.status, reply.content);
//# /VERBOSE
			if (reply.callbackId)
			{
				var callback = this.callbacks[reply.callbackId];
				if (callback)
				{
					delete this.callbacks[reply.callbackId];
					return callback(reply.content, reply.status);
				}
			}
			if (!this.handleUnknown(reply))
				logDebug("got unexpected message", reply);
		}



		public send(
			msgName:string, content:any,
			callback?:(response:any, status?:string) => void):void
		{
			var envelope = new Envelope();
			envelope.name = msgName;
			envelope.content = content;
			envelope.clientId = this.id;
			if (callback)
			{
				envelope.callbackId = ++this.freeCallbackId;
				this.callbacks[envelope.callbackId] = callback;
			}
//# VERBOSE
			kr3m.util.Log.log("<== " + msgName);
			kr3m.util.Log.log(content);
//# /VERBOSE
			this.gw().send(envelope);
		}
	}
}

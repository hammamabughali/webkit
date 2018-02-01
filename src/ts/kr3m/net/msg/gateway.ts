/// <reference path="../../net/msg/constants.ts"/>
/// <reference path="../../net/msg/envelope.ts"/>
/// <reference path="../../util/ajax.ts"/>
/// <reference path="../../util/json.ts"/>
/// <reference path="../../util/rand.ts"/>



module kr3m.net.msg
{
	export class Gateway
	{
		private id:string;
		private token:string;
		private gatewayUrl:string;

		private outQueue:Envelope[] = [];
		private inQueue:Envelope[] = [];

		private transmitting = false;
		private delay = msg.DELAY_START;
		private timerId:any;

		private clients:{[clientId:number]:Client} = {};



		constructor(gatewayUrl:string)
		{
			this.gatewayUrl = gatewayUrl;
			this.id = kr3m.util.Rand.getString(16) + Date.now();
		}



		public register(clientId:number, client:Client):void
		{
			this.clients[clientId] = client;
		}



		public expectMessages():void
		{
			this.delay = DELAY_MIN;
		}



		private handleReply(reply:Envelope):void
		{
			if (reply.name == "__gwt")
			{
				this.token = reply.content;
				return;
			}

			if (reply.clientId)
			{
				var client = this.clients[reply.clientId];
				if (client)
					return client.handleReply(reply);
			}

			for (var i in this.clients)
			{
				if (this.clients[i].handleUnknown(reply))
					return;
			}
			kr3m.util.Log.logDebug("unhandled message", reply);
		}



		private transmit():void
		{
			if (this.transmitting)
				return;

			this.transmitting = true;

			if (this.timerId)
			{
				clearTimeout(this.timerId);
				this.timerId = null;
			}

			setTimeout(() =>
			{
				var messages = this.outQueue.slice(0, MESSAGE_LIMIT);
				this.outQueue = this.outQueue.slice(MESSAGE_LIMIT);
				var encoded = kr3m.util.Json.encode(messages);

				kr3m.util.Ajax.postCall(this.gatewayUrl, (replies:Envelope[]) =>
				{
					this.transmitting = false;

					if (replies.length == MESSAGE_LIMIT)
					{
						setTimeout(() => this.transmit(), 0);
					}
					else if (messages.length == 0 && replies.length > 0)
					{
						this.delay = Math.max(Math.floor(this.delay * DELAY_FACTOR), DELAY_MIN);
						this.timerId = setTimeout(() => this.transmit(), this.delay);
					}
					else
					{
						this.delay = Math.min(this.delay + DELAY_INCREMENT, DELAY_MAX);
						this.timerId = setTimeout(() => this.transmit(), this.delay);
					}

					for (var i = 0; i < replies.length; ++i)
						this.handleReply(replies[i]);
				}, {gatewayId : this.id, token : this.token, messages : encoded});
			}, 0);
		}



		public send(envelope:Envelope):void
		{
			this.outQueue.push(envelope);
			this.transmit();
		}
	}
}

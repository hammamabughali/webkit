/// <reference path="../../constants.ts"/>
/// <reference path="../../net2/msg/envelope.ts"/>
/// <reference path="../../net2/msg/types.ts"/>
/// <reference path="../../services/ajaxstub.ts"/>

//# !CLIENT
//# ERROR: kr3m.net2.handlers.msg.Gateway is for use in the client only - don't use it in the server
//# /!CLIENT



module kr3m.net2.msg
{
	export class Gateway
	{
		private static instance:Gateway;

		private ajaxStub:kr3m.services.AjaxStub;
		private stubs:Stub[] = [];
		private isTransfering = false;
		private queue:Envelope[] = [];
		private freeCallbackId = 1;
		private callbacks:{[id:number]:ResultCallback} = {};

		public delayFasterFactor = 0.5;
		public delayFasterStep = 0;
		public delaySlowerFactor = 1;
		public delaySlowerStep = 100;
		public delayMax = 10000;
		public delayMin = 100;
		public delay = 1000;
		public messageLimit = 10;



		public static getInstance():Gateway
		{
			if (!Gateway.instance)
				Gateway.instance = new Gateway();
			return Gateway.instance;
		}



		constructor()
		{
			this.ajaxStub = new kr3m.services.AjaxStub();
		}



		private adjustDelay(didSomething:boolean):void
		{
			if (didSomething)
				this.delay = this.delay * this.delayFasterFactor + this.delayFasterStep;
			else
				this.delay = this.delay * this.delaySlowerFactor + this.delaySlowerStep;

			this.delay = Math.min(this.delayMax, Math.max(this.delay, this.delayMin));
		}



		private distribute(envelope:Envelope):void
		{
			if (envelope.callbackId && this.callbacks[envelope.callbackId])
			{
				var callback = this.callbacks[envelope.callbackId];
				delete this.callbacks[envelope.callbackId];
				return callback(envelope.payload, envelope.status || kr3m.SUCCESS);
			}

			for (var i = 0; i < this.stubs.length; ++i)
				this.stubs[i].dispatch(envelope.serviceName, envelope.payload);
		}



		private transfer():void
		{
			if (this.isTransfering)
				return;

			this.isTransfering = true;

			var incoming = this.queue.slice(0, this.messageLimit);
			this.queue = this.queue.slice(this.messageLimit);

			var didSomething = incoming.length > 0;
			this.ajaxStub.callService("", incoming, (outgoing:Envelope[]) =>
			{
				didSomething = didSomething || outgoing.length > 0;

				for (var i = 0; i < outgoing.length; ++i)
					this.distribute(outgoing[i]);

				this.adjustDelay(didSomething);
				this.isTransfering = false;
				var delay = this.queue.length > 0 ? 1 : this.delay;
				setTimeout(() => this.transfer(), delay);
			});
		}



		public addStub(stub:Stub):void
		{
			this.stubs.push(stub);
			this.transfer();
		}



		public send(
			envelope:Envelope,
			callback?:ResultCallback):void
		{
			if (callback)
			{
				envelope.callbackId = this.freeCallbackId++;
				this.callbacks[envelope.callbackId] = callback;
			}
			this.queue.push(envelope);
			this.transfer();
		}
	}
}

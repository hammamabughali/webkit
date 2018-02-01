/// <reference path="../../lib/external/jquery/jquery.d.ts"/>
/// <reference path="../../net/socket/servicecall.ts"/>
/// <reference path="../../net/socket/servicelistener.ts"/>



interface Socket
{
	on(type:string, handler:(data:any) => void);
	emit(type:string, data:any):void;
}



declare var io:
{
	connect:(url:string) => Socket;
}



module kr3m.net.socket
{
	export class Connection
	{
		public host:string;
		public port:number;
		public socket:kr3m.net.socket.Socket;

		private tmpCalls:kr3m.net.socket.ServiceCall[];
		private tmpListeners:kr3m.net.socket.ServiceListener[];



		constructor(host:string = "localhost", port:number = 80)
		{
			this.host = host;
			this.port = port;
			this.socket = null;
			this.tmpCalls = [];
			this.tmpListeners = [];
		}



		public connect(callback:() => void):void
		{
			$.getScript("http://" + this.host + ":" + String(this.port) + "/socket.io/socket.io.js", (data:any, textStatus:string, jqxhr:any) =>
			{
				this.onSocketInit(callback);
			});
		}



		private onSocketInit(callback:() => void):void
		{
			this.socket = io.connect("http://" + this.host + ":" + String(this.port));
			this.socket.on("init", (data:any) =>
			{
				this.executeServiceQueue();
				callback();
			});
		}



		private executeServiceQueue():void
		{
			var listener;
			while (this.tmpListeners.length > 0)
			{
				listener = this.tmpListeners.shift();
				this.socket.on(listener.type, listener.listener);
			}

			var call;
			while (this.tmpCalls.length)
			{
				call = this.tmpCalls.shift();
				this.socket.emit("callService", call);
			}
		}



		public callService(
			className:string,
			methodName:string,
			...params:any[]):void
		{
			var call = new kr3m.net.socket.ServiceCall(className, methodName, params);
			if (this.socket === null)
			{
				this.tmpCalls.push(call);
				return;
			}
			this.socket.emit("callService", call);
		}



		public on(type:string, callback:(data:any) => void):Socket
		{
			if (this.socket === null)
			{
				this.tmpListeners.push(new ServiceListener(type, callback));
				return null;
			}
			return this.socket.on(type, callback);
		}
	}
}

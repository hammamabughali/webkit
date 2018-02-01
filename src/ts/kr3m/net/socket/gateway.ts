/// <reference path="../../lib/external/socket.io/socket.io.d.ts"/>
/// <reference path="../../util/class.ts"/>
/// <reference path="../../util/net/socket/service.ts"/>



module kr3m.net.socket
{
	export class Gateway
	{
		public io:kr3m.net.socket.SocketManager;
		private services:Object;

		public onClientDisconnect:(socketId:string) => void;



		constructor(port:number)
		{
			this.io = require("socket.io").listen(port);
			this.io.set("log level", 0);
			this.io.set("transports", ["websocket", "flashsocket", "htmlfile", "xhr-polling", "jsonp-polling"]);

			this.services = {};

			this.init();

			this.io.on("connection", (socket:Socket):void => { this.onConnect(socket); });
		}



		public init():void
		{
		}



		public addService(serviceClass:any):void
		{
			this.services[util.Class.getNameOfClass(serviceClass)] = serviceClass;
		}



		private onConnect(socket:Socket):void
		{
			socket.emit("init");
			socket.on("callService", (data:any) => { this.callServiceMethod(socket, data); });
			socket.on("disconnect", (data:any) => { if (this.onClientDisconnect && socket && socket.id) this.onClientDisconnect(socket.id); });
		}



		private callServiceMethod(sender:Socket, data:any):void
		{
			if (!sender || !data || !data.className || !data.methodName)
				return;

			var service = util.Class.createInstanceOfClass(this.services[data.className]);

			if (!service || !service[data.methodName] || typeof service[data.methodName] != "function")
				return;

			if (service instanceof kr3m.net.socket.Service)
			{
				service.io = this.io;
				service.sender = sender;
			}

			var method = service[data.methodName];
			if (!data.params)
				data.params = [];

			method.apply(service, data.params);
		}
	}
}

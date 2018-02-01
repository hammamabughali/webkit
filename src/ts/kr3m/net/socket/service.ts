/// <reference path="../../lib/external/socket.io/socket.io.d.ts"/>



module kr3m.net.socket
{
	export class Service
	{
		public io:kr3m.net.socket.SocketManager;
		public sender:kr3m.net.socket.Socket;



		constructor(io:kr3m.net.socket.SocketManager = null, sender:kr3m.net.socket.Socket = null)
		{
			this.io = io;
			this.sender = sender;
		}



		public callMethod(methodName:string, params:any[] = null):any
		{
			if (!this[methodName] || typeof this[methodName] != "function")
				return;

			var method = this[methodName];
			if (params != null)
				params = [];

			return method.apply(this, params);
		}
	}
}

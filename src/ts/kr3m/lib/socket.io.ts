/// <reference path="../lib/external/socket.io/socket.io.d.ts"/>

declare var io:
{
	connect: (url:string) => Socket;
};

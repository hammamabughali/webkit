/// <reference path="../types.ts"/>
/// <reference path="../util/device.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.util
{
	class PMNWrapper
	{
		public origin:string;
		public from:string;
		public to:string;
		public msgId:number;
		public payload:any;
		public callbackId:number;
	}



	/*
		Komfortablere Lösung für PostMessage-Einsatz

		Jede Instanz von PostMessageNode bekommt einen Namen.
		Anschließend kümmert sich PostMessageNode selbst darum, nur
		solche Nachrichten zu bearbeiten, die den gleichen Namen
		haben.
	*/
	export class PostMessageNode
	{
		private static allNodes:{[name:string]:PostMessageNode} = {};
		private static freeMsgId = 1;

		private name:string;
		private hostFilter:string;
		private encode = false;

		private listener:(msg:any, replyCallback:AnyCallback, sourceWindow:Window) => void;
		private freeCallbackId = 1;
		private callbacks:{[id:string]:AnyCallback} = {};



		constructor(
			name:string,
			listener?:(msg:any, replyCallback:AnyCallback, sourceWindow:Window) => void,
			hostFilter = "*")
		{
			var oldNode = PostMessageNode.allNodes[name];
			if (oldNode)
				oldNode.handleMessageEvent = (event:any) => {};

			var device = Device.getInstance();
			this.encode = device.ie && device.ieVersion < 10;

			PostMessageNode.allNodes[name] = this;

			this.name = name;
			this.hostFilter = this.trimOrigin(hostFilter);
			this.listener = listener || (() => {});

			var helper = this.handleMessageEvent.bind(this);

			if (window["attachEvent"])
				window["attachEvent"]("onmessage", helper);
			else if (window.addEventListener)
				window.addEventListener("message", helper, false);
			else
				Log.logError("window object doesn't support neither attachEvent nor addEventListener");
		}



		private trimOrigin(origin:string):string
		{
			return origin.replace(/\/+$/, "");
		}



		private handleMessageEvent(event:any):void
		{
			var origin = this.trimOrigin(event.origin);
			if (this.hostFilter != "*" && this.hostFilter != origin)
				return Log.logVerbose("postmessage doesn't match filter", origin, this.hostFilter, event);

			var wrapper = <PMNWrapper> (this.encode ? Json.decode(event.data) : event.data);
			if (!wrapper || wrapper.to != this.name)
				return;

			try
			{
				var targetWindow = <Window> event.source || window.parent; // IE8&9 Hack
			}
			catch(e)
			{
				var targetWindow = window.parent;
			}
//# VERBOSE
			Log.log(this.name, "<---", wrapper.from, this.encode ? Json.encode(wrapper.payload) : wrapper.payload);
//# /VERBOSE
			if (wrapper.origin == this.name)
			{
				var callback = this.callbacks[wrapper.callbackId];
				if (callback)
				{
					delete this.callbacks[wrapper.callbackId];
					return callback(wrapper.payload);
				}
			}

			if (!wrapper.callbackId)
				return this.listener(wrapper.payload, undefined, targetWindow);

			this.listener(wrapper.payload, (reply) =>
			{
				wrapper.to = wrapper.from;
				wrapper.from = this.name;
				wrapper.payload = reply;
//# VERBOSE
				Log.log(this.name, "--->", wrapper.to, this.encode ? Json.encode(wrapper.payload) : wrapper.payload);
//# /VERBOSE
				try
				{
					targetWindow.postMessage(this.encode ? Json.encode(wrapper) : wrapper, this.hostFilter);
				}
				catch (exception)
				{
					kr3m.util.Log.logWarning("PostMessage could not be sent:", exception);
				}
			}, targetWindow);
		}



		public send(
			toNodeName:string,
			nodeWindow:Window,
			message:any,
			replyCallback?:AnyCallback):void
		{
			var wrapper = new PMNWrapper();
			wrapper.msgId = PostMessageNode.freeMsgId++;
			wrapper.origin = this.name;
			wrapper.to = toNodeName;
			wrapper.from = this.name;
			wrapper.payload = message;

			if (replyCallback)
			{
				wrapper.callbackId = this.freeCallbackId++;
				this.callbacks[wrapper.callbackId] = replyCallback;
			}
//# VERBOSE
			Log.log(this.name, "--->", wrapper.to, this.encode ? Json.encode(wrapper.payload) : wrapper.payload);
//# /VERBOSE
			try
			{
				nodeWindow.postMessage(this.encode ? Json.encode(wrapper) : wrapper, this.hostFilter);
			}
			catch (exception)
			{
				kr3m.util.Log.logWarning("PostMessage could not be sent:", exception);
			}
		}
	}
}

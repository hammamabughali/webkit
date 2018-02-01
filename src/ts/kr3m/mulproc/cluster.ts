/// <reference path="../lib/node.ts"/>
/// <reference path="../mulproc/functions.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/rand.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.mulproc
{
	export type WorkerOptions = {count?:number, staggered?:boolean};



	export interface ClusterMessage
	{
		clusterId:number;
		senderWorkerId:number;
		callbackId?:number;
		targetPersistantType?:string;

		name:string;
		params?:any;
	};



	export type ClusterMessageListener = (message:ClusterMessage, callback?:AnyCallback) => void;



	/*
		Class for easy management of worker processes in an application. There
		are persistant worker processes (that automatically restart after
		crashing) and volatile worker processes (that complete one task and
		then shut down).
	*/
	export class Cluster
	{
		private static freeClusterId = 1;
		private static freeCallbackId = 1;

		private static MSG_BROADCAST = "__BROADCAST";
		private static MSG_CALLBACK = "__CALLBACK";
		private static MSG_FORWARD = "__FORWARD";
		private static MSG_FORWARD_PERSISTANT = "__FORWARD_PERSISTANT";
		private static MSG_PERSISTANTINIT = "__PERSISTANTINIT";
		private static MSG_SHUTDOWN = "__SHUTDOWN";
		private static MSG_VOLATILECALLBACK = "__VOLATILECALLBACK";

		private id:number;
		private masterFunc:Callback;
		private persistantMeta:{[persistantType:string]:{options:WorkerOptions, func:Callback}} = {};
		private persistantWorkerTypes:{[workerId:number]:string} = {};
		private volatileFuncs:{[id:string]:(params:any, callback:AnyCallback) => void} = {};
		private volatileCallbacks:{[volatileType:string]:{callback?:AnyCallback, errorCallback?:StringCallback}} = {};

		private listeners:{[msgName:string]:ClusterMessageListener[]} = {};
		private unknownListeners:ClusterMessageListener[] = [];

		private callbacks:{[id:number]:AnyCallback} = {};

		private running = false;
		private suicide = false;



		constructor()
		{
			this.id = Cluster.freeClusterId++;

			if (clusterLib.isMaster)
				clusterLib.on("message", (worker, msg) => this.handleMessage(msg));
			else
				process.on("message", msg => this.handleMessage(msg));
		}



		private handleMessage(msg:ClusterMessage):void
		{
			if (!msg || !msg.name || msg.clusterId != this.id)
				return;

			if (msg.name == Cluster.MSG_CALLBACK)
				return this.handleCallback(msg);

			this.dispatchMessageEvent(msg);
		}



		private handleCallback(envelope:ClusterMessage):void
		{
			var callback = this.callbacks[envelope.callbackId];
			if (callback)
			{
				delete this.callbacks[envelope.callbackId];
				callback(envelope.params);
			}
		}



		private buildMessage(name:string, params?:any):ClusterMessage
		{
			var msg:ClusterMessage =
			{
				clusterId : this.id,
				senderWorkerId : clusterLib.isMaster ? undefined : clusterLib.worker.id,
				name : name,
				params : params
			};
			return msg;
		}



		public send(msg:ClusterMessage, workerId:number|string, callback:AnyCallback):void;
		public send(msg:ClusterMessage, workerId:number|string):void;
		public send(msg:ClusterMessage, callback:AnyCallback):void;
		public send(msg:ClusterMessage):void;

		public send():void
		{
			var msg = <ClusterMessage> arguments[0];
			var workerId = <number|string> kr3m.util.Util.getFirstOfType(arguments, "number")
				|| kr3m.util.Util.getFirstOfType(arguments, "string");
			var callback = <AnyCallback> kr3m.util.Util.getFirstOfType(arguments, "function");

			if (callback)
			{
				var callbackId = Cluster.freeCallbackId++;
				this.callbacks[callbackId] = callback;
				msg.callbackId = callbackId;
			}

			if (clusterLib.isMaster)
			{
				if (workerId === undefined)
				{
					this.dispatchMessageEvent(msg);
				}
				else
				{
					if (this.persistantWorkerTypes[workerId] || this.volatileCallbacks[workerId])
						clusterLib.workers[workerId].send(msg);
				}
			}
			else
			{
				if (workerId === undefined)
				{
					process.send(msg);
				}
				else
				{
					var envelope = this.buildMessage(Cluster.MSG_FORWARD, envelope);
					process.send(envelope);
				}
			}
		}



		private sendReply(msg:ClusterMessage, response:any):void
		{
			var reply = this.buildMessage(Cluster.MSG_CALLBACK, response);
			reply.callbackId = msg.callbackId;
			this.send(reply, msg.senderWorkerId);
		}



		private dispatchMessageEvent(msg:ClusterMessage):void
		{
			var callback:AnyCallback;
			var isFirst = true;
			if (msg.callbackId)
			{
				callback = (response:any) =>
				{
					if (!isFirst)
						return;

					isFirst = false;
					this.sendReply(msg, response);
				};
			}

			var listeners = this.listeners[msg.name] || [];
			for (var i = 0; i < listeners.length; ++i)
				listeners[i](msg, callback);

			if (listeners.length == 0)
			{
				for (var i = 0; i < this.unknownListeners.length; ++i)
					this.unknownListeners[i](msg, callback);
			}
		}



		/*
			Sends a message to all processes involved in the cluster, no matter
			where it is called from. If it is called from a worker it will be sent
			to the master who then relays it to all workers (even the worker who
			initially sent the message).
		*/
		public broadcast(name:string, params?:any):void
		{
			var msg = this.buildMessage(name, params);
			if (clusterLib.isMaster)
			{
				for (var id in clusterLib.workers)
				{
					if (this.persistantWorkerTypes[id] !== undefined)
						clusterLib.workers[id].send(msg);
				}
				this.dispatchMessageEvent(msg);
			}
			else
			{
				var envelope = this.buildMessage(Cluster.MSG_BROADCAST, msg);
				process.send(envelope);
			}
		}



		/*
			Sends a message to a random worker of the given persistantType.
			Optionally a callback can be given. If the worker that receives
			the message calls the callback it will be send to the original
			worker that sent the message. If more than one message-listeners
			in the target worker receive the message and call callbacks, only
			the first will be sent back to the original worker as a callback.
		*/
		public sendPersistant(
			persistantType:string,
			name:string,
			params?:any,
			callback?:AnyCallback):void
		{
			var msg = this.buildMessage(name, params);
			if (clusterLib.isMaster)
			{
				var workerIds = Object.keys(this.persistantWorkerTypes);
				workerIds = workerIds.filter(workerId => this.persistantWorkerTypes[workerId] == persistantType);
				if (workerIds.length == 0)
					return logWarning("unknown persistant type:", persistantType);

				var workerId = kr3m.util.Rand.getElement(workerIds);
				this.send(msg, workerId, callback);
			}
			else
			{
				var envelope = this.buildMessage(Cluster.MSG_FORWARD_PERSISTANT, msg);
				envelope.targetPersistantType = persistantType;
				this.send(envelope, callback);
			}
		}



		public on(
			name:string,
			listener:ClusterMessageListener):void
		{
			if (!this.listeners[name])
				this.listeners[name] = [];
			this.listeners[name].push(listener);
		}



		/*
			Ads listener to the list of functions that will be
			called if a message event arrives in the process and
			no listener is set specifically for that event.
		*/
		public onUnknown(listener:ClusterMessageListener):void
		{
			this.unknownListeners.push(listener);
		}



		public setMaster(masterFunc:Callback):void
		{
			this.masterFunc = masterFunc;
		}



		private startPersistantWorker(persistantType:string):void
		{
			var options = this.persistantMeta[persistantType].options;
			var count = options.staggered ? 1 : (options.count || 1);
			for (var i = 0; i < count; ++i)
			{
				var worker = clusterLib.fork({persistantType : persistantType});
				this.persistantWorkerTypes[worker.id] = persistantType;
			}
		}



		/*
			Registers a persistant worker type for running as soon as the
			cluster is run (or immediately, if the cluster is already running).
			persistantType is an arbitrary but unique (in app) string that
			is used to start corresponding worker types.

			It is important that registerPersistant() is called in the master
			and on the worker process so the connection between those two can
			be established.
		*/
		public registerPersistant(
			persistantType:string,
			options:WorkerOptions,
			func:Callback):void
		{
			this.persistantMeta[persistantType] = {options : options, func : func};
			if (this.running)
			{
				if (clusterLib.isMaster)
					this.startPersistantWorker(persistantType);
				else if (process.env.persistantType == persistantType)
					this.runPersistantWorker(persistantType);
			}
		}



		private onWorkerExit(worker:any):void
		{
			if (this.volatileCallbacks[worker.id])
			{
				var errorCallback = this.volatileCallbacks[worker.id].errorCallback;
				delete this.volatileCallbacks[worker.id];
				errorCallback && errorCallback("worker exit");
			}

			if (this.persistantWorkerTypes[worker.id] !== undefined)
			{
				if (!this.suicide && !worker.suicide)
				{
					log(getWorkerName(worker.id) + " has exit");
					var persistantType = this.persistantWorkerTypes[worker.id];
					log("restarting persistant worker");

					var newWorker = clusterLib.fork({persistantType : persistantType});
					this.persistantWorkerTypes[newWorker.id] = persistantType;
				}
				delete this.persistantWorkerTypes[worker.id];
			}
		}



		private onWorkerDisconnect(worker:any):void
		{
			if (this.volatileCallbacks[worker.id])
			{
				var errorCallback = this.volatileCallbacks[worker.id].errorCallback;
				delete this.volatileCallbacks[worker.id];
				errorCallback && errorCallback("worker disconnected");
			}

			if (this.persistantWorkerTypes[worker.id] !== undefined)
			{
				if (!this.suicide && !worker.suicide)
					log(getWorkerName(worker.id) + " has disconnected");
			}
		}



		private runMaster():void
		{
			if (!clusterLib.isMaster)
				throw new Error("Clusters can only be run from the master process");

			clusterLib.on("disconnect", this.onWorkerDisconnect.bind(this));
			clusterLib.on("exit", this.onWorkerExit.bind(this));

			this.on(Cluster.MSG_BROADCAST, msg => this.broadcast(msg.params.name, msg.params.params));
			this.on(Cluster.MSG_PERSISTANTINIT, this.handlePersistantInitialized.bind(this));
			this.on(Cluster.MSG_VOLATILECALLBACK, this.handleVolatileReturn.bind(this));

			this.on(Cluster.MSG_FORWARD, (envelope) =>
			{
				var msg = <ClusterMessage> envelope.params;
				if (envelope.callbackId)
					this.send(msg, response => this.sendReply(envelope, response));
				else
					this.send(msg);
			});

			this.on(Cluster.MSG_FORWARD_PERSISTANT, (envelope) =>
			{
				var msg = <ClusterMessage> envelope.params;
				if (envelope.callbackId)
					this.sendPersistant(envelope.targetPersistantType, msg.name, msg.params, response => this.sendReply(envelope, response));
				else
					this.sendPersistant(envelope.targetPersistantType, msg.name, msg.params);
			});

			for (var persistantType in this.persistantMeta)
				this.startPersistantWorker(persistantType);

			this.masterFunc && this.masterFunc();
		}



		private handlePersistantInitialized(msg:ClusterMessage):void
		{
			var workerId = msg.senderWorkerId;

			var persistantType = this.persistantWorkerTypes[workerId];
			if (persistantType === undefined)
				return;

			var options = this.persistantMeta[persistantType].options;

			var runningCount = 0;
			var count = options.count || 1;
			if (count < 2)
				return;

			for (var id in this.persistantWorkerTypes)
			{
				if (this.persistantWorkerTypes[id] == persistantType)
					++runningCount;
			}

			if (runningCount >= count)
				return;

			var worker = clusterLib.fork({persistantType : persistantType});
			this.persistantWorkerTypes[worker.id] = persistantType;
		}



		public persistantInitialized():void
		{
			var msg = this.buildMessage(Cluster.MSG_PERSISTANTINIT);
			process.send(msg);
		}



		private runPersistantWorker(persistantType:string):void
		{
			this.persistantMeta[persistantType].func();
			this.on(Cluster.MSG_SHUTDOWN, () =>
			{
				process["disconnect"]();
				setTimeout(() => process.exit(0), 500);
			});
		}



		private runVolatileWorker(type:string, params:any):void
		{
			this.volatileFuncs[type](params, this.returnVolatile.bind(this));
			this.on(Cluster.MSG_SHUTDOWN, () =>
			{
				process["disconnect"]();
				setTimeout(() => process.exit(0), 500);
			});
		}



		private handleVolatileReturn(msg:ClusterMessage):void
		{
			var workerId = msg.senderWorkerId;
			if (this.volatileCallbacks[workerId])
			{
				var callback = this.volatileCallbacks[workerId].callback;
				delete this.volatileCallbacks[workerId];
				callback && callback(msg.params);
			}
		}



		private returnVolatile(response:any):void
		{
			var msg = this.buildMessage(Cluster.MSG_VOLATILECALLBACK, response);
			process.send(msg);
		}



		/*
			Registers a volatile worker type for running as soon as
			runVolatile() is called. volatileType is an arbitrary but unique
			(in app) string that is used to start corresponding worker types.

			It is important that registerVolatile() is called in the master
			and on the worker process so the connection between those two can
			be established.
		*/
		public registerVolatile(
			volatileType:string,
			func:(params:any, callback:AnyCallback) => void):void
		{
			this.volatileFuncs[volatileType] = func;
		}



		public runVolatile(
			volatileType:string,
			params:any,
			callback?:AnyCallback,
			errorCallback?:StringCallback):void
		{
			log("starting volatile worker", volatileType);
			var workerParams =
			{
				volatileType : volatileType,
				volatileParams : kr3m.util.Json.encode(params)
			};
			var worker = clusterLib.fork(workerParams);
			this.volatileCallbacks[worker.id] = {callback : callback, errorCallback : errorCallback};
		}



		public run():void
		{
			if (this.running)
				return;

			this.running = true;
			if (clusterLib.isMaster)
			{
				this.runMaster();
			}
			else if (typeof process.env.persistantType == "string")
			{
				var persistantType = process.env.persistantType;
				if (this.persistantMeta[persistantType])
					this.runPersistantWorker(persistantType);
			}
			else if (typeof process.env.volatileType == "string")
			{
				var volatileType = <string> process.env.volatileType;
				var volatileParams = kr3m.util.Json.decode(process.env.volatileParams);
				this.runVolatileWorker(volatileType, volatileParams);
			}
		}



		public shutdown(callback?:Callback):void
		{
			if (!clusterLib.isMaster)
				return;

			if (this.suicide)
				return;

			this.suicide = true;
			this.broadcast(Cluster.MSG_SHUTDOWN);
			setTimeout(() =>
			{
				for (var id in clusterLib.workers)
				{
					if (this.persistantWorkerTypes[id] !== undefined)
					{
						log("terminating worker", id);
						clusterLib.workers[id].kill("SIGTERM");
					}
				}

				setTimeout(() =>
				{
					for (var id in clusterLib.workers)
					{
						if (this.persistantWorkerTypes[id] !== undefined)
						{
							logWarning("killing worker", id);
							clusterLib.workers[id].kill("SIGKILL");
						}
					}
					callback();
				}, 1000);
			}, 500);
		}
	}
}

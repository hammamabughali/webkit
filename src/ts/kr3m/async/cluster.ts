/// <reference path="../async/timeout.ts"/>
/// <reference path="../lib/cluster.ts"/>
/// <reference path="../lib/os.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/stringex.ts"/>



//# DEPRECATED: kr3m.async.Cluster is deprecated. Please use kr3m.mulproc.Cluster instead.
module kr3m.async
{
	/*
		Erstellt einen Cluster von Worker-Processen, die Hintergrundarbeiten
		verrichten können. Im Prinzip ist das ein Wrapper für die Anwendung
		der node.js cluster Funktionalitäten mit einer Implementierung der
		am häufigsten benötigen Routinen.
	*/
	export class Cluster
	{
		public static isMaster = clusterLib.isMaster;
		public static logAdjusted = false;

		private static msgListeners:{[msg:string]:Array<(params?:any) => void>} = {};
		private static listeners:Array<(name:string, params?:any) => void> = [];
		private static listening = false;

		private workTypes:any[] = [];
		private workTypesByWorkerId:{[id:string]:number} = {};
		private suicide = false;



		public static broadcast(name:string, params?:any):void
		{
			if (clusterLib.isMaster)
			{
				for (var id in clusterLib.workers)
				{
					clusterLib.workers[id].send({name : name, params : params});
				}
			}
			else
			{
				process.send({name : "__BROADCAST", params : {name : name, params : params}});
			}
		}



		public static dispatchMessageEvent(name:string, params?:any):void
		{
			var msgListeners = Cluster.msgListeners[name] || [];
			for (var i = 0; i < msgListeners.length; ++i)
				msgListeners[i](params);
			for (var i = 0; i < Cluster.listeners.length; ++i)
				Cluster.listeners[i](name, params);
		}



		public static on(name:string, listener:(params?:any) => void):void;
		public static on(listener:(name:string, params?:any) => void):void;

		public static on():void
		{
			if (arguments.length > 1)
			{
				var name = <string> arguments[0];
				var msgListener = <(params?:any) => void> arguments[1];
				if (!Cluster.msgListeners[name])
					Cluster.msgListeners[name] = [];
				Cluster.msgListeners[name].push(msgListener);
			}
			else
			{
				var allListener = <(name:string, params?:any) => void> arguments[0];
				Cluster.listeners.push(allListener);
			}

			if (Cluster.listening)
				return;

			Cluster.listening = true;

			if (clusterLib.isMaster)
			{
				clusterLib.on("message", (worker:any, msg:any) =>
				{
					if (!msg || !msg.name)
						return;

					Cluster.dispatchMessageEvent(msg.name, msg.params);
				});
			}
			else
			{
				process.on("message", (msg:any) =>
				{
					if (!msg || !msg.name)
						return;

					Cluster.dispatchMessageEvent(msg.name, msg.params);
				});
			}
		}



		/*
			Startet eine Reihe von Worker-Prozessen, welche die gegebenen
			Funktionen ausführen. Der erste Parameter muss eine Funktion sein,
			die auf dem Master-Process ausgeführt wird (eine Art callback für
			diesen Aufruf). Anschließend können beliebig viele Funktionen
			übergeben. Für jede übergebene Funktion wird ein Worker-Prozess
			gestartet. Jede Funktion kann auch in mehreren Worker-Prozesssen
			gestartet werden, indem man ihr in der Parameterliste die gewünschte
			Prozess-Anzahl als Parameter übergibt. Wird als Anzahl 0 (oder nichts)
			übergeben, wird statt dessen die Anzahl der verfügbaren CPUs verwendet.
		*/
		constructor(masterFunc:Callback, ...params:Array<number|Callback>)
		{
			var workTypeId = kr3m.util.StringEx.parseIntSafe(process.env.workTypeId);
			this.initWorkTypes(masterFunc, params);

			if (clusterLib.isMaster)
			{
				this.runMaster();
				Cluster.on((name:string, params?:any) =>
				{
					if (name == "__BROADCAST" && params)
						Cluster.broadcast(params.name, params.params);
				});
			}
			else
			{
				this.runWorker(workTypeId);
			}
		}



		public static adjustLog():void
		{
			var prefix = clusterLib.worker ? "W" + ("00" + clusterLib.worker.id).slice(-3) : "MSTR";
			var oldLog = console.log.bind(console);
			console.log = (...params:any[]) => oldLog(prefix, ...params);
			var oldError = console.error.bind(console);
			console.error = (...params:any[]) => oldError(prefix, ...params);
		}



		private initWorkTypes(masterFunc:Callback, params:Array<number|Callback>):void
		{
			this.workTypes.push({count:1, func:masterFunc});
			var count = 1;
			var cpuCount = osLib.cpus().length;
			for (var i = 0; i < params.length; ++i)
			{
				if (typeof params[i] == "number")
				{
					count = params[i] || cpuCount;
				}
				else if (typeof params[i] == "function")
				{
					this.workTypes.push({count:count, func:params[i]});
					count = 1;
				}
				else
				{
					throw new Error("unexpected parameter type");
				}
			}
		}



		private runMaster():void
		{
			clusterLib.on("disconnect", this.onDisconnect.bind(this));
			clusterLib.on("exit", this.onExit.bind(this));

			for (var i = 1; i < this.workTypes.length; ++i)
			{
				for (var j = 0; j < this.workTypes[i].count; ++j)
				{
					var worker = clusterLib.fork({workTypeId:i});
					this.workTypesByWorkerId[worker.id] = i;
				}
			}
			this.runProcess(0);
		}



		private runWorker(workTypeId:number):void
		{
			this.runProcess(workTypeId);
		}



		private runProcess(workTypeId:number):void
		{
			this.workTypes[workTypeId].func();
			if (!clusterLib.isMaster)
			{
				Cluster.on("__SHUTDOWN", () =>
				{
					process["disconnect"]();
					setTimeout(() => process.exit(0), 500);
				});
			}
		}



		private onExit(worker:any):void
		{
			if (!this.suicide && !worker.suicide)
			{
				log(worker.id + " has exit");
				var workTypeId = this.workTypesByWorkerId[worker.id];
				log("restarting worker");
				var newWorker = clusterLib.fork({workTypeId:workTypeId});
				this.workTypesByWorkerId[newWorker.id] = workTypeId;
			}
			delete this.workTypesByWorkerId[worker.id];
		}



		private onDisconnect(worker:any):void
		{
			if (!this.suicide && !worker.suicide)
				log(worker.id + " has disconnected");
		}



		public isMaster():boolean
		{
			return clusterLib.isMaster;
		}



		public getWorkerId():number
		{
			return clusterLib.worker ? clusterLib.worker.id : undefined;
		}



		public shutdown(callback:Callback):void
		{
			this.suicide = true;
			Cluster.broadcast("__SHUTDOWN");
			setTimeout(() =>
			{
				for (var id in clusterLib.workers)
				{
					log("terminating worker", id);
					clusterLib.workers[id].kill("SIGTERM");
				}

				setTimeout(() =>
				{
					for (var id in clusterLib.workers)
					{
						log("killing worker", id);
						clusterLib.workers[id].kill("SIGKILL");
					}
					callback();
				}, 1000);
			}, 500);
		}
	}
}

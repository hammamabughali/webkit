/// <reference path="../async/join.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../javascript/script.ts"/>
/// <reference path="../javascript/weblib.ts"/>
/// <reference path="../lib/vm.ts"/>
/// <reference path="../services/paramshelper.ts"/>
/// <reference path="../util/json.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.javascript
{
	/*
		Klasse mit der Javascript im node.js Server ausgeführt werden
		kann ohne im globalen Context zu laufen. Kann z.B. verwendet
		werden um dynamische Scripte von Usern oder Entwicklern sicher
		auszuführen.
	*/
	export class Sandbox
	{
		public static SCRIPT_CONSOLE = new Script("//# EMBED(embed/console.js, jsonNoQuotes)");
		public static SCRIPT_ECHO = new Script("//# EMBED(embed/echo.js, jsonNoQuotes)");
		public static SCRIPT_KR3M_LIB = new Script("//# EMBED(embed/kr3mLib.js, jsonNoQuotes)");
		public static SCRIPT_RPC_PRE = new Script("//# EMBED(embed/rpc_pre.js, jsonNoQuotes)");

		private context:any;
		private rpcHandler:{[functionName:string]:Function} = {};
		private rpcDirty:{name:string, forceCallback:boolean}[] = [];
		private doRpcInit = true;

		public showScriptCode = false; // soll der Code aller ausgeführter Skripte in der Konsole angezeigt werden?



		/*
			Erzeugt eine Sandbox in der gefahrlos Javascripte
			ausgeführt werden können. Falls initialGlobals
			angegeben wird, werden die darin gegebenen Felder
			als globale Variablen in der Sandbox angelegt.
		*/
		constructor(initialGlobals?:{[varName:string]:any})
		{
			this.context = vmLib.createContext(initialGlobals || {});
		}



		/*
			Fügt eine rpc-Funktion der Sandbox hinzu. Die Funktion kann dann in
			Skripten, die in der Sandbox laufen über ihren functionName aufgerufen
			werden. Alle Parameter, die der Funktion übergeben werden werden
			anschließend handler übergeben wenn handler aufgerufen wird, inklusive
			aller Callback-Funktionen.

			Wird validations angegeben, werden die an functionName übergebenen
			Parameter mit Hilfe von kr3m.services.ParamsHelper überprüft. Nur wenn
			sie zu den in validations gegebenen Typen passen wird handler aufgerufen.
			In defaults können Standardwerte für alle Parameter angegeben werden,
			die der Überprüfung mit validations nicht Stand halten - es werden dann
			die Standardwerte statt den eigentlichen Parametern verwendet.

			In den seltenen Fällen, wenn functionName keine Callback-Funktion als
			Parameter erwartet, es aber doch wichtig ist, dass die Sandbox darauf
			wartet, dass eine asynchrone Operation abgeschlossen wurde, kann
			forceCallback auf true gesetzt werden. Der handler bekommt dann
			zusätzlich zu den functionName übergebenen Paramtern noch eine
			Callback-Funktion übergeben (die keine Parameter erwartet und keinen
			Wert zurück gibt). handler kann diese dann aufrufen um der Sandbox
			mitzuteilen, dass die asynchrone Operation abgeschlossen wurde.
		*/
		public addRpc(
			functionName:string,
			validations:any[],
			defaults:any[],
			forceCallback:boolean,
			handler:Function):void;

		public addRpc(
			functionName:string,
			validations:any[],
			defaults:any[],
			handler:Function):void;

		public addRpc(
			functionName:string,
			validations:any[],
			forceCallback:boolean,
			handler:Function):void;

		public addRpc(
			functionName:string,
			validations:any[],
			handler:Function):void;

		public addRpc(
			functionName:string,
			forceCallback:boolean,
			handler:Function):void;

		public addRpc(
			functionName:string,
			handler:Function):void;

		public addRpc():void
		{
			var functionName = <string> firstOfType(arguments, "string");
			var validations = <any[]> firstOfType(arguments, "object", 0, 0);
			var defaults = <any[]> firstOfType(arguments, "object", 0, 1);
			var handler = <Function> firstOfType(arguments, "function");
			var forceCallback = <boolean> firstOfType(arguments, "boolean") || false;

			if (validations)
			{
				var oldHandler = handler;
				handler = (...params:any[]) =>
				{
					var helper = new kr3m.services.ParamsHelper(params);
					if (!helper.validate(validations, defaults))
						return logWarning("Javascript-Sandbox-Error:", functionName, "called with invalid parameters");

					oldHandler(...params);
				};
			}

			this.rpcHandler[functionName] = handler;
			var oldDirty = kr3m.util.Util.getBy(this.rpcDirty, "name", functionName);
			if (!oldDirty)
				this.rpcDirty.push({name : functionName, forceCallback : forceCallback});
		}



		private rpcPre():void
		{
			if (this.doRpcInit)
			{
				this.run(Sandbox.SCRIPT_RPC_PRE);
				this.doRpcInit = false;
			}

			if (this.rpcDirty.length > 0)
			{
				var script = "";
				for (var i = 0; i < this.rpcDirty.length; ++i)
				{
					var moduleParts = this.rpcDirty[i].name.split(".");
					for (var j = 1; j < moduleParts.length; ++j)
					{
						var varName = moduleParts.slice(0, j).join(".");
						script += "if (typeof " + varName + " == 'undefined')\n\t" + varName + " = {};\n";
					}
					script += this.rpcDirty[i].name + " = __cbFunc.bind(null, '" + this.rpcDirty[i].name + "', " + this.rpcDirty[i].forceCallback + ");\n";
				}
				this.run(script);
				this.rpcDirty = [];
			}
		}



		private rpcPost(
			callback:(error:Error) => void):void
		{
			kr3m.async.Loop.loop((loopDone:() => void) =>
			{
				var rpc = this.getGlobal("__rpc");
				if (rpc.pending.length == 0)
					return callback(undefined);

				var join = new kr3m.async.Join();
				for (var i = 0; i < rpc.pending.length; ++i)
				{
					var p = rpc.pending[i];
					var func = this.rpcHandler[p.functionName];
					if (!func)
						return callback(new Error("Javascript-Sandbox-Error: " + p.functionName + " is not a valid rpc function name"));

					if (p.callbackOffsets.length > 0)
					{
						join.fork();
						var helper = join.done.bind(join, i);
						for (var j = 0; j < p.callbackOffsets.length; ++j)
							p.params[p.callbackOffsets[j]] = helper.bind(null, j);
					}
					else if (p.forceCallback)
					{
						join.fork();
						var helper = join.done.bind(join, i);
						p.params.push(helper);
					}
					func(...p.params);
				}
				join.addCallback(() =>
				{
					var script = "";
					for (var i = 0; i < rpc.pending.length; ++i)
					{
						var p = rpc.pending[i];
						if (p.callbackOffsets.length > 0)
						{
							var results = join.getResults(i);
							var j = results.shift();
							script += "__rpcCb(" + p.id + ", " + j + ", " + kr3m.util.Json.encode(results) + ");\n";
						}
						else
						{
							script += "__rpcCb(" + p.id + ", -1);\n";
						}
					}
					var error = this.run(script);
					if (error)
						return callback(error);
					loopDone();
				});
			});
		}



		/*
			Asynchrone Variante von run(). Hauptvorteil ist, dass
			RPC-Funktionalität zur Verfügung steht (siehe addRpc).
		*/
		public runRpc(
			code:string|Script,
			callback:(error:Error) => void):void
		{
			this.rpcPre();
			var err = this.run(code);
			if (err)
				return callback(err);

			this.rpcPost(callback);
		}



		/*
			Führt code in der Sandbox aus. Falls ein Fehler
			auftritt (eine Ausnahme geworfen wird), wird dieser
			als Ergebnis zurückgegeben. Bei einer fehlerfreien
			Ausführung wird undefined zurückgegeben.
		*/
		public run(code:string|Script):Error
		{
			try
			{
				if (code instanceof Script)
				{
					if (this.showScriptCode)
						log("running sandbox script:\n" + kr3m.util.Log.COLOR_BRIGHT_CYAN + code.getCode() + kr3m.util.Log.COLOR_RESET);
					code.getPrecompiled().runInContext(this.context);
				}
				else
				{
					if (this.showScriptCode)
						log("running sandbox script:\n" + kr3m.util.Log.COLOR_BRIGHT_CYAN + code + kr3m.util.Log.COLOR_RESET);
					vmLib.runInContext(code, this.context);
				}
				return undefined;
			}
			catch(e)
			{
				return e;
			}
		}



		/*
			Setzt die globale Variable varName in der Sandbox auf
			den Wert value.
		*/
		public setGlobal(varName:string, value:any):void
		{
			var script = "var " + varName + " = " + kr3m.util.Json.encode(value);
			this.run(script);
		}



		/*
			Gibt den Wert der globalen Variable varName aus der
			Sandbox zurück.
		*/
		public getGlobal(varName:string):any
		{
			try
			{
				return vmLib.runInContext(varName, this.context);
			}
			catch(e)
			{
				return undefined;
			}
		}



		/*
			Eine neue Sandbox hat per se kein console-Objekt, über
			das Ausgaben gemacht werden können (console ist einfach
			undefined). Mit diesem Befehl wird ein console-Objekt
			angelegt. Die Ausgaben, die darüber gemacht werden können
			nach(!) der Ausführung eines Skriptes mit getConsoleOutput
			abgefragt werden.
		*/
		public enableConsole():void
		{
			this.run(Sandbox.SCRIPT_CONSOLE);
		}



		/*
			Gibt alle console-Ausgaben, die in der Sandbox gemacht
			wurden zurück. Ist reset true, wird der Inhalt der console
			gleichzeitig auch gelöscht.
		*/
		public getConsoleOutput(reset = true):{type:string, text:string}[]
		{
			var output = this.getGlobal("__consoleLog");
			if (reset)
				this.setGlobal("__consoleLog", []);
			return output;
		}



		public enableEcho():void
		{
			this.run(Sandbox.SCRIPT_ECHO);
		}



		public getEchoOutput(reset = true):string[][]
		{
			var output = this.getGlobal("__echoLog");
			if (reset)
				this.setGlobal("__echoLog", []);

			output = output.map((line) => line.map((obj) => typeof obj == "string" ? obj : kr3m.util.Json.encode(obj)));
			return output;
		}



		public enableKr3mLib():void
		{
			this.run(Sandbox.SCRIPT_KR3M_LIB);
		}



		public enableFileAccess(readOnly = false):void
		{
			this.addRpc("fsLib.readdir", fsLib.readdir.bind(fsLib));
			this.addRpc("fsLib.readFile", fsLib.readFile.bind(fsLib));
			this.addRpc("fsLib.stat", fsLib.stat.bind(fsLib));
			if (!readOnly)
				this.addRpc("fsLib.writeFile", fsLib.writeFile.bind(fsLib));
		}



		public enableWebAccess():void
		{
			for (var method in WebLib)
			{
				if (typeof WebLib[method] == "function")
					this.addRpc("webLib." + method, WebLib[method]);
			}
		}
	}
}

/// <reference path="../async/delayed.ts"/>
/// <reference path="../lib/readline.ts"/>
/// <reference path="../util/map.ts"/>
/// <reference path="../util/stringex.ts"/>
/// <reference path="../util/trysafe.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.util
{
	/*
		Stellt verschiedene Funktionen zum Arbeiten mit der Bash-Console
		zur Verfügung, wie z.B. Funktionen zum Einlesen von User-Input oder
		zum Ausgeben von beliebig positioniertem Text.
	*/
	export class Bash
	{
		private delay = new kr3m.async.Delayed();
		private rl:any = null;
		private inStream:any;
		private outStream:any;
		private inputListeners:Array<(input:string) => void> = [];
		private promptPrefix:string = "";
		private autoCompleteValues:string[] = [];
		private closeCallback:() => void;
		private commands = new Map<(parameters:string[]) => void>();



		constructor()
		{
			this.inStream = process.stdin;
			this.outStream = process.stdout;
		}



		public isAvailable():boolean
		{
			return this.outStream.isTTY;
		}



		public open(
			openCallback:() => void = null,
			closeCallback:() => void = null,
			errorCallback:() => void = null):void
		{
			if (!this.isAvailable())
				return errorCallback && errorCallback();

			this.closeCallback = closeCallback;
			var options =
			{
				input : this.inStream,
				output : this.outStream,
				completer : this.autoCompleteHandler.bind(this)
			};
			this.rl = readlineLib.createInterface(options);
			this.rl.on("line", this.inputHandler.bind(this));
			this.rl.on("close", this.closeHandler.bind(this));

			this.delay.execute();
			openCallback && openCallback();
		}



		public textXY(x:number, y:number, text:string):void
		{
			this.outStream.cursorTo(x, y);
			console.log(text);
		}



		public getWidth():number
		{
			return this.outStream.columns;
		}



		public getHeight():number
		{
			return this.outStream.rows;
		}



		public addInputListener(listener:(input:string) => void):void
		{
			this.delay.call(() =>
			{
				this.inputListeners.push(listener);
			});
		}



		private inputHandler(input:string):void
		{
			for (var i = 0; i < this.inputListeners.length; ++i)
				trySafe(this.inputListeners[i], input);

			var params = StringEx.splitArguments(input);
			var commandFunc = this.commands.get(params.shift());
			if (commandFunc)
				trySafe(commandFunc, params);

			if (this.promptPrefix != "" && this.rl)
				this.rl.prompt();
		}



		public addAutoCompleteValues(values:string[]):void
		{
			this.delay.call(() =>
			{
				for (var i = 0; i < values.length; ++i)
				{
					if (!Util.contains(this.autoCompleteValues, values[i]))
						this.autoCompleteValues.push(values[i]);
				}
			});
		}



		private autoCompleteHandler(line:string):any[]
		{
			var hits = this.autoCompleteValues.filter((value:string) => {return value.indexOf(line) == 0});
			return [hits.length > 0 ? hits : this.autoCompleteValues, line];
		}



		public addCommand(name:string, func:(parameters?:string[]) => void):void
		{
			this.addAutoCompleteValues([name]);
			this.commands.set(name, func);
		}



		public setPrompt(value:string):void
		{
			this.delay.call(() =>
			{
				this.promptPrefix = value;
				this.rl.setPrompt(value);
				if (this.promptPrefix != "")
					this.rl.prompt();
			});
		}



		public close():void
		{
			this.delay.call(() =>
			{
				this.rl.close();
			});
		}



		private closeHandler():void
		{
			this.delay.reset(true);
			this.rl = null;
			if (this.closeCallback)
				this.closeCallback();
		}



		public question(caption:string, callback:(answer:string) => void):void
		{
			this.delay.call(() =>
			{
				this.rl.question(caption, (answer:string) =>
				{
					callback(answer);
					if (this.promptPrefix != "")
						this.rl.prompt();
				});
			});
		}
	}
}

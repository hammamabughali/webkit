/// <reference path="../async/join.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.async
{
	class Target
	{
		public name:string;
		public dependencies:string[];
		public buildFunc:(callback:StringCallback) => void;
		public status:string;
	}



	/*
		Target-Funktionalität, wie man sie normaler Weise aus Build-Systemen
		wie Ant oder Phing kennt. Es werden Abhängigkeiten von Targets
		angegeben und die entsprechenden Targets nur bei Bedarf und in
		der richtigen Reihenfolge der Abhängikeit ausgeführt.
	*/
	export class Targets
	{
		private targets:{[name:string]:Target} = {};



		public add(targetName:string, dependencies:string[], buildFunc:(callback:StringCallback) => void):void;
		public add(targetName:string, buildFunc:(callback:StringCallback) => void):void;

		public add():void
		{
			var u = kr3m.util.Util;
			var target = new Target();
			target.name = u.getFirstOfType(arguments, "string"),
			target.dependencies = u.getFirstOfType(arguments, "object") || [],
			target.buildFunc = u.getFirstOfType(arguments, "function")

			if (this.targets[target.name])
				logWarning("overwriting target", target.name);

			this.targets[target.name] = target;
		}



		public require(
			targetName:string,
			callback:StringCallback):void
		{
			var target = this.targets[targetName];
			if (!target)
				return callback("ERROR_UNKNOWN_TARGET");

			if (target.status)
				return callback(target.status);

			var join = new kr3m.async.Join();
			for (var i = 0; i < target.dependencies.length; ++i)
				this.require(target.dependencies[i], join.getCallback(target.dependencies[i]));

			join.addCallback(() =>
			{
				var states = join.getAllResults();
				for (var name in states)
				{
					if (states[name] != kr3m.SUCCESS)
					{
						target.status = "ERROR_DEPENDANCY";
						return callback(target.status);
					}
				}

				target.buildFunc((status) =>
				{
					target.status = status;
					callback(status);
				});
			});
		}



		public getStates():{[name:string]:string}
		{
			var states:{[name:string]:string} = {};
			for (var name in this.targets)
				states[name] = this.targets[name].status;
			return states;
		}
	}
}

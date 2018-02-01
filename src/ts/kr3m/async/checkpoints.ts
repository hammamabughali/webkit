module kr3m.async
{
	/*
		Checkpoints funktionieren ähnlich wie Events, aber mit ein
		paar wichtigen Unterschieden:
		- ein Event kann mehrfach ausgelöst, ein Checkpoint aber nur einmal erreicht werden
		- ein Listener kann warten, bis alle seine Checkpoints erreicht wurden
		- Listener werden immer nur einmalig ausgeführt
		- Listener werden auch ausgeführt wenn die Checkpoints zum Zeitpunkt des Setzens
		des Listeners schon erreicht wurden
	*/
//# DEPRECATED: kr3m.async.Checkpoints bitte nicht mehr benutzen - statt dessen kr3m.async.Flags verwenden
	export class Checkpoints
	{
		private static instance:Checkpoints;

		private reached:{[name:string]:boolean} = {};
		private listeners:{names:string[], listener:() => void}[] = [];



		public static getInstance():Checkpoints
		{
			if (!Checkpoints.instance)
				Checkpoints.instance = new Checkpoints();

			return Checkpoints.instance;
		}



		public reach(...names:string[]):void
		{
			for (var i = 0; i < names.length; ++i)
				this.reached[names[i]] = true;

			for (var i = 0; i < this.listeners.length; ++i)
			{
				for (var j = 0; j < this.listeners[i].names.length; ++j)
				{
					var name = this.listeners[i].names[j];
					if (!this.reached[name])
						break;
				}

				if (j == this.listeners[i].names.length)
				{
					var temp = this.listeners.splice(i--, 1);
					temp[0].listener();
				}
			}
		}



		public waitFor(
			names:string|string[],
			listener:() => void):void
		{
			var namesArray = (typeof names == "string") ? [<string> names] : <string[]> names;
			for (var i = 0; i < namesArray.length; ++i)
			{
				if (!this.reached[namesArray[i]])
				{
					this.listeners.push({names : namesArray, listener : listener});
					return;
				}
			}
			listener();
		}
	}
}



//# !HIDE_GLOBAL
function reachCheckpoint(
	...checkpointNames:string[]):void
{
	var instance = kr3m.async.Checkpoints.getInstance();
	instance.reach(...checkpointNames);
}
//# /!HIDE_GLOBAL



//# !HIDE_GLOBAL
function waitForCheckpoint(
	checkpointNames:string|string[],
	listener:() => void):void
{
	var instance = kr3m.async.Checkpoints.getInstance();
	instance.waitFor(checkpointNames, listener);
}
//# /!HIDE_GLOBAL

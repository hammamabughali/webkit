/// <reference path="../../model/eventdispatcher.ts"/>
/// <reference path="../../model/so/delta.ts"/>



module kr3m.model.so
{
	export abstract class Base extends kr3m.model.EventDispatcher
	{
		protected isPrefix(prefix:string, text:string):boolean
		{
			var prefixParts = prefix.split(".");
			var textParts = text.split(".");

			if (prefixParts.length > textParts.length)
				return false;

			for (var i = 0; i < prefixParts.length; ++i)
			{
				if (prefixParts[i] != textParts[i])
					return false;
			}

			return true;
		}



		protected trimDeltas(deltas:Delta[]):Delta[]
		{
			if (deltas.length < 2)
				return deltas;

			for (var i = 0; i < deltas.length; ++i)
			{
				for (var j = i + 1; j < deltas.length; ++j)
				{
					if (this.isPrefix(deltas[j].name, deltas[i].name))
					{
						deltas.splice(i, 1);
						--i;
						--j;
						break;
					}
				}
			}
			return deltas;
		}



		public abstract transfer(
			currentVersion:number, fromSlave:Delta[],
			callback:(newVersion:number, fromMaster:Delta[]) => void):void;
	}
}

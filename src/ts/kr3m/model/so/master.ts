/// <reference path="base.ts"/>



module kr3m.model.so
{
	export class Master extends Base
	{
		private deltas:Delta[] = [];



		protected verify(delta:Delta):boolean
		{
			// kann von abgeleiteten Klassen überschrieben werden
			return true;
		}



		public transfer(
			currentVersion:number, fromSlave:Delta[],
			callback:(newVersion:number, fromMaster:Delta[]) => void):void
		{
			fromSlave = this.trimDeltas(fromSlave);
			for (var i = 0; i < fromSlave.length; ++i)
			{
				if (this.verify(fromSlave[i]))
				{
					this.deltas.push(fromSlave[i]);
					this.dispatch("change", fromSlave[i].name);
				}
			}
			var fromMaster = this.trimDeltas(this.deltas.slice(currentVersion));
			callback(this.deltas.length, fromMaster);
		}



		public set<T>(name:string, value:T):void
		{
			this.deltas.push(new Delta(name, value));
		}
	}
}

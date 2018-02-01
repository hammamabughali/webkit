/// <reference path="base.ts"/>



module kr3m.model.so
{
	export abstract class Slave extends Base
	{
		private data:any = {};
		private version = 0;



		constructor()
		{
			super();
			setTimeout(() => this.poll(), 1);
			setInterval(() => this.poll(), 1000);
		}



		private synchronize(
			fromSlave:Delta[],
			callback?:() => void):void
		{
			fromSlave = this.trimDeltas(fromSlave);
			this.transfer(this.version, fromSlave, (newVersion:number, fromMaster:Delta[]) =>
			{
				for (var i = 0; i < fromMaster.length; ++i)
				{
					kr3m.util.Util.setProperty(this.data, fromMaster[i].name, fromMaster[i].value);
					this.dispatch("change", fromMaster[i].name);
				}
				this.version = newVersion;
			});
		}



		public set<T>(
			name:string, value:T,
			callback?:() => void):void
		{
			this.synchronize([new Delta(name, value)], callback);
		}



		public get<T>(name:string):T
		{
			var U = kr3m.util.Util;
			return U.clone(U.getProperty(this.data, name));
		}



		private poll():void
		{
			this.synchronize([]);
		}
	}
}

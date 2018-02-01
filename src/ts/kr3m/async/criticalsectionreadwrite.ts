/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.async
{
	/*
		Das gleiche wie CriticalSection mit dem Unterschied,
		dass Funktionen lesenden oder schreibenden Zugriff
		auf die kritische Sektion verlangen können und getrennt
		gesteuert werden kann, wie viele es jeweils gibt. So
		sind z.B. Zugriffe der Art: beliebig viele dürfen
		gleichzeitig lesen, aber es darf immer nur einer
		schreiben (die Standardeinstellung).

		Funktionen, die Schreibrechte brauchen haben dabei eine
		höhere Priorität als solche, die nur Lesezugriff
		brauchen. Das soll verhindern, dass sie unendlich
		warten wenn sehr viele Lesezugriffe stattfinden.
	*/
	export class CriticalSectionReadWrite
	{
		private limitRead:number;
		private currentRead:number = 0;
		private pendingRead:Array<(exit:Callback) => void> = [];

		private limitWrite:number;
		private currentWrite:number = 0;
		private pendingWrite:Array<(exit:Callback) => void> = [];



		constructor(limitWrite:number = 1, limitRead:number = 0)
		{
			this.limitRead = limitRead;
			this.limitWrite = limitWrite;
		}



		public setLimits(limitWrite:number, limitRead:number):void
		{
			this.limitRead = limitRead;
			this.limitWrite = limitWrite;
		}



		private check():void
		{
			if (this.pendingWrite.length > 0)
			{
				if (this.currentRead > 0)
					return;

				if (this.limitWrite > 0 && this.currentWrite >= this.limitWrite)
					return;

				++this.currentWrite;
				var func = this.pendingWrite.shift();
				func(this.exitWrite.bind(this));
				return;
			}

			if (this.pendingRead.length > 0)
			{
				if (this.currentWrite > 0)
					return;

				if (this.limitRead > 0 && this.currentRead >= this.limitRead)
					return;

				++this.currentRead;
				var func = this.pendingRead.shift();
				func(this.exitRead.bind(this));
				return;
			}
		}



		private exitWrite():void
		{
			--this.currentWrite;
			this.check();
		}



		private exitRead():void
		{
			--this.currentRead;
			this.check();
		}



		public enterWrite(
			func:(exit:Callback) => void):void
		{
			this.pendingWrite.push(func);
			this.check();
		}



		public enterRead(
			func:(exit:Callback) => void):void
		{
			this.pendingRead.push(func);
			this.check();
		}



		public hasPending():boolean
		{
			return this.pendingWrite.length + this.pendingRead.length > 0;
		}



		public isEmpty():boolean
		{
			return this.currentWrite + this.currentRead <= 0;
		}



		public getCurrentCount():number
		{
			return this.currentWrite + this.currentRead;
		}



		public getPendingCount():number
		{
			return this.pendingWrite.length + this.pendingRead.length;
		}



		public getLimitRead():number
		{
			return this.limitRead;
		}



		public getLimitWrite():number
		{
			return this.limitWrite;
		}
	}
}

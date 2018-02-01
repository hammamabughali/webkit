/// <reference path="../types.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.async
{
	type SequenceFunc = (...params:any[]) => void;



	/*
		This class makes sure all callbacks passed through it are
		called in the same sequence the were passed even though
		their calling functions might finish in another order.

		Or, in other words: Sequence is smiliar to Join but you
		don't have to wait for results until all forks have finished.

		For example: if you're running a loop that starts ten
		database queries and you want the callbacks from those
		queries to be called in the same sequence you started the
		queries, use this class. Then it won't matter how long
		each query took compared to the others, the callbacks will
		be called in the correct order.
	*/
	export class Sequence
	{
		private freeId = 0;
		private pending:{id:number, func:SequenceFunc, results:any[]}[] = [];



		private step():void
		{
			while (this.pending.length > 0)
			{
				var p = this.pending[0];
				if (!p.results)
					break;

				this.pending.shift();
				p.func(...p.results);
			}
		}



		public getCallback(func:SequenceFunc):SequenceFunc
		{
			var id = this.freeId++;
			this.pending.push({id : id, func : func, results : undefined});
			var callback = (...results:any[]) =>
			{
				var p = kr3m.util.Util.getBy(this.pending, "id", id);
				p.results = results;
				this.step();
			};
			return callback;
		}



		public run(func:Callback):void
		{
			this.pending.push({id : this.freeId++, func : func, results : []});
			this.step();
		}
	}
}

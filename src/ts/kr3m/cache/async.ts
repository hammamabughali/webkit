/// <reference path="../../kr3m/async/loop.ts"/>
/// <reference path="../../kr3m/types.ts"/>



module kr3m.cache
{
	/*
		Extrem simpler Cache, der Elemente nach ID in einem assoziativen
		Array speichert und bei Anfrage zurück gibt. Ist ein gewünschtes
		Element nicht bekannt, so wird die enstprechende load-Methode
		aufgerufen um es zu laden.

		Der Cache hat keine Beschränkungen auf Alter der Elemente,
		Speicherverbrauch usw., d.h. er kann sehr groß werden wenn sehr
		viele Elemente angefragt werden.
	*/
	export class Async<K = string, V = any>
	{
		protected items:any = {};
		protected pending:any = {};



		constructor(
			private loadFunc:(key:K, callback:CB<V>) => void,
			private loadManyFunc?:(keys:K[], callback:(values:any) => void) => void)
		{
			this.loadManyFunc = loadManyFunc || this.loadIterative.bind(this);
		}



		private loadIterative(
			keys:K[],
			callback:(values:any) => void):void
		{
			var values:any = {};
			kr3m.async.Loop.forEach(keys, (key, next) =>
			{
				this.loadFunc(key, (value) =>
				{
					values[<any>key] = value;
					next();
				});
			}, () => callback(values));
		}



		public get(
			key:K,
			callback:CB<V>):void
		{
			if (this.items[<any>key] !== undefined)
				return callback(this.items[<any>key]);

			if (this.pending[<any>key])
			{
				this.pending[<any>key].push(callback);
				return;
			}

			this.pending[<any>key] = [callback];
			this.loadFunc(key, (value) =>
			{
				this.items[<any>key] = value;
				var pending = this.pending[<any>key];
				delete this.pending[<any>key];
				for (var i = 0; i < pending.length; ++i)
					pending[i](value);
			});
		}



		public getMany(
			keys:K[],
			callback:(values:any) => void):void
		{
			var values:any = {};
			kr3m.async.Loop.forEach(keys, (key, next) =>
			{
				this.get(key, (value) =>
				{
					values[<any>key] = value;
					next();
				});
			}, () => callback(values));
		}



		public set(
			key:K, value:V):void
		{
			this.items[<any>key] = value;
		}



		public forEach(func:(key:string, value:V) => void):void
		{
			for (var key in this.items)
				func(key, this.items[<any>key]);
		}



		public delete(key:K):void
		{
			delete this.items[<any>key];
		}
	}
}

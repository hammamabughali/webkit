/// <reference path="../async/loop.ts"/>
/// <reference path="../model/eventdispatcher.ts"/>
/// <reference path="../types.ts"/>



module kr3m.async
{
	export type Consumer<T> = (values:T[], callback:Callback) => void;



	class ConsumerMetaData<T>
	{
		public running = 0;

		constructor(
			public batchSize:number,
			public parallelCount:number,
			public consumer:Consumer<T>)
		{
		}
	}



	export class ConsumerQueue<T> extends kr3m.model.EventDispatcher
	{
		private queue:T[] = [];
		private consumerMetas:ConsumerMetaData<T>[] = [];



		private tick():void
		{
			kr3m.async.Loop.forEach(this.consumerMetas, (meta, next) =>
			{
				while (this.queue.length > 0 && meta.running < meta.parallelCount)
				{
					++meta.running;
					var batch = this.queue.slice(0, meta.batchSize);
					this.queue = this.queue.slice(meta.batchSize);
					meta.consumer(batch, () =>
					{
						--meta.running;
						this.tick();
					});
				}
				next();
			}, () =>
			{
				if (this.queue.length == 0)
					this.dispatch("empty");
			});
		}



		public addConsumer(
			batchSize:number,
			parallelCount:number,
			consumer:Consumer<T>):void
		{
			this.consumerMetas.push(new ConsumerMetaData<T>(batchSize, parallelCount, consumer));
			this.tick();
		}



		public push(value:T):void
		{
			this.queue.push(value);
			this.tick();
		}



		public concat(values:T[]):void
		{
			this.queue = this.queue.concat(values);
			this.tick();
		}
	}
}

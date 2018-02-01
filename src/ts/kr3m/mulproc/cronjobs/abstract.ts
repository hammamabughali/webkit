/// <reference path="../../async/if.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.mulproc.cronjobs
{
	/*
		Classes for handling executions of background jobs on
		distributed servers.
	*/
	export abstract class Abstract
	{
		protected metas:{occasion:string, lastRun?:Date, nextRun?:Date}[] = [];

		private static allJobs:Abstract[];



		constructor(
			protected id:string,
			protected func:(callback:SuccessCallback) => void)
		{
			if (!Abstract.allJobs)
			{
				Abstract.allJobs = [];
				setInterval(() =>
				{
					Abstract.allJobs.forEach(job => job.tick());
				}, 1000);
			}

			Abstract.allJobs.push(this);
		}



		protected abstract getLastRun(
			occasion:string,
			callback:CB<Date>):void;

		protected abstract start(
			occasion:string,
			runtime:Date,
			callback:SuccessCallback):void;

		protected abstract end(
			occasion:string,
			runtime:Date,
			success:boolean):void;



		protected getNextRun(occasion:string, after:Date):Date
		{
			var parts = occasion.split(",");
			switch (parts[0])
			{
				case "each":
					var nextRun = new Date(after.getTime());
					nextRun.setHours(0, 0, 0, 0);
					var offset = after.getTime() - nextRun.getTime();
					var interval = parseFloat(parts[1]);
					var passed = Math.floor(offset / interval);
					nextRun.setTime(nextRun.getTime() + (passed + 1) * interval);
					return nextRun;

				case "hourly":
					var nextRun = new Date(after.getTime());
					nextRun.setMinutes(parseInt(parts[1], 10), parseInt(parts[2], 10), 0);
					if (nextRun <= after)
						nextRun.setHours(nextRun.getHours() + 1);
					return nextRun;

				case "daily":
					var nextRun = new Date(after.getTime());
					nextRun.setHours(parseInt(parts[1], 10), parseInt(parts[2], 10), parseInt(parts[3], 10), 0);
					if (nextRun <= after)
						nextRun.setDate(nextRun.getDate() + 1);
					return nextRun;

				case "monthly":
					var nextRun = new Date(after.getTime());
					nextRun.setDate(parseInt(parts[1], 10));
					nextRun.setHours(parseInt(parts[2], 10), parseInt(parts[3], 10), parseInt(parts[4], 10), 0);
					if (nextRun <= after)
						nextRun.setMonth(nextRun.getMonth() + 1);
					return nextRun;

				default:
					throw new Error("unknown occasion: " + parts[0]);
			}
		}



		public tick():void
		{
			var now = new Date();
			var threshold = new Date(Date.now() - 60 * 1000);
			kr3m.async.Loop.forEach(this.metas, (meta, next) =>
			{
				kr3m.async.If.then(!meta.lastRun, (thenDone) =>
				{
					this.getLastRun(meta.occasion, (lastRun) =>
					{
						meta.lastRun = lastRun || threshold;
						thenDone();
					});
				}, () =>
				{
					if (!meta.nextRun || meta.nextRun <= meta.lastRun)
						meta.nextRun = this.getNextRun(meta.occasion, now);

					if (meta.nextRun >= threshold && meta.nextRun <= now)
					{
						meta.lastRun = meta.nextRun;
						this.start(meta.occasion, meta.nextRun, (canStart) =>
						{
							if (canStart)
								this.func(success => this.end(meta.occasion, meta.nextRun, success));
						});
					}
					next();
				});
			});
		}



		public runEach(milliseconds:number):this
		{
			this.metas.push({occasion : "each," + milliseconds});
			return this;
		}



		public runTimesADay(count:number):this
		{
			return this.runEach(Math.ceil(24 * 60 * 60 * 1000 / count));
		}



		public runHourly(minuteOffset = 0, secondOffset = 0):this
		{
			this.metas.push({occasion : "hourly," + minuteOffset + "," + secondOffset});
			return this;
		}



		public runDaily(time = "00:00:00"):this
		{
			this.metas.push({occasion : "daily," + time.replace(/\:/g, ",")});
			return this;
		}



		public runMonthly(day = 1, time = "00:00:00"):this
		{
			this.metas.push({occasion : "monthly," + day + "," + time.replace(/\:/g, ",")});
			return this;
		}
	}
}

/// <reference path="../../mulproc/cronjobs/abstract.ts"/>



module kr3m.mulproc.cronjobs
{
	/*
		Class for handling timely executions of background jobs on
		servers.

		Warning: this class does not support multi-process. If this
		class is used, the jobs will be executed on all processes
		each time.
	*/
	export class Memory extends Abstract
	{
		protected static lastRuns:{[id:string]:{[occasion:string]:Date}} = {};



		protected getLastRun(occasion:string, callback:CB<Date>):void
		{
			if (Memory.lastRuns[this.id])
				callback(Memory.lastRuns[this.id][occasion]);
			else
				callback(undefined);
		}



		protected start(
			occasion:string,
			runtime:Date,
			callback:SuccessCallback):void
		{
			this.getLastRun(occasion, lastRun => callback(!lastRun || lastRun < runtime));

			if (!Memory.lastRuns[this.id])
				Memory.lastRuns[this.id] = {};

			if (!Memory.lastRuns[this.id][occasion] || Memory.lastRuns[this.id][occasion] < runtime)
				Memory.lastRuns[this.id][occasion] = runtime;
		}



		protected end(
			occasion:string,
			runtime:Date,
			success:boolean):void
		{
			// do nothing
		}
	}
}

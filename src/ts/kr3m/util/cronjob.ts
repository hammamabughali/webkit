/// <reference path="../mulproc/cronjobs/utils.ts"/>
/// <reference path="../util/dates.ts"/>
/// <reference path="../util/trysafe.ts"/>
/// <reference path="../util/util.ts"/>



module kr3m.util
{
	/*
		Klasse zum Simulieren von CronJobs, ohne tatsächlich
		Betriebssystem-CronJobs zu verwenden. Die Zeiten, zu
		denen die CronJobs ausgeführt werden sind nicht exakt,
		sondern hängen von der tickDuration ab - sie können
		sich bis zur tickDuration verzögern.
	*/
	//# DEPRECATED: kr3m.util.CronJob is deprecated. Please use kr3m.mulproc.cronjobs.Memory or another class found there.
	export class CronJob
	{
		private static jobs:CronJob[] = [];
		private static timerId:any;
		private static tickDuration:number = 1000;

		private checkFunc:(now:Date) => boolean;
		private callback:() => void;



		constructor(checkFunc:(now:Date) => boolean, callback:() => void)
		{
			this.checkFunc = checkFunc;
			this.callback = callback;
		}



		private static tick():void
		{
			var now = new Date();
			for (var i = 0; i < CronJob.jobs.length; ++i)
			{
				if (CronJob.jobs[i].checkFunc(now))
					trySafe(CronJob.jobs[i].callback);
			}
		}



		/*
			Stellt ein, wie oft überprüft werden soll, ob
			CronJobs ausgeführt werden sollen. Die Dauer
			wird in Sekunden angegeben. Höhere Dauern
			reduzieren die Systemlast führen aber zu größeren
			Ungenauigkeiten bei der Ausführungszeit.
		*/
		public static setTickDuration(duration:number):void
		{
			if (duration > 0)
			{
				CronJob.tickDuration = duration * 1000;
				if (CronJob.timerId)
				{
					clearInterval(CronJob.timerId);
					CronJob.timerId = setInterval(CronJob.tick, CronJob.tickDuration);
				}
			}
		}



		public start():void
		{
			if (!Util.contains(CronJob.jobs, this))
			{
				CronJob.jobs.push(this);
				if (!CronJob.timerId)
					CronJob.timerId = setInterval(CronJob.tick, CronJob.tickDuration);
			}
		}



		public stop():void
		{
			if (Util.remove(CronJob.jobs, this))
			{
				if (CronJob.jobs.length == 0)
				{
					clearInterval(CronJob.timerId);
					CronJob.timerId = null;
				}
			}
		}



		public static eachMinute(
			callback:() => void,
			secondOffset:number = 0):CronJob
		{
			var lastCheck = new Date();
			var checkFunc = function(now:Date)
			{
				var shouldRun = lastCheck.getSeconds() < secondOffset && now.getSeconds() >= secondOffset;
				lastCheck = now;
				return shouldRun;
			};
			var job = new CronJob(checkFunc, callback);
			job.start();
			return job;
		}



		public static eachHour(
			callback:() => void,
			minuteOffset:number = 0):CronJob
		{
			var lastCheck = new Date();
			var checkFunc = function(now:Date)
			{
				var lastMinutes = lastCheck.getUTCMinutes();
				if (lastCheck.getUTCHours() != now.getUTCHours())
					lastMinutes -= 60;
				var shouldRun = lastMinutes < minuteOffset && now.getUTCMinutes() >= minuteOffset;
				lastCheck = now;
				return shouldRun;
			};
			var job = new CronJob(checkFunc, callback);
			job.start();
			return job;
		}



		public static eachMonth(
			day:number, timeString:string, callback:() => void):CronJob
		{
			var lastCheckTime = Dates.getTimeString(new Date(), false);
			var checkFunc = function(now:Date)
			{
				var nowString = Dates.getTimeString(now, false);
				var shouldRun = now.getDate() == day && nowString >= timeString && lastCheckTime < timeString;
				lastCheckTime = nowString;
				return shouldRun;
			};
			var job = new CronJob(checkFunc, callback);
			job.start();
			return job;
		}



		/*
			Erzeugt einen CronJob der jeden Tag um timeString
			(in SQL-Notation) die Funktion callback aufruft,
			startet ihn und gibt ihn zurück.
		*/
		public static eachDay(
			timeString:string, callback:() => void):CronJob
		{
			var lastCheckTime = Dates.getTimeString(new Date(), false);
			var checkFunc = function(now:Date)
			{
				var nowString = Dates.getTimeString(now, false);
				var shouldRun = nowString >= timeString && lastCheckTime < timeString;
				lastCheckTime = nowString;
				return shouldRun;
			};
			var job = new CronJob(checkFunc, callback);
			job.start();
			return job;
		}



		/*
			Erzeugt einen CronJob der jeden Tag times mal läuft.
			Es kann keine Aussage darüber gemacht werden, wann
			genau der Job läuft, nur wie oft am Tag.
			Warnung: die genaue Anzahl, wie oft der Job läuft
			kann schwanken, wenn die Anwendung neu gestartet wird.
		*/
		public static timesADay(
			times:number, callback:() => void):CronJob
		{
			var interval = Math.floor(24 * 60 * 60 * 1000 / times);
			var onset = Math.floor(Math.random() * interval);
			var lastRunTime = Date.now() - onset;
			var checkFunc = function(now:Date)
			{
				var shouldRun = lastRunTime + interval <= now.getTime();
				if (shouldRun)
					lastRunTime += interval;
				return shouldRun;
			};
			var job = new CronJob(checkFunc, callback);
			job.start();
			return job;
		}



		public static getNextStart(pattern:string, after?:Date):Date
		{
			return kr3m.mulproc.cronjobs.getNextStart(pattern, after);
		}
	}
}

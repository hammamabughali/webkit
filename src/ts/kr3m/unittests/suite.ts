/// <reference path="../async/loop.ts"/>
/// <reference path="../async/queue.ts"/>
/// <reference path="../unittests/case.ts"/>
/// <reference path="../unittests/casesync.ts"/>
/// <reference path="../util/log.ts"/>
/// <reference path="../util/util.ts"/>

//# SERVER
/// <reference path="../lib/cluster.ts"/>
//# /SERVER



module kr3m.unittests
{
	export class Suite
	{
		private static queue = new kr3m.async.Queue(true);
		private static totalSuccesses = 0;
		private static totalFailures = 0;

		private cases:Case<any>[] = [];
		private timeout = 0;

		private static HIGHLIGHT = "";
		private static RESET = "";
		private static SUCCESS = "";
		private static FAILURE = "";



		constructor(protected name:string)
		{
		}



		public add(testCase:Case<any>):this
		{
			this.cases.push(testCase);
			return this;
		}



		public setTimeout(duration:number):this
		{
			this.timeout = duration;
			return this;
		}



		private static init():void
		{
//# !CLIENT
			Suite.HIGHLIGHT = kr3m.util.Log.COLOR_BRIGHT_MAGENTA;
			Suite.RESET = kr3m.util.Log.COLOR_RESET;
			Suite.SUCCESS = kr3m.util.Log.COLOR_BRIGHT_GREEN;
			Suite.FAILURE = kr3m.util.Log.COLOR_BRIGHT_RED;
//# /!CLIENT
		}



		public static showTotals():void
		{
			Suite.queue.add((callback) =>
			{
				kr3m.util.Log.log("all tests completed with " + Suite.SUCCESS + Suite.totalSuccesses + Suite.RESET + " successes and " + Suite.FAILURE + Suite.totalFailures + Suite.RESET + " failures");
				callback();
			});
		}



		public run():void
		{
//# SERVER
			if (!clusterLib.isMaster)
				return;
//# /SERVER
			Suite.queue.add((callback) =>
			{
				setTimeout(() =>
				{
					Suite.init();

					var name = Suite.HIGHLIGHT + this.name + Suite.RESET;
					kr3m.util.Log.log("running unit test suite", name);
					var successes = 0;
					var failures = 0;
					kr3m.async.Loop.forEach(this.cases, (testCase:Case<any>, next) =>
					{
						testCase.run(this.timeout, (result) =>
						{
							var expected = testCase.getExpected();
							if (result instanceof Error)
							{
								var status = Suite.FAILURE + "FAILURE" + Suite.RESET;
								var suffix = result.toString();
								++failures;
							}
							else if (kr3m.util.Util.equal(result, expected))
							{
								var status = Suite.SUCCESS + "SUCCESS" + Suite.RESET;
								var suffix = "";
								++successes;
							}
							else
							{
								var status = Suite.FAILURE + "FAILURE" + Suite.RESET;
								var suffix = kr3m.util.Json.encode(result) + " != " + kr3m.util.Json.encode(expected);
								++failures;
							}
							var name = Suite.RESET + testCase.getName() + Suite.RESET;
							kr3m.util.Log.log("[" + status + "]", name, suffix);
							next();
						});
					}, () =>
					{
						Suite.totalSuccesses += successes;
						Suite.totalFailures += failures;
						var name = Suite.RESET + this.name + Suite.RESET;
						kr3m.util.Log.log("test suite", name, "completed with", successes, "successes and", failures, "failures");
						callback();
					});
				}, 1);
			});
		}
	}
}

/// <reference path="../types.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
/// <reference path="../util/util.ts"/>
//# /UNITTESTS



module kr3m.async
{
	export class Loop
	{
		public static readonly MAX_SYNC_ITERATIONS = 200;



		/*
			Eine Hilfsfunktion um asynchrone Schleifen zu realisieren.
			Normale Schleifen funktionieren nicht mit callbacks und
			verzögerten Funktionsaufrufen, diese hier schon, sie muss
			aber etwas anders verwendet werden. Es werden zwei Parameter
			übergeben. Der erste, loopFunc, ist eine Funktion, die bei
			jedem Schleifendurchlauf aufgerufen wird. Sie bekommt selbst
			eine Funktion namens next als Parameter. Diese muss am
			Ende der "inneren Schleife" mit true oder false aufgerufen
			werden. Wird sie mit true (oder ohne Parameter) aufgerufen
			wird die innere Schleife erneut aufgerufen. Wird sie statt
			dessen mit false aufgerufen, wird statt dessen die Funktion
			aufgerufen, die als callback der Schleife übergeben wurde.
		*/
		public static loop(
			loopFunc:(next:(again?:boolean) => void) => void,
			callback?:Callback):void
		{
			var counter = 0;
			var innerHelper = function(again:boolean)
			{
				if (again || again === undefined)
				{
					++counter;
					if (counter < Loop.MAX_SYNC_ITERATIONS)
						return loopFunc(innerHelper);

					counter = 0;
					setTimeout(innerHelper, 0);
					return;
				}
				callback && callback();
			};
			innerHelper(true);
		}



		/*
			Führt loopFunc count mal hintereinander aus und anschließend
			callback. Ist parallelCount > 1 werden entsprechend viele
			loopFunc-Aufrufe parallel ausgeführt.
		*/
		public static times(
			count:number,
			loopFunc:(next:Callback, i:number) => void,
			callback?:Callback,
			parallelCount = 1):void
		{
			if (count < 1)
				return callback && callback();

			var i = 0;
			var runningCount = Math.min(parallelCount, count);
			var runningCountInitial = runningCount;
			var innerHelpers:Callback[] = [];
			var counters:number[] = [];
			var innerHelper = function(j:number)
			{
				--runningCount;
				if (i < count)
				{
					++runningCount;
					++counters[j];
					var myI = i++;

					if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
						return loopFunc(innerHelpers[j], myI);

					counters[j] = 0;
					setTimeout(() => loopFunc(innerHelpers[j], myI), 0);
				}
				else if (callback && runningCount == 0)
				{
					callback();
				}
			}
			for (var j = 0; j < runningCountInitial; ++j)
			{
				counters[j] = 0;
				innerHelpers[j] = innerHelper.bind(null, j);
				innerHelpers[j]();
			}
		}



		/*
			This method is a loop that runs through all of the elements
			in an arry and calls loopFunc for each of them. Then it
			waits until loopFunc calls its next-callback-function before
			processing the next element in the array. Once all elements
			were passed to loopFunc, callback is called, if given. If
			parallelCount is set to a value higher than 1, the given
			number of elements will be handled parallelly (without
			waiting for the next-call).
		*/
		public static forEach<T = any>(
			values:T[],
			loopFunc:(value:T, next:Callback, i:number) => void,
			callback?:Callback,
			parallelCount = 1):void
		{
			if (!values || values.length == 0)
				return callback && callback();

			var i = 0;
			var runningCount = Math.min(parallelCount, values.length);
			var runningCountInitial = runningCount;
			var innerHelpers:Callback[] = [];
			var counters:number[] = [];
			var innerHelper = function(j:number)
			{
				--runningCount;
				if (i < values.length)
				{
					++runningCount;
					++counters[j];
					var myI = i++;

					if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
						return loopFunc(values[myI], innerHelpers[j], myI);

					counters[j] = 0;
					setTimeout(() => loopFunc(values[myI], innerHelpers[j], myI), 0);
				}
				else if (callback && runningCount == 0)
				{
					callback();
				}
			}
			for (var j = 0; j < runningCountInitial; ++j)
			{
				counters[j] = 0;
				innerHelpers[j] = innerHelper.bind(null, j);
				innerHelpers[j]();
			}
		}



		/*
			A variant of forEach that runs through the properties of an
			associative array / map and calls loopFunc for each key / value
			pair.
		*/
		public static forEachAssoc<T = any>(
			valuesMap:{[key:string]:T},
			loopFunc:(key:string, value:T, next:Callback) => void,
			callback?:Callback,
			parallelCount = 1):void
		{
			if (!valuesMap)
				return callback && callback();

			var keys = Object.keys(valuesMap);
			kr3m.async.Loop.forEach(keys, (key:string, next:Callback) =>
			{
				loopFunc(key, valuesMap[key], next);
			}, callback, parallelCount);
		}



		/*
			A variant of forEach that doesn't pass a single result to each
			loopFunc call but a slice of the values array with a size of
			at most batchSize elements.
		*/
		public static forEachBatch<T = any>(
			values:T[],
			batchSize:number,
			loopFunc:(batch:T[], next:Callback, offset:number) => void,
			callback?:Callback,
			parallelCount = 1):void
		{
			if (!values || values.length == 0)
				return callback && callback();

			var i = 0;
			var runningCount = Math.min(parallelCount, Math.ceil(values.length / batchSize));
			var runningCountInitial = runningCount;
			var innerHelpers:Callback[] = [];
			var counters:number[] = [];
			var innerHelper = function(j:number)
			{
				--runningCount;
				if (i < values.length)
				{
					++runningCount;
					++counters[j];

					var myI = i;
					var batch = values.slice(i, i + batchSize);
					i += batch.length;

					if (counters[j] < Loop.MAX_SYNC_ITERATIONS)
						return loopFunc(batch, innerHelpers[j], myI);

					counters[j] = 0;
					setTimeout(() => loopFunc(batch, innerHelpers[j], myI), 0);
				}
				else if (callback && runningCount == 0)
				{
					callback();
				}
			}
			for (var j = 0; j < runningCountInitial; ++j)
			{
				counters[j] = 0;
				innerHelpers[j] = innerHelper.bind(null, j);
				innerHelpers[j]();
			}
		}
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var L = kr3m.async.Loop;
	var U = kr3m.util.Util;

	var emptyArray = U.fill(0, 0);
	var smallArray = U.fill(10, 0);
	var mediumArray = U.fill(100, 0);
	var bigArray = U.fill(1000, 0);
	var hugeArray = U.fill(10000, 0);

	new kr3m.unittests.Suite("kr3m.async.Loop")
	.setTimeout(3000)

	.add(new kr3m.unittests.Case("loop I", (callback) =>
	{
		var counter = 0;
		L.loop((next) =>
		{
			++counter;
			next(counter < smallArray.length);
		}, () => callback(counter));
	}, smallArray.length))
	.add(new kr3m.unittests.Case("loop II", (callback) =>
	{
		var counter = 0;
		L.loop((next) =>
		{
			++counter;
			next(counter < mediumArray.length);
		}, () => callback(counter));
	}, mediumArray.length))
	.add(new kr3m.unittests.Case("loop III", (callback) =>
	{
		var counter = 0;
		L.loop((next) =>
		{
			++counter;
			next(counter < bigArray.length);
		}, () => callback(counter));
	}, bigArray.length))
	.add(new kr3m.unittests.Case("loop IV", (callback) =>
	{
		var counter = 0;
		L.loop((next) =>
		{
			++counter;
			next(counter < hugeArray.length);
		}, () => callback(counter));
	}, hugeArray.length))

	.add(new kr3m.unittests.Case("times I", (callback) =>
	{
		var counter = 0;
		L.times(emptyArray.length, (i, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, emptyArray.length))
	.add(new kr3m.unittests.Case("times II", (callback) =>
	{
		var counter = 0;
		L.times(smallArray.length, (i, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, smallArray.length))
	.add(new kr3m.unittests.Case("times III", (callback) =>
	{
		var counter = 0;
		L.times(mediumArray.length, (i, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, mediumArray.length))
	.add(new kr3m.unittests.Case("times IV", (callback) =>
	{
		var counter = 0;
		L.times(bigArray.length, (i, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, bigArray.length))
	.add(new kr3m.unittests.Case("times V", (callback) =>
	{
		var counter = 0;
		L.times(hugeArray.length, (i, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, hugeArray.length))

	.add(new kr3m.unittests.Case("forEach I", (callback) =>
	{
		var counter = 0;
		L.forEach(emptyArray, (v, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, emptyArray.length))
	.add(new kr3m.unittests.Case("forEach II", (callback) =>
	{
		var counter = 0;
		L.forEach(smallArray, (v, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, smallArray.length))
	.add(new kr3m.unittests.Case("forEach III", (callback) =>
	{
		var counter = 0;
		L.forEach(mediumArray, (v, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, mediumArray.length))
	.add(new kr3m.unittests.Case("forEach IV", (callback) =>
	{
		var counter = 0;
		L.forEach(bigArray, (v, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, bigArray.length))
	.add(new kr3m.unittests.Case("forEach V", (callback) =>
	{
		var counter = 0;
		L.forEach(hugeArray, (v, next) =>
		{
			++counter;
			next();
		}, () => callback(counter));
	}, hugeArray.length))
	.add(new kr3m.unittests.Case("forEach VI", (callback) =>
	{
		var result = bigArray.map(b => 1);
		L.forEach(result, (v, next, i) =>
		{
			result[i] = 0;
			next();
		}, () => callback(result));
	}, bigArray))

	.add(new kr3m.unittests.Case("forEachBatch I", (callback) =>
	{
		var counter = 0;
		L.forEachBatch(emptyArray, 2, (batch, next) =>
		{
			counter += batch.length;
			next();
		}, () => callback(counter));
	}, emptyArray.length))
	.add(new kr3m.unittests.Case("forEachBatch II", (callback) =>
	{
		var counter = 0;
		L.forEachBatch(smallArray, 2, (batch, next) =>
		{
			counter += batch.length;
			next();
		}, () => callback(counter));
	}, smallArray.length))
	.add(new kr3m.unittests.Case("forEachBatch III", (callback) =>
	{
		var counter = 0;
		L.forEachBatch(mediumArray, 2, (batch, next) =>
		{
			counter += batch.length;
			next();
		}, () => callback(counter));
	}, mediumArray.length))
	.add(new kr3m.unittests.Case("forEachBatch IV", (callback) =>
	{
		var counter = 0;
		L.forEachBatch(bigArray, 2, (batch, next) =>
		{
			counter += batch.length;
			next();
		}, () => callback(counter));
	}, bigArray.length))
	.add(new kr3m.unittests.Case("forEachBatch V", (callback) =>
	{
		var counter = 0;
		L.forEachBatch(hugeArray, 2, (batch, next) =>
		{
			counter += batch.length;
			next();
		}, () => callback(counter));
	}, hugeArray.length))

	.run();
}, 1);
//# /UNITTESTS

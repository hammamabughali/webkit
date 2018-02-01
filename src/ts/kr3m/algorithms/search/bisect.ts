/// <reference path="../../types.ts"/>

//# UNITTESTS
/// <reference path="../../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.algorithms.search
{
	/*
		Führt das Intervallhalbierungsverfahren aus um
		die Position von searchValue in sortedValues
		zu ermitteln. sortedValues muss ein Array sein,
		der mit compareFunc sortiert wurde. Als Ergebnis
		wird die Position von searchValue in sortedValues
		zurück gegeben oder -1 falls searchValue nicht
		gefunden wurde. Falls searchValue mehr als einmal
		in sortedValues vorkommt, gibt bisect
		nicht-deterministisch eine der Positionen von
		searchValue zurück.
	*/
	export function bisect<T>(
		sortedValues:ArrayLike<T>,
		searchValue:T,
		compareFunc:(a:T, b:T) => number):number
	{
		var from = 0;
		var to = sortedValues.length;
		var i = -1;
		while (to != from)
		{
			i = Math.floor((to - from) / 2) + from;
			var comp = compareFunc(sortedValues[i], searchValue);
			if (comp == 0)
				return i;

			if (comp > 0)
				to = i;
			else
				from = i + 1;
		}
		return -1;
	}



	/*
		Gibt die Position in sortedValues zurück, an welcher
		insertValue in sortedValues eingefügt werden muss,
		damit sortedValues anschließend immer noch sortiert
		ist. Zum Vergleichen wird compareFunc zusammen mit
		dem Intervallhalbierungsverfahren verwendet.
	*/
	export function bisectInsertPos<T>(
		sortedValues:ArrayLike<T>,
		insertValue:T,
		compareFunc:(a:T, b:T) => number):number
	{
		var from = 0;
		var to = sortedValues.length;
		var i = 0;
		while (to != from)
		{
			i = Math.floor((to - from) / 2) + from;
			var comp = compareFunc(sortedValues[i], insertValue);
			if (comp == 0)
				return i;

			if (comp > 0)
				to = i;
			else
				from = i + 1;
		}
		if (comp < 0)
			return i + 1;
		else
			return i;
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var cmp = (a:number, b:number) => a - b;
	var b = kr3m.algorithms.search.bisect;
	var bip = kr3m.algorithms.search.bisectInsertPos;
	new kr3m.unittests.Suite("kr3m.algorithms.search.bisect")
	.add(new kr3m.unittests.CaseSync("bisect I", () => b([], 42, cmp), -1))
	.add(new kr3m.unittests.CaseSync("bisect II", () => b([42], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisect III", () => b([0, 1, 2, 3, 4, 5, 42], 42, cmp), 6))
	.add(new kr3m.unittests.CaseSync("bisect IV", () => b([42, 43, 44, 45, 46, 47], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisect V", () => b([43, 44, 45, 46, 47], 42, cmp), -1))
	.add(new kr3m.unittests.CaseSync("bisect VI", () => b([0, 1, 2, 3, 4, 5, 42, 43, 44, 45, 46, 47], 42, cmp), 6))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos I", () => bip([], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos II", () => bip([42], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos III", () => bip([0, 1, 2, 3, 4, 5, 42], 42, cmp), 6))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos IV", () => bip([42, 43, 44, 45, 46, 47], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos V", () => bip([43, 44, 45, 46, 47], 42, cmp), 0))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos VI", () => bip([0, 1, 2, 3, 4, 5, 42, 43, 44, 45, 46, 47], 42, cmp), 6))
	.add(new kr3m.unittests.CaseSync("bisectInsertPos VII", () => bip([0, 1, 2, 3, 4, 5], 42, cmp), 6))
	.run();
}, 1);
//# /UNITTESTS

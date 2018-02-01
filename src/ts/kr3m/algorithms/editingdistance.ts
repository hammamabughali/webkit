/// <reference path="../util/util.ts"/>

//# UNITTESTS
/// <reference path="../unittests/suite.ts"/>
//# /UNITTESTS



module kr3m.algorithms
{
	/*
		Berechnet die Levenshtein-Entfernung zweier Strings
		s und t.
	*/
	export function getEditingDistance(s:string, t:string):number
	{
		if (s == t)
			return 0;

		if (s.length == 0)
			return t.length;

		if (t.length == 0)
			return s.length;

		var v0 = kr3m.util.Util.fill(t.length + 1, (i:number) => i);
		var v1 = kr3m.util.Util.fill(t.length + 1, (i:number) => 0);

		for (var i = 0; i < s.length; ++i)
		{
			v1[0] = i + 1;

			for (var j = 0; j < t.length; ++j)
			{
				var cost = (s[i] == t[j]) ? 0 : 1;
				v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
			}

			for (var j = 0; j < v0.length; ++j)
				v0[j] = v1[j];
		}
		return v1[t.length];
	}
}



//# UNITTESTS
setTimeout(() =>
{
	var d = kr3m.algorithms.getEditingDistance;
	new kr3m.unittests.Suite("kr3m.algorithms")
	.add(new kr3m.unittests.CaseSync("getEditingDistance I", () => d("", ""), 0))
	.add(new kr3m.unittests.CaseSync("getEditingDistance II", () => d("Hans", "Hans"), 0))
	.add(new kr3m.unittests.CaseSync("getEditingDistance III", () => d("Hans", "Wurst"), 4))
	.add(new kr3m.unittests.CaseSync("getEditingDistance IV", () => d("Hamster", ""), 7))
	.add(new kr3m.unittests.CaseSync("getEditingDistance VI", () => d("", "Hamster"), 7))
	.add(new kr3m.unittests.CaseSync("getEditingDistance VII", () => d("TestWort", "eTtsoWtr"), 5))
	.run();
}, 1);
//# /UNITTESTS

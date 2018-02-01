/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class ObsoleteTable extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			var existing = Object.keys(structure);
			var desired = Object.keys(schema);
			for (var i = 0; i < existing.length; ++i)
			{
				if (!kr3m.util.Util.contains(desired, existing[i]))
				{
					var delta = new Delta();
					delta.isDrop = true;
					delta.message = "table " + existing[i] + " is obsolete";
					delta.fixScript = "DROP TABLE `" + existing[i] + "`;";
					deltas.push(delta);
				}
			}
			return deltas;
		}
	}
}

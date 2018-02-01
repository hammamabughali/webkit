/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class ObsoleteColumn extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in structure)
			{
				if (!schema[tableName])
					continue;

				var existing = Object.keys(structure[tableName].columns);
				var desired = Object.keys(schema[tableName].columns);
				for (var i = 0; i < existing.length; ++i)
				{
					if (!kr3m.util.Util.contains(desired, existing[i]))
					{
						var delta = new Delta();
						delta.isDrop = true;
						delta.message = "column " + tableName + "." + existing[i] + " is obsolete";
						delta.fixScript = "ALTER TABLE `" + tableName + "` DROP COLUMN `" + existing[i] + "`;";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

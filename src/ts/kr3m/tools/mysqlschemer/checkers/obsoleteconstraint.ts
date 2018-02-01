/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class ObsoleteConstraint extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in structure)
			{
				var existing = Object.keys(structure[tableName].constraints);
				var desired = schema[tableName] ? Object.keys(schema[tableName].constraints) : [];

				for (var i = 0; i < existing.length; ++i)
				{
					if (!kr3m.util.Util.contains(desired, existing[i]))
					{
						var constraint = structure[tableName].constraints[existing[i]];

						var delta = new Delta();
						delta.isDrop = true;
						delta.message = "constraint on column " + tableName + "." + existing[i] + " is obsolete";
						delta.fixScript = "ALTER TABLE `" + tableName + "` DROP FOREIGN KEY `" + constraint.name + "`;";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

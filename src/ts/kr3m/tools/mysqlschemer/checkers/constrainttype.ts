/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class ConstraintType extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in structure)
			{
				if (schema[tableName])
				{
					for (var colName in structure[tableName].constraints)
					{
						var existing = structure[tableName].constraints[colName];
						var desired = schema[tableName].constraints[colName];
						if (desired)
						{
							if (existing.foreignTable != desired.foreignTable || existing.foreignColumn != desired.foreignColumn)
							{
								var delta = new Delta();
								delta.isDrop = true;
								delta.message = "removing mismatched constraint on column " + tableName + "." + colName;
								delta.fixScript = "ALTER TABLE `" + tableName + "` DROP FOREIGN KEY `" + existing.name + "`;";
								deltas.push(delta);

								var delta = new Delta();
								delta.isDrop = true;
								delta.message = "adding new constraint on column " + tableName + "." + colName;
								delta.fixScript = "ALTER TABLE `" + tableName + "` ADD FOREIGN KEY (`" + desired.column + "`) REFERENCES `" + desired.foreignTable + "` (`" + desired.foreignColumn + "`) ON DELETE " + desired.onDelete + " ON UPDATE " + desired.onUpdate + ";";
								deltas.push(delta);
							}
						}
					}
				}
			}
			return deltas;
		}
	}
}

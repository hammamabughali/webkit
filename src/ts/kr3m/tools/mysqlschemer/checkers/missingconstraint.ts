/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class MissingConstraint extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in schema)
			{
				var existing = structure[tableName] ? Object.keys(structure[tableName].constraints) : [];
				var desired = Object.keys(schema[tableName].constraints);
				for (var i = 0; i < desired.length; ++i)
				{
					if (!kr3m.util.Util.contains(existing, desired[i]))
					{
						var constraint = schema[tableName].constraints[desired[i]];
						var delta = new Delta();
						delta.isDrop = false;
						delta.message = "constraint on column " + tableName + "." + desired[i] + " is missing";
						delta.fixScript = "ALTER TABLE `" + tableName + "` ADD FOREIGN KEY (`" + desired[i] + "`) REFERENCES `" + constraint.foreignTable + "` (`" + constraint.foreignColumn + "`) ON DELETE " + constraint.onDelete + " ON UPDATE " + constraint.onUpdate + ";";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

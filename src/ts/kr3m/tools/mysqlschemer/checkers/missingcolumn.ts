/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class MissingColumn extends Checker
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
				for (var i = 0; i < desired.length; ++i)
				{
					if (!kr3m.util.Util.contains(existing, desired[i]))
					{
						var delta = new Delta();
						delta.isDrop = true;
						delta.message = "column " + tableName + "." + desired[i] + " is missing";
						delta.fixScript = "ALTER TABLE `" + tableName + "` ADD COLUMN " + this.getColumnScript(desired[i], schema[tableName].columns[desired[i]], true) + ";";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

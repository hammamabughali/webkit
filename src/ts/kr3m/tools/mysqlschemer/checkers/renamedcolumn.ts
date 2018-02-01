/// <reference path="../../../tools/mysqlschemer/checker.ts"/>
/// <reference path="../../../util/util.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class RenamedColumn extends Checker
	{
		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in structure)
			{
				if (!schema[tableName])
					continue;

				var existing = Object.keys(structure[tableName].columns);
				for (var colId in schema[tableName].columns)
				{
					var oldNames = schema[tableName].columns[colId].oldNames;
					if (!oldNames)
						continue;

					if (existing.indexOf(colId) >= 0)
						continue;

					var intersect = kr3m.util.Util.intersect(oldNames, existing);
					if (intersect.length > 0)
					{
						var delta = new Delta();
						delta.isDrop = false;
						delta.message = "column " + tableName + "." + colId + " is still called " + tableName + "." + intersect[0];
						delta.fixScript = "ALTER TABLE `" + tableName + "` CHANGE `" + intersect[0] + "` " + this.getColumnScript(colId, schema[tableName].columns[colId], true) + ";";
						deltas.push(delta);

						structure[tableName].columns[colId] = structure[tableName].columns[intersect[0]];
						delete structure[tableName].columns[intersect[0]];
					}
				}
			}
			return deltas;
		}
	}
}

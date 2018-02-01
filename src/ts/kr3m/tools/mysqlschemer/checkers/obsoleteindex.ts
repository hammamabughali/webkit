/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class ObsoleteIndex extends Checker
	{
		private find(indexes:any[], desired:any):any
		{
			for (var i = 0; i < indexes.length; ++i)
			{
				for (var j = 0; j < desired.parts.length; ++j)
				{
					if (indexes[i].parts[j] != desired.parts[j])
						break;
				}
				if (j >= indexes[i].parts.length && j >= desired.parts.length)
				{
					switch (desired.type)
					{
						case "PRIMARY":
							if (!indexes[i].unique || indexes[i].name != "PRIMARY")
								continue;
							break;

						case "UNIQUE":
							if (!indexes[i].unique)
								continue;
							break;

						case "INDEX":
							if (indexes[i].unique)
								continue;
							break;
					}
					return indexes[i];
				}
			}
			return null;
		}



		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			for (var tableName in structure)
			{
				var existing = structure[tableName].indexes;
				var desired = schema[tableName] ? schema[tableName].indexes : [];
				for (var i = 0; i < existing.length; ++i)
				{
					var old = this.find(desired, existing[i]);
					if (!old)
					{
						var colName = existing[i].parts[0];
						var col = structure[tableName].columns[colName];
						if (col && col.Extra.indexOf("auto_increment") >= 0)
						{
							var delta = new Delta();
							delta.isDrop = false;
							delta.message = "auto_increment on " + tableName + "." + colName + " is obsolete";
							delta.fixScript = "ALTER TABLE `" + tableName + "` CHANGE `" + colName + "` `" + colName + "` " + col.Type.toUpperCase() + ";";
							deltas.push(delta);
						}

						var delta = new Delta();
						delta.isDrop = true;
						delta.message = "index on " + tableName + " for " + existing[i].parts.join(",") + " is obsolete";
						delta.fixScript = "DROP INDEX `" + existing[i].name + "` ON `" + tableName + "`;";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

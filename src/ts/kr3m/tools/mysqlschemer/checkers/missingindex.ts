/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class MissingIndex extends Checker
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
			for (var tableName in schema)
			{
				var existing = structure[tableName] ? structure[tableName].indexes : [];
				var desired = schema[tableName].indexes;
				for (var i = 0; i < desired.length; ++i)
				{
					var old = this.find(existing, desired[i]);
					if (!old)
					{
						var delta = new Delta();
						delta.isDrop = false;
						delta.message = "index on " + tableName + " for " + desired[i].parts.join(",") + " is missing";
						var keyType = (desired[i].type == "PRIMARY") ? "PRIMARY KEY" : desired[i].type;
						delta.fixScript = "ALTER TABLE `" + tableName + "` ADD " + keyType + " (" + this.joinIds(desired[i].parts) + ");";
						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

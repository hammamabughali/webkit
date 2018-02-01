/// <reference path="../../../tools/mysqlschemer/checker.ts"/>



module kr3m.tools.mysqlschemer.checkers
{
	export class MissingTable extends Checker
	{
		private getColumnsScript(tableSchema:any):string
		{
			var lines:string[] = [];
			for (var colName in tableSchema)
				lines.push(this.getColumnScript(colName, tableSchema[colName], false));
			return lines.join(", ");
		}



		public findDeltas(structure:any, schema:any):Delta[]
		{
			var deltas:Delta[] = [];
			var existing = Object.keys(structure);
			var desired = Object.keys(schema);
			for (var i = 0; i < desired.length; ++i)
			{
				if (!kr3m.util.Util.contains(existing, desired[i]))
				{
					var delta = new Delta();
					delta.isDrop = false;
					delta.message = "table " + desired[i] + " is missing";
					delta.fixScript = "CREATE TABLE `" + desired[i] + "` (" + this.getColumnsScript(schema[desired[i]].columns) + ");";
					deltas.push(delta);

					var items = schema[desired[i]].defaultItems;
					for (var j = 0; j < items.length; ++j)
					{
						var item = this.db.escapeObject(items[j]);
						var keys = kr3m.util.StringEx.joinKeys(item, "`,`");
						var values = kr3m.util.StringEx.joinValues(item);

						var delta = new Delta();
						delta.isDrop = false;
						delta.message = "inserting default item";
						delta.fixScript = "INSERT INTO `" + desired[i] + "` (`" + keys + "`) VALUES (" + values + ");";

						deltas.push(delta);
					}
				}
			}
			return deltas;
		}
	}
}

/// <reference path="../../db/mysqldb.ts"/>



module kr3m.tools.mysqlschemer
{
	export class Model
	{
		constructor(protected db:kr3m.db.MySqlDb)
		{
		}



		protected escapeString(text:string):string
		{
			return text.replace(/'/g, "''")
		}



		protected doesColumnStructureMatchSchema(
			colStructure:any,
			colSchema:any):boolean
		{
			switch (colSchema.jsonType)
			{
				case "boolean":
					if (colStructure.Type != "enum('false','true')")
						return false;
					if (colStructure.Default !== (colSchema.defaultValue || false).toString())
						return false;
					break;

				case "date":
					if (colStructure.Type != "timestamp")
						return false;
					if (colSchema.onUpdateCurrent && colStructure.Default != "CURRENT_TIMESTAMP")
						return false;
					if (!colSchema.onUpdateCurrent && colStructure.Default != colSchema.defaultValue)
						return false;
					break;

				case "number":
					if (colSchema.float && colStructure.Type != "float")
						return false;
					if (!colSchema.float && colSchema.unsigned && colSchema.big && !colStructure.Type.match(/^bigint\(\d+\) unsigned$/))
						return false;
					if (!colSchema.float && !colSchema.unsigned && colSchema.big && !colStructure.Type.match(/^bigint\(\d+\)$/))
						return false;
					if (!colSchema.float && colSchema.unsigned && !colSchema.big && !colStructure.Type.match(/^int\(\d+\) unsigned$/))
						return false;
					if (!colSchema.float && !colSchema.unsigned && !colSchema.big && !colStructure.Type.match(/^int\(\d+\)$/))
						return false;
					if ((colSchema.defaultValue !== undefined ? colSchema.defaultValue : 0) != colStructure.Default)
						return false;
					break;

				case "enum":
					if (colStructure.Type != "enum('" + colSchema.values.join("','") + "')")
						return false;
					if (colSchema.defaultValue && colSchema.defaultValue != colStructure.Default)
						return false;
					break;

				case "set":
					if (colStructure.Type != "set('" + colSchema.values.join("','") + "')")
						return false;
					if (colSchema.defaultValue && colStructure.Default != "'" + colSchema.defaultValue.join("','") + "'")
						return false;
					break;

				case "string":
					if (colSchema.maxLength > 0 && colStructure.Type != "varchar(" + colSchema.maxLength + ")")
						return false;
					if (colSchema.maxLength < 1 && colStructure.Type != "text")
						return false;
					if (colSchema.maxLength > 0 && colSchema.defaultValue !== null && colSchema.defaultValue != colStructure.Default)
						return false;
					if (colSchema.defaultValue === null && colStructure.Null == "NO")
						return false;
					break;
			}

			if ((colSchema.comment || "") != colStructure.Comment)
				return false;

			return true;
		}



		protected getColumnScript(
			colName:string,
			colSchema:any,
			alterMode:boolean):string
		{
			var script = "`" + colName + "` ";
			switch (colSchema.jsonType)
			{
				case "enum":
					script += "ENUM(" + this.joinStrings(colSchema.values) + ") NOT NULL";
					if (typeof colSchema.defaultValue == "string")
						script += " DEFAULT '" + colSchema.defaultValue + "'";
					break;

				case "set":
					script += "SET(" + this.joinStrings(colSchema.values) + ") NOT NULL DEFAULT '" + colSchema.defaultValues.join(",") + "'";
					break;

				case "string":
					if (colSchema.maxLength > 0)
					{
						if (colSchema.defaultValue === null)
							script += "VARCHAR(" + colSchema.maxLength + ") DEFAULT NULL";
						else
							script += "VARCHAR(" + colSchema.maxLength + ") NOT NULL DEFAULT '" + this.escapeString(colSchema.defaultValue) + "'";
					}
					else
					{
						if (colSchema.defaultValue === null)
							script += "TEXT";
						else
							script += "TEXT NOT NULL";
					}
					break;

				case "number":
					var intType = colSchema.big ? "BIGINT" : "INT";
					intType = colSchema.unsigned ? intType + " UNSIGNED" : intType;

					if (colSchema.defaultValue === null)
						script += (colSchema.float ? "FLOAT" : intType) + " DEFAULT NULL";
					else
						script += (colSchema.float ? "FLOAT" : intType) + " NOT NULL DEFAULT " + colSchema.defaultValue;
					break;

				case "boolean":
					script += "ENUM('false', 'true') NOT NULL DEFAULT '" + (colSchema.defaultValue ? "true" : "false") + "'";
					break;

				case "date":
					if (colSchema.onUpdateCurrent)
						script += "TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP";
					else if (colSchema.defaultValue === null)
						script += "TIMESTAMP NULL DEFAULT NULL";
					else
						script += "TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00'";
					break;

				default:
					throw new Error("unknown json type " + colSchema.jsonType + " in schema");
			}

			if (colSchema.comment)
				script += this.db.escape(" COMMENT ?", [colSchema.comment]);

			if (alterMode && colSchema.after)
				script += " AFTER `" + colSchema.after + "`";
			return script;
		}



		protected joinStrings(strings:string[]):string
		{
			strings = strings.map((text:string) => this.escapeString(text));
			return "'" + strings.join("','") + "'";
		}



		protected joinIds(ids:string[]):string
		{
			return "`" + ids.join("`,`") + "`";
		}
	}
}

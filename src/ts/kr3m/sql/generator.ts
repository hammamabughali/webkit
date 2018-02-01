/// <reference path="../util/stringex.ts"/>



module kr3m.sql
{
	export class Generator
	{
		constructor(protected connectionPool:any)
		{
		}



		public escapeValue(value:any):any
		{
			if (typeof value == "boolean")
				return value ? "'true'" : "'false'";

			if ((value === undefined) || (value === null))
				return 'NULL';

			return this.connectionPool.escape(value);
		}



		public escape(sql:string, values:any):string
		{
			if (Array.isArray(values))
			{
				var parts = sql.split("?");
//# DEBUG
				if (parts.length != values.length + 1)
				{
					logWarning("questionmark count and value count in SQL statement do not match");
					logWarning(sql);
					logWarning(values);
				}
//# /DEBUG
				for (var i = 0; i < values.length; ++i)
					parts.splice(i * 2 + 1, 0, this.escapeValue(values[i]));
				sql = parts.join("");
			}
			else
			{
				var keys = Object.keys(values);
				keys.sort((a, b) => b.length - a.length);
				for (var i = 0; i < keys.length; ++i)
					sql = kr3m.util.StringEx.literalReplace(sql, ":" + keys[i], this.escapeValue(values[keys[i]]));
			}
			return sql;
		}



		public escapeId(id:string):string
		{
			return this.connectionPool.escapeId(id);
		}



		public escapeObject(obj:any):any
		{
			var result:any = {};
			for (var i in obj)
			{
				if (typeof obj[i] != "function")
					result[i] = this.escapeValue(obj[i]);
			}
			return result;
		}



		public where(obj:Object|string, tableName?:string):string
		{
			if (typeof obj == "string")
				return " WHERE " + obj.replace(/^\s*WHERE\s*/i, "");

			var escaped = this.escapeObject(obj);
			var keys = Object.keys(escaped);
			if (keys.length == 0)
				return " WHERE 1 ";

			var fields = keys.map(key => "`" + key + "`");
			if (tableName)
				fields = fields.map(field => "`" + tableName + "`." + field);

			var parts:string[] = [];
			for (var i = 0; i < keys.length; ++i)
			{
				if (Array.isArray(obj[keys[i]]))
				{
					if (obj[keys[i]].length > 0)
					{
						parts.push(fields[i] + " IN (" + escaped[keys[i]] + ")");
					}
					else
					{
						logWarning("field", fields[i], "in sql where has an empty array value:", obj);
						parts.push("0");
					}
				}
				else if (obj[keys[i]] === null)
				{
					parts.push(fields[i] + " IS NULL");
				}
				else
				{
					parts.push(fields[i] + " = " + escaped[keys[i]]);
				}
			}
			return " WHERE " + parts.join(" AND ");
		}



		public fetchPage(
			tableName:string,
			where:Object|string,
			orderBy:{col:string, asc:boolean}[],
			joins:{localCol:string, foreignCol:string, tableName:string}[],
			offset:number,
			limit:number):{sql:string, countSql:string}
		{
			var sql = "SELECT * FROM `" + tableName + "`";
			var countSql = "SELECT COUNT(*) FROM `" + tableName + "`";
			var whereSql = this.where(where);
			var limitSql = this.escape(" LIMIT ?, ?", [offset, limit]);

			var joinSql = "";
			for (var i = 0; i < joins.length; ++i)
			{
				joinSql += " LEFT JOIN `" + joins[i].tableName;
				joinSql += "` ON `" + tableName + "`.`" + joins[i].localCol + "` = `";
				joinSql += joins[i].tableName + "`.`" + joins[i].foreignCol + "`";
			}

			var orderSql = "";
			if (orderBy.length > 0)
			{
				orderSql = " ORDER BY ";
				orderSql += orderBy.map(o => "`" + o.col + "` " + (o.asc ? "ASC" : "DESC")).join(" ");
			}

			var result =
			{
				sql : sql + joinSql + whereSql + orderSql + limitSql,
				countSql : countSql + joinSql + whereSql
			};
			return result;
		}



		public insert(
			tableName:string,
			obj:any):string
		{
			var item = this.escapeObject(obj);
			var sql = "INSERT INTO `" + tableName;
			sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
			sql += kr3m.util.StringEx.joinValues(item) + ");";
			return sql;
		}



		public insertBatch(
			tableName:string,
			objects:Object[]):string
		{
			if (objects.length == 0)
				return "";

			var keys:Object = {};
			for (var i = 0; i < objects.length; ++i)
			{
				for (var j in objects[i])
				{
					if (typeof objects[i][j] != "function")
						keys[j] = true;
				}
			}

			var sql = "INSERT INTO `" + tableName;
			sql += "` (`" + kr3m.util.StringEx.joinKeys(keys, "`,`") + "`) VALUES ";

			var parts:string[] = [];
			for (var i = 0; i < objects.length; ++i)
			{
				var item:Object = {};
				for (var j in keys)
				{
					if (typeof objects[i][j] == "undefined")
						item[j] = '';
					else
						item[j] = this.escapeValue(objects[i][j]);
				}
				parts.push("(" + kr3m.util.StringEx.joinValues(item) + ")");
			}
			sql += parts.join();
			return sql;
		}



		public replace(
			tableName:string,
			obj:Object):string
		{
			var item = this.escapeObject(obj);
			var sql = "REPLACE INTO `" + tableName;
			sql += "` (`" + kr3m.util.StringEx.joinKeys(item, "`,`") + "`) VALUES (";
			sql += kr3m.util.StringEx.joinValues(item) + ");";
			return sql;
		}



		public replaceBatch(
			tableName:string,
			objects:Object[]):string
		{
			if (objects.length == 0)
				return "";

			var keys:Object = {};
			for (var i = 0; i < objects.length; ++i)
			{
				for (var j in objects[i])
					keys[j] = true;
			}

			var sql = "REPLACE INTO `" + tableName;
			sql += "` (`" + kr3m.util.StringEx.joinKeys(keys, "`,`") + "`) VALUES ";
			var parts:string[] = [];
			for (var i = 0; i < objects.length; ++i)
			{
				var item:Object = {};
				for (var j in keys)
				{
					if (typeof objects[i][j] == "undefined")
						item[j] = '';
					else
						item[j] = this.escapeValue(objects[i][j]);
				}
				parts.push("(" + kr3m.util.StringEx.joinValues(item) + ")");
			}
			sql += parts.join();
			return sql;
		}



		public updateField(
			tableName:string,
			field:string,
			value:Object,
			where:string):string
		{
			var sql = "UPDATE `" + tableName + "` SET `";
			sql += field;
			sql += "` = ? ";
			sql = this.escape(sql, [value]);
			sql += " WHERE " + where.replace(/^\s*WHERE\s*/i, "");
			return sql;
		}



		private getKeyValues(
			obj:Object,
			indexCol:string|string[]):any
		{
			var keyValues:any = {};
			var keys:string[] = typeof indexCol == "string" ? [<string> indexCol] : <string[]> indexCol;
			for (var i = 0; i < keys.length; ++i)
				keyValues[keys[i]] = obj[keys[i]];
			return keyValues;
		}



		public update(
			tableName:string,
			obj:Object,
			indexCol:string|string[] = "id"):string
		{
			var item = this.escapeObject(obj);
			var sql = "UPDATE `" + tableName + "` SET `";
			sql += kr3m.util.StringEx.joinAssoc(item, ", `", "` =");
			sql += this.where(this.getKeyValues(obj, indexCol));
			sql += ";\n";
			return sql;
		}



		public truncate(tableName:string):string
		{
			var sql = "TRUNCATE `" + tableName + "`;";
			return sql;
		}



		public delete(
			tableName:string,
			obj:Object):string
		{
			if (obj["id"])
			{
				var sql = "DELETE FROM `" + tableName + "` WHERE id = ? LIMIT 1;";
				sql = this.escape(sql, [obj["id"]]);
				return sql;
			}
			else
			{
				var item = this.escapeObject(obj);
				var sql = "DELETE FROM `" + tableName + "` WHERE `";
				sql += kr3m.util.StringEx.joinAssoc(item, " AND `", "` = ");
				sql += " LIMIT 1;";
				return sql;
			}
		}



		public deleteBatch(
			tableName:string,
			where:string|Object):string
		{
			if (typeof where != "string")
			{
				var parts:string[] = [];
				for (var i in <any> where)
				{
					if (typeof where[i] != "function")
						parts.push("`" + i + "` = " + this.escapeValue(where[i]));
				}
				where = parts.join(" AND ");
			}
			else
			{
				where = where.replace(/^\s*where\s*/i, "");
			}

			var sql = "DELETE FROM `" + tableName + "` WHERE " + where;
			return sql;
		}



		public dropTable(tableName:string):string
		{
			var sql = "SET FOREIGN_KEY_CHECKS=0; DROP TABLE " + tableName + "; SET FOREIGN_KEY_CHECKS=1;";
			return sql;
		}
	}
}

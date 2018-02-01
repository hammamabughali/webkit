/// <reference path="../db/mysqldb.ts"/>
/// <reference path="../types.ts"/>



//# EXPERIMENTAL
module kr3m.sql
{
	export class Transaction
	{
		private queries:string[] = [];



		public addQuery(query:string):this
		{
			this.queries.push(query);
			return this;
		}



		public commit(
			db:kr3m.db.MySqlDb,
			callback?:Callback,
			errorCallback?:ErrorCallback):this
		{
			var sql = "START TRANSACTION;\n";
			sql += this.queries.join("\n");
			sql += "COMMIT;\n";
			db.query(sql, () => callback && callback(), errorCallback);
			return this;
		}
	}
}
//# /EXPERIMENTAL

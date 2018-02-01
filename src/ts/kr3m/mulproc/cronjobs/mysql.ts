/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../mulproc/cronjobs/abstract.ts"/>



module kr3m.mulproc.cronjobs
{
	/*
		Class for handling timely executions of background jobs on
		distributed servers using a MySQL database for synchronization
		between processes. The required table can be created using the
		following MySQL-statement:

			CREATE TABLE `cronjobs` (
			`id` varchar(64) NOT NULL,
			`occasion` varchar(64) NOT NULL,
			`runtime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
			`status` enum('STARTED','COMPLETED','FAILED') NOT NULL DEFAULT 'STARTED'
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;

			ALTER TABLE `cronjobs`
			ADD PRIMARY KEY (`id`,`occasion`,`runtime`) USING BTREE;
	*/
	export class MySql extends Abstract
	{
		public static db:kr3m.db.MySqlDb;
		public static tableName = "cronjobs";
		public static entryTtl = 30 * 24 * 60 * 60 * 1000;

		private static cleaning = false;



		constructor(
			id:string,
			func:(callback:SuccessCallback) => void)
		{
			super(id, func);
			MySql.cleanDatabase();
		}



		private static cleanDatabase():void
		{
			if (MySql.cleaning)
				return;

			MySql.cleaning = true;
			setInterval(() =>
			{
				var threshold = new Date(Date.now() - MySql.entryTtl);
				var where = MySql.db.escape("`runtime` < ?", [threshold]);
				MySql.db.deleteBatch(MySql.tableName, where);
			}, 60 * 60 * 1000);
		}



		protected getLastRun(occasion:string, callback:CB<Date>):void
		{
			var sql = "SELECT `runtime` FROM " + MySql.db.escapeId(MySql.tableName);
			sql += " WHERE `id` = ? AND `occasion` = ? ORDER BY `runtime` DESC LIMIT 1;";
			sql = MySql.db.escape(sql, [this.id, occasion]);
			MySql.db.fetchOne(sql, callback);
		}



		protected start(
			occasion:string,
			runtime:Date,
			callback:SuccessCallback):void
		{
			var obj =
			{
				id : this.id,
				occasion : occasion,
				runtime : runtime
			};
			MySql.db.insert(MySql.tableName, obj, () => callback(true), () => callback(false));
		}



		protected end(
			occasion:string,
			runtime:Date,
			success:boolean):void
		{
			var obj =
			{
				id : this.id,
				occasion : occasion,
				runtime : runtime,
				status : success ? "COMPLETED" : "FAILED"
			};
			MySql.db.update(MySql.tableName, obj, null, ["id", "occasion", "runtime"]);
		}
	}
}

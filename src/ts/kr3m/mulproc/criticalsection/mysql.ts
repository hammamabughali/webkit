/// <reference path="../../async/loop.ts"/>
/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../mulproc/criticalsection/abstract.ts"/>



module kr3m.mulproc.criticalsection
{
	/*
		You can use the following SQL script to create a table
		that can be used for this class:

			CREATE TABLE `critical_sections` (
			`id` varchar(64) NOT NULL,
			`count` int(11) NOT NULL DEFAULT '0'
			) ENGINE=InnoDB DEFAULT CHARSET=utf8;

			ALTER TABLE `critical_sections`
			ADD PRIMARY KEY (`id`);
	*/
	export class MySql extends Abstract
	{
		public static db:kr3m.db.MySqlDb;
		public static tableName = "critical_sections";



		public static resetAllSections(callback?:Callback):void
		{
			MySql.db.deleteBatch(MySql.tableName, "1", () => callback && callback());
		}



		private changeCount(delta:number, callback?:Callback):void
		{
			MySql.db.upsert(MySql.tableName, {id : this.id, count : delta}, callback, {count : {method : "accumulate"}});
		}



		private getCount(callback:CB<number>):void
		{
			var sql = "SELECT `count` FROM `" + MySql.tableName + "` WHERE `id` = ? LIMIT 1;"
			sql = MySql.db.escape(sql, [this.id]);
			MySql.db.fetchOne(sql, (count) => callback(count || 0));
		}



		public enter(callback:(exit:Callback) => void):void
		{
			var waitTime = 0;
			kr3m.async.Loop.loop((loopDone) =>
			{
				this.getCount((count) =>
				{
					if (count >= this.limit)
					{
						waitTime = Math.min(waitTime + 100, 5000);
						setTimeout(loopDone, waitTime);
						return;
					}

					waitTime = 0;
					this.changeCount(1, () =>
					{
						this.getCount((count) =>
						{
							if (count > this.limit)
							{
								this.changeCount(-1, () =>
								{
									waitTime = Math.min(waitTime + 100, 5000);
									setTimeout(loopDone, waitTime);
								});
							}
							else
							{
								callback(() =>
								{
									this.changeCount(-1);
								});
							}
						});
					});
				});
			});
		}
	}
}

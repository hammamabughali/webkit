/// <reference path="../../async/delayed.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../async/queue.ts"/>
/// <reference path="../../constants.ts"/>
/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../db/mysqldbconfig.ts"/>
/// <reference path="../../lib/node.ts"/>
/// <reference path="../../tools/mysqlvogenerator/constants.ts"/>
/// <reference path="../../tools/mysqlvogenerator/parameters.ts"/>
/// <reference path="../../tools/mysqlvogenerator/subgens/constgen.ts"/>
/// <reference path="../../tools/mysqlvogenerator/subgens/tabgen.ts"/>
/// <reference path="../../tools/mysqlvogenerator/subgens/vogen.ts"/>
/// <reference path="../../util/log.ts"/>



module kr3m.tools.mysqlvogenerator
{
	export class Generator
	{
		private delay = new kr3m.async.Delayed();



		public runWithParameters(
			params:kr3m.tools.mysqlvogenerator.Parameters):void
		{
			if (params.silent)
				kr3m.util.Log.enabled = false;

			log("kr3m MySQL TypeScript VO Generator", kr3m.VERSION);

			var dbConfig = new kr3m.db.MySqlDbConfig();
			dbConfig.host = params.dbHost;
			dbConfig.user = params.dbUser;
			dbConfig.password = params.dbPassword;
			dbConfig.database = params.dbDatabase;
			var db = new kr3m.db.MySqlDb(dbConfig);

			db.getTableNames((tableNames) =>
			{
				kr3m.async.Loop.forEach(tableNames, (tableName, loopCallback) =>
				{
					var queue = new kr3m.async.Queue(true);
					queue.add((queueCallback) =>
					{
						var constGen = new kr3m.tools.mysqlvogenerator.subgens.ConstGen(db, params, tableName);
						constGen.generate(queueCallback);
					});
					queue.add((queueCallback) =>
					{
						var voGen = new kr3m.tools.mysqlvogenerator.subgens.VoGen(db, params, tableName);
						voGen.generate(queueCallback);
					});
					queue.add((queueCallback) =>
					{
						var tabGen = new kr3m.tools.mysqlvogenerator.subgens.TabGen(db, params, tableName);
						tabGen.generate(queueCallback);
					});
					queue.add(loopCallback);
				}, () =>
				{
					log("DONE");
					process.exit(0);
				});
			});
		}



		public run():void
		{
			var params = new kr3m.tools.mysqlvogenerator.Parameters(process.argv);
			this.runWithParameters(params);
		}
	}
}

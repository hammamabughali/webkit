/// <reference path="../../cuboro/tables/adminsettingstable.ts"/>
/// <reference path="../../kr3m/async/join.ts"/>
/// <reference path="../../kr3m/net2/handlers/status.ts"/>



module cuboro.handlers
{
	export class Status extends kr3m.net2.handlers.Status
	{
		protected getStatus(
			callback:(status:{[group:string]:{[property:string]:any}}) => void):void
		{
			super.getStatus((status:{[group:string]:{[property:string]:any}}) =>
			{
				var join = new kr3m.async.Join();
				tAdminSettings.getById("DB_VERSION", join.getCallback("dbVersion"));
				db.getDatabaseSize(join.getCallback("dbSize"));
				join.addCallback(() =>
				{
					status["Server"] = status["Server"] || {};
					status["Server"]["Version"] = cuboro.VERSION;

					status["Database"] = status["Database"] || {};
					status["Database"]["Host"] = db.config.host;
					status["Database"]["Name"] = db.config.database;
					status["Database"]["Expected Version"] = cuboro.DB_VERSION;
					var dbVersion:cuboro.tables.AdminSettingVO = join.getResult("dbVersion");
					status["Database"]["Version"] = dbVersion ? dbVersion.value : "-";
					var dbSize:number = join.getResult("dbSize");
					status["Database"]["Size"] = kr3m.util.StringEx.getSizeString(dbSize);

					callback(status);
				});
			});
		}
	}
}

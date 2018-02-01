/// <reference path="../db/database.ts"/>
/// <reference path="../db/mongodbconfig.ts"/>
/// <reference path="../lib/mongodb.ts"/>
/// <reference path="../util/log.ts"/>



module kr3m.db
{
	/*
		Bequemlichkeitsklasse zum Zugriff auf MongoDB Datenbanken
	*/
	export class MongoDb extends kr3m.db.Database
	{
		private client:any;
		private db:any;



		constructor(config:kr3m.db.MongoDbConfig)
		{
			super(config);
			this.connect();
		}



		public getConnectUrl():string
		{
			var url:string = "mongodb://";
			url += this.config.hosts.join(",");
			url += "/" + this.config.database;
			return url;
		}



		private connect():void
		{
			this.client = mongoLib.MongoClient;
			var url = this.getConnectUrl();
			this.client.connect(url, (err, db) =>
			{
				this.db = db;
			});
		}



		public query(collectionName:string, query:any, callback:(data:any) => void):void
		{
			this.db.collection(collectionName, (err, coll) =>
			{
				coll.find(query).toArray((err, data) =>
				{
					callback(data);
					this.db.close();
				});
			});
		}



		public save(collectionName:string, obj:any, callback:(data:any) => void = null):void
		{
			//# FIXME: NYI
		}
	}
}

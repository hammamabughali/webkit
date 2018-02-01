module kr3m.db
{
	export class MongoDbConfig
	{
		public hosts:Array<string> = ["localhost:27017"];
		public database:string = "myDatabase";
	}
}

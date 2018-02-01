/// <reference path="../db/database.ts"/>
/// <reference path="../db/memorydbconfig.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../util/json.ts"/>



module kr3m.db
{
	/*
		Eine Pseudo-Datenbank, die zum Entwickeln und Debuggen
		verwendet werden kann, wenn gerade keine andere Datenbank
		zur Verfügung steht. Sie ist JSON-basiert, erlaubt nur
		eine einzelne ID als Index, liegt komplett im Speicher
		des Servers und kann den "Datenbankinhalt" als JSON-Datei
		auf der Festplatte speichern und wieder daraus laden.
	*/
	export class MemoryDb extends kr3m.db.Database
	{
		private data:any = {};
		private dirty:boolean = false;



		constructor(config:kr3m.db.MemoryDbConfig)
		{
			super(config);
			this.config = config;
			this.loadFromFile();

			setInterval(this.onTick.bind(this), 10000);
		}



		private onTick():void
		{
			if (this.dirty)
				this.saveToFile();
		}



		private loadFromFile():void
		{
			this.dirty = false;

			try
			{
				var fileContent = fsLib.readFileSync(this.config.backupPath, {encoding:"utf8"});
				this.data = kr3m.util.Json.decode(fileContent) || {};
			}
			catch(err)
			{
//# DEBUG
				logError(err);
//# /DEBUG
				this.data = {};
			}
		}



		public forEach(collectionName:string, func:(data:any) => void):void
		{
			if (this.data[collectionName])
			{
				for (var i in this.data[collectionName])
					func(this.data[collectionName][i]);
			}
		}



		public delete(collectionName:string, query:any, callback:() => void = null):void
		{
			if (this.data[collectionName] && this.data[collectionName][query])
				delete this.data[collectionName][query];

			if (callback)
				callback();
		}



		public query(collectionName:string, query:any, callback:(data:any) => void):void
		{
			if (this.data[collectionName])
				callback(this.data[collectionName][query]);
			else
				callback(null);
		}



		private saveToFile():void
		{
			fsLib.writeFileSync(this.config.backupPath, kr3m.util.Json.encode(this.data));
			this.dirty = false;
		}



		public flush():void
		{
			this.saveToFile();
		}



		public save(collectionName:string, obj:any, callback:() => void = null):void
		{
			if (!this.data[collectionName])
				this.data[collectionName] = {};

			if (obj.id === undefined)
				obj.id = this.getFreeId(collectionName);

			this.data[collectionName][obj.id] = obj;

			this.dirty = true;

			if (callback)
				callback();
		}



		public getFreeId(collectionName:string):number
		{
			if (!this.data[collectionName])
				return 0;

			var i = 0;
			while (this.data[collectionName][i] !== undefined)
				++i;
			return i;
		}
	}
}

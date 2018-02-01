/// <reference path="../async/delayed.ts"/>
/// <reference path="../async/join.ts"/>
/// <reference path="../db/indexeddbversion.ts"/>
/// <reference path="../util/log.ts"/>



//# EXPERIMENTAL
module kr3m.db
{
	/*
		Hilfsklasse zum Arbeiten mit der IndexedDb im Browser, also praktisch
		dem großen Bruder von LocalStorage.
	*/
	export class IndexedDb
	{
		private dbName:string;
		private db:IDBDatabase;
		private versions:IndexedDbVersion[] = [];
		private readyDelay = new kr3m.async.Delayed();



		constructor(dbName:string)
		{
			window.indexedDB = window.indexedDB || window["mozIndexedDB"] || window["webkitIndexedDB"] || window["msIndexedDB"];
			window["IDBTransaction"] = window["IDBTransaction"] || window["webkitIDBTransaction"] || window["msIDBTransaction"] || {READ_WRITE: "readwrite"};
			window["IDBKeyRange"] = window["IDBKeyRange"] || window["webkitIDBKeyRange"] || window["msIDBKeyRange"];

			if (!indexedDB)
			{
				logError("indexedDB not supported in this browser");
				return;
			}

			this.dbName = dbName;
		}



		protected whenReady(
			callback:() => void,
			errorCallback?:(errorMessage:string) => void):void
		{
			this.readyDelay.call(callback);
			if (this.db)
				return;

			var request = indexedDB.open(this.dbName, this.versions.length);

			request.onerror = (event:any) =>
			{
				if (errorCallback)
					return errorCallback("IndexedDB.open() failed with error " + event.target.errorCode);
				logError("IndexedDB.open() failed with error", event.target.errorCode);
			};

			request.onsuccess = (event:any) =>
			{
				this.db = event.target.result;
				this.readyDelay.execute();
			};

			request.onupgradeneeded = (event:any) =>
			{
				this.db = event.target.result;
				this.upgrade(event.oldVersion, event.newVersion);
			};
		}



		protected addVersion():IndexedDbVersion
		{
			var version = new IndexedDbVersion();
			this.versions.push(version);
			return version;
		}



		public isSupported():boolean
		{
			return !!indexedDB;
		}



		private upgrade(
			fromVersion:number, toVersion:number):void
		{
			var versions = this.versions.slice(fromVersion, toVersion);
			var join = new kr3m.async.Join();
			for (var i = 0; i < versions.length; ++i)
				versions[i].flush(this.db, join.getCallback());
			join.addCallback(() => this.readyDelay.execute());
		}



		public add(
			storeName:string, obj:any,
			callback?:(insertId:any) => void,
			errorCallback?:(errorMessage:string) => void):void
		{
			this.whenReady(() =>
			{
				var request = this.db.transaction(storeName, "readwrite").objectStore(storeName).add(obj);
				request.onsuccess = (event:any) => callback && callback(event.target.result);
				request.onerror = (event:any) =>
				{
					logError(event);
				};
			});
		}



		public get(
			storeName:string, keyValue:any,
			callback:(obj:any) => void,
			errorCallback?:(errorMessage:string) => void):void
		{
			this.whenReady(() =>
			{
				var request = this.db.transaction(storeName).objectStore(storeName).get(keyValue);
				request.onsuccess = (event:any) => callback(event.target.result);
				request.onerror = (event:any) =>
				{
					logError(event);
				};
			});
		}
	}
}
//# /EXPERIMENTAL

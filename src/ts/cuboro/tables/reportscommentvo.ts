﻿/*
	This file was automatically created using a source code generator.
	Do not edit this file manually as all changes will be overwritten
	the next time the generator runs again.
*/



/// <reference path="../../cuboro/tables/commentvo.ts"/>
/// <reference path="../../cuboro/tables/uservo.ts"/>
/// <reference path="../../kr3m/types.ts"/>
//# !CLIENT
/// <reference path="../../kr3m/services/paramshelper.ts"/>
/// <reference path="../../kr3m/util/factory.ts"/>
//# /!CLIENT



module cuboro.tables
{
	export class ReportscommentVO
	{
		public commentId:number; // int unsigned
		public createdWehn:Date = new Date(); // timestamp
		public id:number; // int
		public userId:number; // bigint unsigned
//# !CLIENT



		public static isColumnName(name:string):boolean
		{
			return (["commentId","createdWehn","id","userId"]).indexOf(name) >= 0;
		}



		public static getColumnNames():string[]
		{
			return ["commentId","createdWehn","id","userId"];
		}



		/*
			Builds a proper cuboro.tables.ReportscommentVO class object from
			a POD / JSON object.

			If this is not possible, because some required attributes
			are missing for example, null will be returned.
		*/
		public static buildFrom(raw:any):cuboro.tables.ReportscommentVO
		{
			var helper = new kr3m.services.ParamsHelper(raw);
			if (!helper.validate({"commentId":"number","createdWehn":"Date","id":"number","userId":"number"}, {"createdWehn":"CURRENT_TIMESTAMP"}))
				return null;

			var foreignKeyNames = ["commentId","userId"];
			var vo = new cuboro.tables.ReportscommentVO();
			var copyFields = ["commentId","createdWehn","id","userId"];
			for (var i = 0; i < copyFields.length; ++i)
			{
				vo[copyFields[i]] = raw[copyFields[i]];
				if (!vo[copyFields[i]] && kr3m.util.Util.contains(foreignKeyNames, copyFields[i]))
					vo[copyFields[i]] = null;
			}
			return vo;
		}



		public constructor(rawData?:any)
		{
			if (rawData)
			{
				for (var i in rawData)
				{
					if (cuboro.tables.ReportscommentVO.isColumnName(i))
						this[i] = rawData[i];
				}
			}
		}



		private wrapErrorCallback(
			errorCallback:ErrorCallback,
			functionName:string):ErrorCallback
		{
			if (!errorCallback)
				return errorCallback;

			var newCallback = (errorMessage) =>
			{
				errorCallback("cuboro.tables.ReportscommentVO." + functionName + " - " + errorMessage);
			}
			return newCallback;
		}



		/*
			Will be called after the class was created and filled
			with content from the database.
		*/
		public postLoad():void
		{
			// can be overwritten in derived classes
		}



		/*
			Will be called before the class' content will be
			written into the database.
		*/
		public preStore():void
		{
			// can be overwritten in derived classes
		}



		/*
			Will be called after the class' content was
			written into the database.
		*/
		public postStore():void
		{
			// can be overwritten in derived classes
		}



		public insert(
			callback?:(insertedId:number) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insert");
			this.preStore();
			db.insert("reportscomment", this, (insertedId:number) =>
			{
				this.id = insertedId;
				this.postStore();
				callback && callback(insertedId);
			}, errorCallback);
		}



		public upsert(
			callback?:(insertedId:number) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
			this.preStore();
			db.upsert("reportscomment", this, (insertedId:number) =>
			{
				this.id = insertedId || this.id;
				this.postStore();
				callback && callback(insertedId);
			}, null, errorCallback);
		}



		public update(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "update");
			this.preStore();
			db.update("reportscomment", this, () =>
			{
				this.postStore();
				callback && callback();
			}, "id", errorCallback);
		}



		public delete(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "delete");
			var where = db.escape("id = ?", [this.id]);
			db.deleteBatch("reportscomment", where, callback, errorCallback);
		}



		public getComment(
			callback:CB<cuboro.tables.CommentVO>,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "getComment");
			var sql = "SELECT * FROM `comments` WHERE `id` = ? LIMIT 0,1";
			sql = db.escape(sql, [this.commentId]);
			db.fetchRow(sql, (data) =>
			{
				if (!data)
					return callback(undefined);

				data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.CommentVO).prototype;
				data.postLoad();
				callback(data);
			}, errorCallback);
		}



		public getUser(
			callback:CB<cuboro.tables.UserVO>,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "getUser");
			var sql = "SELECT * FROM `users` WHERE `id` = ? LIMIT 0,1";
			sql = db.escape(sql, [this.userId]);
			db.fetchRow(sql, (data) =>
			{
				if (!data)
					return callback(undefined);

				data.__proto__ = kr3m.util.Factory.getInstance().map(cuboro.tables.UserVO).prototype;
				data.postLoad();
				callback(data);
			}, errorCallback);
		}

//# /!CLIENT
	}
}

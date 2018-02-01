﻿/*
	This file was automatically created using a source code generator.
	Do not edit this file manually as all changes will be overwritten
	the next time the generator runs again.
*/



/// <reference path="../../kr3m/types.ts"/>
//# !CLIENT
/// <reference path="../../kr3m/services/paramshelper.ts"/>
/// <reference path="../../kr3m/util/factory.ts"/>
//# /!CLIENT



module cuboro.tables
{
	export class AdminSettingVO
	{
		public static ID_MAX_LENGTH = 128;
		public static ID_MAX_LENGTH_SECURE = 64;

		public static VALUE_MAX_LENGTH = 128;
		public static VALUE_MAX_LENGTH_SECURE = 64;



		public id:string = ""; // varchar(128)
		public lastModifiedWhen:Date = new Date(); // timestamp
		public value:string = ""; // varchar(128)
//# !CLIENT



		public static isColumnName(name:string):boolean
		{
			return (["id","lastModifiedWhen","value"]).indexOf(name) >= 0;
		}



		public static getColumnNames():string[]
		{
			return ["id","lastModifiedWhen","value"];
		}



		/*
			Builds a proper cuboro.tables.AdminSettingVO class object from
			a POD / JSON object.

			If this is not possible, because some required attributes
			are missing for example, null will be returned.
		*/
		public static buildFrom(raw:any):cuboro.tables.AdminSettingVO
		{
			var helper = new kr3m.services.ParamsHelper(raw);
			if (!helper.validate({"id":"string","lastModifiedWhen":"Date","value":"string"}, {"id":"","lastModifiedWhen":"CURRENT_TIMESTAMP","value":""}))
				return null;

			var foreignKeyNames = [];
			var vo = new cuboro.tables.AdminSettingVO();
			var copyFields = ["id","lastModifiedWhen","value"];
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
					if (cuboro.tables.AdminSettingVO.isColumnName(i))
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
				errorCallback("cuboro.tables.AdminSettingVO." + functionName + " - " + errorMessage);
			}
			return newCallback;
		}



		/*
			Will be called after the class was created and filled
			with content from the database.
		*/
		public postLoad():void
		{
			var autoUpdateFields = ["lastModifiedWhen"];
			var oldValues:{[field:string]:Date} = {};
			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				oldValues[field] = this[field];
			}
			Object.defineProperty(this, "__oldAutoUpdateFieldValues", {value : oldValues, enumerable : false});
		}



		/*
			Will be called before the class' content will be
			written into the database.
		*/
		public preStore():void
		{
			var autoUpdateFields = ["lastModifiedWhen"];

			if (!this["__oldAutoUpdateFieldValues"])
				Object.defineProperty(this, "__oldAutoUpdateFieldValues", {value : {}, enumerable : false});

			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				if (this[field] == this["__oldAutoUpdateFieldValues"][field])
					delete this[field];
				else
					this["__oldAutoUpdateFieldValues"][field] = this[field];
			}
		}



		/*
			Will be called after the class' content was
			written into the database.
		*/
		public postStore():void
		{
			var autoUpdateFields = ["lastModifiedWhen"];
			for (var i = 0; i < autoUpdateFields.length; ++i)
			{
				var field = autoUpdateFields[i];
				this[field] = this["__oldAutoUpdateFieldValues"][field];
			}
		}



		protected checkId(
			callback:(wasGenerated:boolean) => void,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "checkId");
			if (this.id)
				return callback(false);

			kr3m.async.Loop.loop((loopDone) =>
			{
				kr3m.util.Rand.getSecureString(128, null, (secureValue) =>
				{
					this.id = secureValue;
					db.fetchOne(db.escape("SELECT id FROM admin_settings WHERE id = ? LIMIT 0,1;", [this.id]), dummy => loopDone(!!dummy), errorCallback);
				});
			}, () => callback(true));
		}



		public insert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "insert");
			var retries = 3;
			kr3m.async.Loop.loop((loopDone) =>
			{
				this.checkId((wasGenerated) =>
				{
					this.preStore();
					db.insert("admin_settings", this, () =>
					{
						this.postStore();
						callback && callback();
					}, (errorMessage) =>
					{
						if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0)
						{
							if (errorCallback)
								return errorCallback(errorMessage);

							logError(errorMessage);
							return callback && callback();
						}

						logWarning(errorMessage);
						logWarning("retrying");
						--retries;
						loopDone(true);
					});
				});
			});
		}



		public upsert(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "upsert");
			var retries = 3;
			kr3m.async.Loop.loop((loopDone) =>
			{
				this.checkId((wasGenerated) =>
				{
					this.preStore();
					db.upsert("admin_settings", this, () =>
					{
						this.postStore();
						callback && callback();
					}, null, (errorMessage) =>
					{
						if (!wasGenerated || retries <= 0 || errorMessage.indexOf("ER_DUP_ENTRY") < 0)
						{
							if (errorCallback)
								return errorCallback(errorMessage);

							logError(errorMessage);
							return callback && callback();
						}

						logWarning(errorMessage);
						logWarning("retrying");
						--retries;
						loopDone(true);
					});
				});
			});
		}



		public update(
			callback?:Callback,
			errorCallback?:ErrorCallback):void
		{
			errorCallback = this.wrapErrorCallback(errorCallback, "update");
			this.preStore();
			db.update("admin_settings", this, () =>
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
			db.deleteBatch("admin_settings", where, callback, errorCallback);
		}

//# /!CLIENT
	}
}

/// <reference path="../../../tools/mysqlvogenerator/subgens/vogen.ts"/>



module kr3m.tools.mysqlvogenerator.subgens
{
	export class ConstGen extends VoGen
	{
		constructor(db:kr3m.db.MySqlDb, params:kr3m.tools.mysqlvogenerator.Parameters, tableName:string)
		{
			super(db, params, tableName);
			this.references = [];
		}



		protected getFileName():string
		{
			var name = this.singular(this.tableName);
			return name.toLowerCase().replace(/[^a-z0-9]/g, "") + "const.ts";
		}



		public generate(callback:() => void):void
		{
			this.generateStart();
			this.db.getTableColumns(this.tableName, (columns:any[]) =>
			{
				kr3m.util.Util.sortBy(columns, "Field");
				var hasConstants = this.generateConstants(columns);
				if (!hasConstants)
					return callback();

				this.generateEnd();
				this.saveToFile(this.params.targetPath + this.getFileName());
				callback();
			});
		}
	}
}

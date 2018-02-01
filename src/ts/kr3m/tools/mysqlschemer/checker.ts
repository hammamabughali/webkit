/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../tools/mysqlschemer/delta.ts"/>
/// <reference path="../../tools/mysqlschemer/model.ts"/>



module kr3m.tools.mysqlschemer
{
	export abstract class Checker extends Model
	{
		public abstract findDeltas(structure:any, schema:any):Delta[];
	}
}

/// <reference path="../../async/delayed.ts"/>
/// <reference path="../../async/join.ts"/>
/// <reference path="../../async/loop.ts"/>
/// <reference path="../../db/mysqldb.ts"/>
/// <reference path="../../tools/mysqlschemer/checker.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/columntype.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/constrainttype.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/missingcolumn.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/missingconstraint.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/missingindex.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/missingtable.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/obsoletecolumn.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/obsoleteconstraint.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/obsoleteindex.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/obsoletetable.ts"/>
/// <reference path="../../tools/mysqlschemer/checkers/renamedcolumn.ts"/>
/// <reference path="../../tools/mysqlschemer/delta.ts"/>
/// <reference path="../../types.ts"/>



module kr3m.tools.mysqlschemer
{
	/*
		Class for automatic generation and updates to database
		structures.

		Warning: this class might damage a database or delete
		important data if not used carefully. Use at your own
		risk and never without backups!
	*/
	export class Schemer
	{
		private checkers:Checker[] = [];
		private structure:any;

		private delay:kr3m.async.Delayed;



		constructor(private db:kr3m.db.MySqlDb, private schema:any)
		{
			// Die Reihenfolge der Checker ist wichtig!
			this.checkers.push(new checkers.MissingTable(db));
			this.checkers.push(new checkers.ObsoleteConstraint(db));
			this.checkers.push(new checkers.RenamedColumn(db));
			this.checkers.push(new checkers.MissingColumn(db));
			this.checkers.push(new checkers.ObsoleteIndex(db));
			this.checkers.push(new checkers.MissingIndex(db));
			this.checkers.push(new checkers.ObsoleteColumn(db));
			this.checkers.push(new checkers.ColumnType(db));
			this.checkers.push(new checkers.ConstraintType(db));
			this.checkers.push(new checkers.MissingConstraint(db));
			this.checkers.push(new checkers.ObsoleteTable(db));
		}



		private loadStructure(
			callback:Callback):void
		{
			this.db.getTableNames((tableNames) =>
			{
				var structure:any = {};
				kr3m.async.Loop.forEach(tableNames, (tableName, next) =>
				{
					var join = new kr3m.async.Join();
					this.db.getTableColumns(tableName, join.getCallback("columns"));
					this.db.getTableIndexes(tableName, join.getCallback("indexes"));
					this.db.getTableConstraints(tableName, join.getCallback("constraints"));
					join.addCallback(() =>
					{
						structure[tableName] =
						{
							columns :kr3m.util.Util.arrayToAssoc(join.getResult("columns"), "Field"),
							indexes : join.getResult("indexes"),
							constraints :kr3m.util.Util.arrayToAssoc(join.getResult("constraints"), "column")
						};
						next();
					});
				}, () =>
				{
					this.structure = structure;
					callback();
				});
			});
		}



		private init(
			callback:Callback):void
		{
			if (!this.delay)
			{
				this.delay = new kr3m.async.Delayed();
				this.loadStructure(() => this.delay.execute());
			}
			this.delay.call(callback);
		}



		public findDeltas(
			callback:(deltas:Delta[]) => void):void
		{
			this.init(() =>
			{
				var deltas:Delta[] = [];
				for (var i = 0; i < this.checkers.length; ++i)
					deltas = deltas.concat(this.checkers[i].findDeltas(this.structure, this.schema));
				callback(deltas);
			});
		}



		public applyDeltas(
			deltas:Delta[],
			options:{doDrops?:boolean},
			callback:StatusCallback):void
		{
			this.init(() =>
			{
				kr3m.async.Loop.forEach(deltas, (delta, next) =>
				{
					if (delta.isDrop && !options.doDrops)
						return next();

					logWarning(delta.message);
					logVerbose(delta.fixScript);
					this.db.query(delta.fixScript, (result) =>
					{
						if (!result)
							return callback(kr3m.ERROR_INTERNAL);

						next();
					});
				}, () => callback(kr3m.SUCCESS));
			});
		}
	}
}

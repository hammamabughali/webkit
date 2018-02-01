/// <reference path="../../../async/loop.ts"/>
/// <reference path="../../../tools/mysqlvogenerator/subgens/subgen.ts"/>
/// <reference path="../../../util/util.ts"/>



module kr3m.tools.mysqlvogenerator.subgens
{
	export class VoGen extends SubGen
	{
		protected tableName:string;
		protected propertyTypes:{[name:string]:string} = {};



		constructor(db:kr3m.db.MySqlDb, params:kr3m.tools.mysqlvogenerator.Parameters, tableName:string)
		{
			super(db, params);
			this.tableName = tableName;

			this.addGlobalReference("kr3m/services/paramshelper.ts", ["!CLIENT"]);
		}



		public getVOClassName(table:string = null):string
		{
			table = table || this.tableName;
			var name = this.singular(super.getClassName(table));
			return name + "VO";
		}



		public generateStart():void
		{
			super.generateStart();

			var className = this.getVOClassName();
			this.out("module " + this.params.moduleName);
			this.out("{");
			this.out("	export class " + className);
			this.out("	{");
		}



		private getPropertyComment(propType:string, type:string):string
		{
			var pats = kr3m.tools.mysqlvogenerator.subgens.TabGen.typePatterns[propType];
			if (!pats)
				return "";

			for (var j = 0; j < pats.length; ++j)
			{
				var pat:RegExp = pats[j];
				var matches = type.match(pat);
				if (matches)
					return (matches.length > 1) ? " // " + matches.slice(1).join(" ") : "";
			}
			return "";
		}



		private getPropertyDefault(
			type:string,
			canBeNull:boolean,
			value:any):string
		{
			if (value === null)
				return canBeNull ? " = null" : "";

			switch (type)
			{
				case "boolean":
					return " = " + value;

				case "number":
					return " = " + value;

				case "string":
					return " = \"" + value + "\"";

				case "Date":
					if (kr3m.util.Util.contains(["CURRENT_TIMESTAMP", "0000-00-00", "0000-00-00 00:00:00"], value))
						return " = new Date()";

					return " = new Date(\"" + value + "\")";
			}
			log("unknown default value for " + type + ": " + value);
			return "";
		}



		protected generateConstants(columns:any[]):boolean
		{
			var enumPat = /^(enum|set)\((.+)\)$/;
			var textPat = /^(varchar|char|tinytext|mediumtext|text|longtext)(?:\((\d+)\))?$/;
			var textLengths =
			{
				tinytext : 255,
				text : 65535,
				mediumtext : 16777215,
				longtext : 4294967295
			};
			var hasConstants = false;
			for (var i = 0; i < columns.length; ++i)
			{
				var enumMatches = columns[i].Type.match(enumPat);
				if (enumMatches)
				{
					var parts = enumMatches[2].split(",");
					for (var j = 0; j < parts.length; ++j)
						parts[j] = parts[j].slice(1, -1);

					if (parts.length != 2 || parts[0] != "false" || parts[1] != "true")
					{
						var prefix = columns[i].Field.replace(/([A-Z])/g, "_$1").toUpperCase() + "_";
						if (enumMatches[1] == "set" && prefix.slice(-2, -1) == "S")
							prefix = prefix.slice(0, -2) + "_";

						for (var j = 0; j < parts.length; ++j)
						{
							var constant = prefix + parts[j].toUpperCase();
							this.out("\t\tpublic static " + constant + " = \"" + parts[j] + "\";");
						}

						constant = prefix.slice(0, -1);
						if (constant.slice(-1) != "S")
							constant += "S";
						this.out("\t\tpublic static " + constant + " = [\"" + parts.join("\", \"") + "\"];");
						hasConstants = true;
						this.out("");
					}
				}
				var textMatches = columns[i].Type.match(textPat);
				if (textMatches)
				{
					var maxLength = textMatches[2] ? parseInt(textMatches[2], 10) : (textLengths[textMatches[1]] || -1);
					var secureLength = Math.floor(maxLength / 2);

					var prefix:string = columns[i].Field.replace(/([A-Z])/g, "_$1").toUpperCase();
					this.out("\t\tpublic static " + prefix + "_MAX_LENGTH = " + maxLength + ";");
					this.out("\t\tpublic static " + prefix + "_MAX_LENGTH_SECURE = " + secureLength + ";");

					hasConstants = true;
					this.out("");
				}
			}

			if (hasConstants)
				this.out("\n");

			return hasConstants;
		}



		private generateProperties(columns:any[]):void
		{
			for (var i = 0; i < columns.length; ++i)
			{
				var type = this.getPropertyType(columns[i].Type);
				this.propertyTypes[columns[i].Field] = type;
				if (columns[i].Comment != "")
					this.out("\n" + kr3m.util.StringEx.wrapText(columns[i].Comment, 70, "		// "));

				var defaultValue = this.getPropertyDefault(type, columns[i].Null == "YES", columns[i].Default);
				var postComment = this.getPropertyComment(type, columns[i].Type);
				this.out("\t\tpublic " + columns[i].Field + ":" + type + defaultValue + ";" + postComment);
			}
		}



		private generateFinders(constraints:any[], callback:Callback):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			var idPat = /id$/i;
			kr3m.async.Loop.forEach(constraints, (constraint, loopCallback) =>
			{
				this.db.getTableIndexes(constraint.foreignTable, (indexes) =>
				{
					indexes = indexes.filter(index => index.parts[0] == constraint.foreignColumn);
					kr3m.util.Util.sortBy(indexes, "parts.length", true);
					var isUnique = indexes[0].parts.length == 1 && indexes[0].unique;
					var finderName = "get" + this.capitalKeys([constraint.column])[0];
					if (idPat.test(finderName))
						finderName = finderName.slice(0, -2);
					var resultClassName = this.getVOClassName(constraint.foreignTable);
					this.addLocalReference(resultClassName + ".ts");
					resultClassName = this.params.moduleName + "." + resultClassName;

					this.out("\n\n");

					var tokens =
					{
						finderName : finderName,
						resultClassName : resultClassName,
						constraintForeignTable : constraint.foreignTable,
						constraintForeignColumn : constraint.foreignColumn,
						constraintColumn : constraint.column
					};
					this.out(isUnique ? templates.VO_FINDERS_UNIQUE : templates.VO_FINDERS, tokens);
					loopCallback();
				});
			}, callback);
		}



		private generateForeignFinders(foreignConstraints:any[], callback:Callback):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			var referenceCounts:any = {};
			for (var i = 0; i < foreignConstraints.length; ++i)
				referenceCounts[foreignConstraints[i].table] = referenceCounts[foreignConstraints[i].table] ? referenceCounts[foreignConstraints[i].table] + 1 : 1;

			kr3m.async.Loop.forEach(foreignConstraints, (foreignConstraint, next) =>
			{
				this.db.getTableColumns(foreignConstraint.table, (foreignColumns) =>
				{
					this.db.getTableIndexes(foreignConstraint.table, (indexes) =>
					{
						indexes = indexes.filter(index => index.parts[0] == foreignConstraint.column);
						if (indexes.length == 0)
							return next();

						kr3m.util.Util.sortBy(indexes, "parts.length", true);
						var index = indexes[0];

						for (var i = 0; i < index.parts.length; ++i)
						{
							var bonusParts = index.parts.slice(1, i + 1);
							var isUnique = index.unique && index.parts.length == i + 1;

							var finderName = "get";
							finderName += this.capitalKeys(foreignConstraint.table.split("_")).join("");
							if (isUnique)
								finderName = this.singular(finderName);

							var whereColumns:string[] = [foreignConstraint.foreignColumn];
							if (referenceCounts[foreignConstraint.table] != 1)
							{
								finderName += "From";
								finderName += this.capitalKeys(foreignConstraint.column.split("_")).join("");
								// whereColumns = [foreignConstraint.column.split("_").join("")];
							}

							if (i > 0)
							{
								finderName += "By";
								finderName += this.capitalKeys(bonusParts).join("");
								whereColumns = whereColumns.concat(bonusParts);
							}

							var resultClassName = this.getVOClassName(foreignConstraint.table);
							this.addLocalReference(resultClassName + ".ts");
							resultClassName = this.params.moduleName + "." + resultClassName;

							this.out("\n\n");

							var bonusParams:string[] = [];
							var bonusParamsStringCount = 0;
							var bonusOverloads:string[] = [];
							for (var j = 0; j < bonusParts.length; ++j)
							{
								var bonusName = bonusParts[j];
								var bonusType = this.getPropertyType(kr3m.util.Util.getBy(foreignColumns, "Field", bonusName).Type);
								if (bonusType == "string")
									++bonusParamsStringCount;

								bonusParams.push(bonusName + ":" + bonusType);
								bonusOverloads.push("var " + bonusName + " = <" + bonusType + "> u.getFirstOfType(arguments, \"" + bonusType + "\", " + j + ", 0);");
							}

							var tokens =
							{
								resultClassName : resultClassName,
								finderName : finderName,
								foreignConstraintColumn : "`" + index.parts.slice(0, i + 1).join("` = ? AND `") + "` = ?",
								foreignConstraintTable : foreignConstraint.table,
								foreignConstraintForeignColumn : whereColumns.join(", "),
								bonusParams : bonusParams.length > 0 ? ("\n\t\t\t" + bonusParams.join(",\n\t\t\t") + ",") : "",
								bonusOffset : bonusParams.length,
								bonusOverloads : bonusOverloads.join("\n\t\t\t") + "\n\t\t\t",
								bonusParamsStringCount : bonusParamsStringCount
							};
							this.out(isUnique ? templates.VO_FOREIGN_FINDERS_UNIQUE : templates.VO_FOREIGN_FINDERS, tokens);
						}
						next();
					});
				});
			}, callback);
		}



		private checkForDuplicateForeignConstraints(foreignConstraints:any[]):void
		{
			for (var i = 1; i < foreignConstraints.length; ++i)
			{
				var a = foreignConstraints[i];
				for (var j = 0; j < i; ++j)
				{
					var b = foreignConstraints[j];
					if (a.table == b.table && a.column == b.column)
					{
						logWarning("table", a.table, "has redundant constraint on column", a.column, "- skipping duplicate");
						foreignConstraints.splice(j--, 1);
						--i;
					}
				}
			}
		}



		private checkForDuplicateConstraints(constraints:any[]):void
		{
			for (var i = 1; i < constraints.length; ++i)
			{
				var a = constraints[i];
				for (var j = 0; j < i; ++j)
				{
					var b = constraints[j];
					if (a.column == b.column)
					{
						logWarning("table", a.table, "has redundant constraint on column", a.column, "- skipping duplicate");
						constraints.splice(j--, 1);
						--i;
					}
				}
			}
		}



		public generateCRUD(
			columns:any[],
			indexes:any[],
			constraints:any[]):void
		{
			this.out("\n\n");
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;

			var copyFields = kr3m.util.Util.gather(columns, "Field");
			var validateFallbacks = kr3m.util.Util.arrayToPairs(columns, "Field", "Default");
			for (var i = 0; i < columns.length; ++i)
			{
				var field = columns[i].Field;
				if (validateFallbacks[field] === null && columns[i].Null == "NO")
					delete validateFallbacks[field];
			}

			var foreignKeyNames = kr3m.util.Util.gather(constraints, "column");
			var autoUpdateFieldNames = columns.filter(col => col.Extra == "on update CURRENT_TIMESTAMP").map(col => col.Field);

			var tokens:any =
			{
				tableName : this.tableName,
				resultClassName : this.params.moduleName + "." + this.getVOClassName(),
				validateObject : kr3m.util.Json.encode(this.propertyTypes),
				validateFallbacks : kr3m.util.Json.encode(validateFallbacks),
				copyFields : kr3m.util.Json.encode(copyFields),
				foreignKeyNames : kr3m.util.Json.encode(foreignKeyNames),
				autoUpdateFields : kr3m.util.Json.encode(autoUpdateFieldNames)
			};

			this.out(templates.VO, tokens);
			this.out("\n\n");
			this.out(autoUpdateFieldNames.length > 0 ? templates.VO_PREPOST_AUTOUPDATE : templates.VO_PREPOST, tokens);
			this.out("\n\n");

			var primary = kr3m.util.Util.getBy(indexes, "name", "PRIMARY");
			if (!primary || primary.parts.length != 1)
				return this.out(templates.VO_CRUD, tokens);

			var idColumn = kr3m.util.Util.getBy(columns, "Field", primary.parts[0]);
			var matches = idColumn.Type.match(/(?:var)?char\((\d+)\)/i);
			tokens.idLength = matches ? matches[1] : "-1";
			tokens.idName = primary.parts[0];
			tokens.idType = this.propertyTypes[tokens.idName];
			tokens.idNameCapital = this.capitalKeys([tokens.idName])[0],
			this.out(tokens.idType == "number" ? templates.VO_CRUD_ID_NUMBER : templates.VO_CRUD_ID, tokens);
		}



		protected generateSetMethods(columns:any[]):void
		{
			var templates = kr3m.tools.mysqlvogenerator.TEMPLATES;
			for (var i = 0; i < columns.length; ++i)
			{
				if (!columns[i].Type.match(/^set\(.+\)$/))
					continue;

				this.out("\n\n");

				var c = columns[i];
				var tokens =
				{
					resultClassName : this.getVOClassName(),
					setName : c.Field,
					setNameCapital : this.capitalKeys([c.Field]).join(""),
					setNameSingularCapital : this.capitalKeys([this.singular(c.Field)]).join(""),
					setNameSingularLower : this.singular(c.Field),
					setValuesArray : c.Field.replace(/([A-Z])/g, "_$1").toUpperCase()
				};
				this.out(templates.VO_SET_METHODS, tokens);
			}
		}



		protected generateEnd():void
		{
			this.out("	}");
			this.out("}");
		}



		protected getFileName():string
		{
			var name = this.singular(this.tableName);
			return name.toLowerCase().replace(/[^a-z0-9]/g, "") + "vo.ts";
		}



		public generate(callback:Callback):void
		{
			if (this.params.verbose)
			{
				this.logSep();
				log("	" + this.getVOClassName());
				this.logSep();
			}
			else
			{
				log(this.getVOClassName());
			}

			this.generateStart();
			this.db.getTableColumns(this.tableName, (columns) =>
			{
				kr3m.util.Util.sortBy(columns, "Field");
				this.generateConstants(columns);
				this.generateProperties(columns);
				this.db.getTableIndexes(this.tableName, (indexes) =>
				{
					indexes.sort((a, b) => a.parts.join(",").localeCompare(b.parts.join(",")));
					this.db.getTableForeignConstraints(this.tableName, (foreignConstraints) =>
					{
						this.checkForDuplicateForeignConstraints(foreignConstraints);
						this.db.getTableConstraints(this.tableName, (constraints) =>
						{
							this.checkForDuplicateConstraints(constraints);
							this.out("//" + "# !CLIENT");
							this.generateCRUD(columns, indexes, constraints);
							this.generateFinders(constraints, () =>
							{
								this.generateForeignFinders(foreignConstraints, () =>
								{
									this.generateSetMethods(columns);
									this.out("//" + "# /!CLIENT");
									this.generateEnd();
									this.saveToFile(this.params.targetPath + this.getFileName());
									callback();
								});
							});
						});
					});
				});
			});
		}
	}
}
